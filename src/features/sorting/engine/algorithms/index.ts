import { buildTimeline } from "@/lib/animation/timeline";
import type { VisualizationEvent } from "@/lib/animation/types";
import { createSortingEvent } from "@/features/sorting/engine/event-helpers";
import { reduceSortingEvent } from "@/features/sorting/engine/reducer";
import { createInitialSortingState } from "@/features/sorting/engine/sample-run";
import type { SortingAlgorithmId, SortingTimeline } from "@/features/sorting/engine/types";

type SortingImplementation = (values: number[]) => VisualizationEvent[];

type EventRecorder = {
  values: number[];
  events: VisualizationEvent[];
  compare: (leftIndex: number, rightIndex: number) => number;
  swap: (leftIndex: number, rightIndex: number) => void;
  overwrite: (targetIndex: number, value: number, label: string) => void;
  markSorted: (indices: number[], label: string) => void;
  pivot: (indices: number[], label: string) => void;
  merge: (indices: number[], label: string) => void;
  finish: () => VisualizationEvent[];
};

function createIndexRange(start: number, end: number) {
  if (end < start) {
    return [];
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function createRecorder(initialValues: number[]): EventRecorder {
  const values = [...initialValues];
  const events: VisualizationEvent[] = [];

  function pushEvent(event: VisualizationEvent) {
    events.push(event);
  }

  return {
    values,
    events,
    compare(leftIndex, rightIndex) {
      pushEvent(
        createSortingEvent("compare", [leftIndex, rightIndex], `Comparing ${leftIndex + 1} and ${rightIndex + 1}`),
      );

      return values[leftIndex] - values[rightIndex];
    },
    swap(leftIndex, rightIndex) {
      if (leftIndex === rightIndex) {
        return;
      }

      [values[leftIndex], values[rightIndex]] = [values[rightIndex], values[leftIndex]];
      pushEvent(
        createSortingEvent("swap", [leftIndex, rightIndex], `Swapping ${leftIndex + 1} and ${rightIndex + 1}`),
      );
    },
    overwrite(targetIndex, value, label) {
      values[targetIndex] = value;
      pushEvent(createSortingEvent("overwrite", [targetIndex], label, { value }));
    },
    markSorted(indices, label) {
      pushEvent(createSortingEvent("markSorted", indices, label));
    },
    pivot(indices, label) {
      pushEvent(createSortingEvent("pivot", indices, label));
    },
    merge(indices, label) {
      pushEvent(createSortingEvent("merge", indices, label));
    },
    finish() {
      pushEvent(
        createSortingEvent("markSorted", createIndexRange(0, values.length - 1), "Sorting complete"),
      );

      return events;
    },
  };
}

function emitBubbleSortEvents(initialValues: number[]) {
  const recorder = createRecorder(initialValues);
  const { values } = recorder;

  if (values.length < 2) {
    return recorder.finish();
  }

  for (let end = values.length - 1; end > 0; end -= 1) {
    let didSwap = false;

    for (let index = 0; index < end; index += 1) {
      if (recorder.compare(index, index + 1) > 0) {
        recorder.swap(index, index + 1);
        didSwap = true;
      }
    }

    recorder.markSorted([end], `Index ${end + 1} is now sorted`);

    if (!didSwap) {
      recorder.markSorted(createIndexRange(0, end - 1), "Array is already sorted");
      break;
    }
  }

  return recorder.finish();
}

function emitSelectionSortEvents(initialValues: number[]) {
  const recorder = createRecorder(initialValues);
  const { values } = recorder;

  for (let start = 0; start < values.length; start += 1) {
    let minIndex = start;

    for (let current = start + 1; current < values.length; current += 1) {
      if (recorder.compare(minIndex, current) > 0) {
        minIndex = current;
      }
    }

    recorder.swap(start, minIndex);
    recorder.markSorted([start], `Placed the next minimum at index ${start + 1}`);
  }

  return recorder.finish();
}

function emitInsertionSortEvents(initialValues: number[]) {
  const recorder = createRecorder(initialValues);
  const { values } = recorder;

  if (values.length > 0) {
    recorder.markSorted([0], "First value seeds the sorted prefix");
  }

  for (let current = 1; current < values.length; current += 1) {
    let probe = current;

    while (probe > 0) {
      if (recorder.compare(probe - 1, probe) <= 0) {
        break;
      }

      recorder.swap(probe - 1, probe);
      probe -= 1;
    }

    recorder.markSorted(createIndexRange(0, current), `Sorted prefix extends through ${current + 1}`);
  }

  return recorder.finish();
}

const implementations: Record<Extract<SortingAlgorithmId, "bubble" | "selection" | "insertion">, SortingImplementation> =
  {
    bubble: emitBubbleSortEvents,
    selection: emitSelectionSortEvents,
    insertion: emitInsertionSortEvents,
  };

export function buildSortingTimeline(
  algorithmId: SortingAlgorithmId,
  values: number[],
): SortingTimeline {
  const implementation = implementations[algorithmId as keyof typeof implementations];

  if (!implementation) {
    throw new Error(`Algorithm "${algorithmId}" is not implemented yet.`);
  }

  const events = implementation(values);

  return buildTimeline({
    initialState: createInitialSortingState(values),
    events,
    reducer: reduceSortingEvent,
  });
}
