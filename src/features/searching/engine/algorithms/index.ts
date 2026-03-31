import { buildTimeline } from "@/lib/animation/timeline";
import type { VisualizationEvent } from "@/lib/animation/types";
import { createSearchingEvent } from "@/features/searching/engine/event-helpers";
import { reduceSearchingEvent } from "@/features/searching/engine/reducer";
import { createInitialSearchingState } from "@/features/searching/engine/sample-run";
import type {
  SearchAlgorithmId,
  SearchingTimeline,
} from "@/features/searching/engine/types";

type SearchingImplementation = (values: number[], target: number) => VisualizationEvent[];

type SearchRecorder = {
  compare: (rangeIndices: number[], checkedIndex: number, payload: SearchEventPayload) => number;
  markFound: (index: number, payload: SearchEventPayload) => void;
  annotate: (payload: SearchEventPayload) => void;
  finish: () => VisualizationEvent[];
};

type SearchEventPayload = {
  label: string;
  stepTitle: string;
  stepDetail: string;
  pseudocodeLine: number | null;
  checkedValue?: number;
  target: number;
};

function createIndexRange(start: number, end: number) {
  if (end < start) {
    return [];
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function createRecorder(values: number[], target: number): SearchRecorder {
  const events: VisualizationEvent[] = [];

  function pushEvent(event: VisualizationEvent) {
    events.push(event);
  }

  return {
    compare(rangeIndices, checkedIndex, payload) {
      const checkedValue = values[checkedIndex];

      pushEvent(
        createSearchingEvent("compare", rangeIndices, payload.label, {
          sourceIndices: [checkedIndex],
          payload: {
            ...payload,
            checkedValue,
            target,
          },
        }),
      );

      return checkedValue - target;
    },
    markFound(index, payload) {
      pushEvent(
        createSearchingEvent("markFound", [index], payload.label, {
          payload: {
            ...payload,
            checkedValue: values[index],
            target,
          },
        }),
      );
    },
    annotate(payload) {
      pushEvent(
        createSearchingEvent("annotate", [], payload.label, {
          payload: {
            ...payload,
            target,
          },
        }),
      );
    },
    finish() {
      return events;
    },
  };
}

function emitLinearSearchEvents(values: number[], target: number) {
  const recorder = createRecorder(values, target);

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    const difference = recorder.compare([index], index, {
      label: `Checking ${value} against target ${target}`,
      stepTitle: `Comparing ${value} with ${target}`,
      stepDetail:
        value === target
          ? "The current value matches the target, so the search can stop here."
          : "Linear Search checks one value at a time and moves forward until it finds the target or reaches the end.",
      pseudocodeLine: 2,
      checkedValue: value,
      target,
    });

    if (difference === 0) {
      recorder.markFound(index, {
        label: `Found ${target} at index ${index + 1}`,
        stepTitle: `Found ${target}`,
        stepDetail:
          "The current value matches the target exactly, so Linear Search returns this position.",
        pseudocodeLine: 3,
        checkedValue: value,
        target,
      });
      return recorder.finish();
    }
  }

  recorder.annotate({
    label: `${target} was not found`,
    stepTitle: "Target not found",
    stepDetail:
      "Linear Search inspected every value in order and never found a match, so the search ends with no result.",
    pseudocodeLine: 4,
    target,
  });

  return recorder.finish();
}

function emitBinarySearchEvents(values: number[], target: number) {
  const recorder = createRecorder(values, target);
  let low = 0;
  let high = values.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midValue = values[mid];
    const activeRange = createIndexRange(low, high);
    const difference = recorder.compare(activeRange, mid, {
      label: `Checking midpoint ${midValue} against target ${target}`,
      stepTitle: `Checking midpoint ${midValue}`,
      stepDetail:
        midValue === target
          ? "The midpoint matches the target, so Binary Search is done."
          : midValue < target
            ? "The midpoint is smaller than the target, so everything to the left can be discarded."
            : "The midpoint is larger than the target, so everything to the right can be discarded.",
      pseudocodeLine: 4,
      checkedValue: midValue,
      target,
    });

    if (difference === 0) {
      recorder.markFound(mid, {
        label: `Found ${target} at midpoint ${mid + 1}`,
        stepTitle: `Found ${target}`,
        stepDetail:
          "Binary Search found an exact midpoint match, so it can return this position immediately.",
        pseudocodeLine: 5,
        checkedValue: midValue,
        target,
      });
      return recorder.finish();
    }

    if (difference < 0) {
      low = mid + 1;
      continue;
    }

    high = mid - 1;
  }

  recorder.annotate({
    label: `${target} was not found`,
    stepTitle: "Target not found",
    stepDetail:
      "Binary Search kept shrinking the sorted range until no candidates were left, so the target is not present.",
    pseudocodeLine: 8,
    target,
  });

  return recorder.finish();
}

const implementations: Record<SearchAlgorithmId, SearchingImplementation> = {
  linear: emitLinearSearchEvents,
  binary: emitBinarySearchEvents,
};

export function buildSearchingTimeline(
  algorithmId: SearchAlgorithmId,
  values: number[],
  target: number,
): SearchingTimeline {
  const implementation = implementations[algorithmId];
  const events = implementation(values, target);

  return buildTimeline({
    initialState: createInitialSearchingState(values, target),
    events,
    reducer: reduceSearchingEvent,
  });
}
