import { buildTimeline } from "@/lib/animation/timeline";
import type { VisualizationEvent } from "@/lib/animation/types";
import { createSortingEvent } from "@/features/sorting/engine/event-helpers";
import { reduceSortingEvent } from "@/features/sorting/engine/reducer";
import { createInitialSortingState } from "@/features/sorting/engine/sample-run";
import type { SortingAlgorithmId, SortingTimeline } from "@/features/sorting/engine/types";

type SortingImplementation = (values: number[]) => VisualizationEvent[];

type CompareOptions = {
  label?: string;
  leftValue?: number;
  rightValue?: number;
};

type EventRecorder = {
  values: number[];
  compare: (leftIndex: number, rightIndex: number, options?: CompareOptions) => number;
  swap: (leftIndex: number, rightIndex: number) => void;
  overwrite: (targetIndex: number, value: number, label: string) => void;
  markSorted: (indices: number[], label: string) => void;
  pivot: (indices: number[], label: string) => void;
  merge: (indices: number[], label: string) => void;
  finish: (finalLabel?: string) => VisualizationEvent[];
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
    compare(leftIndex, rightIndex, options = {}) {
      const leftValue = options.leftValue ?? values[leftIndex];
      const rightValue = options.rightValue ?? values[rightIndex];

      pushEvent(
        createSortingEvent(
          "compare",
          [leftIndex, rightIndex],
          options.label ?? `Comparing ${leftIndex + 1} and ${rightIndex + 1}`,
        ),
      );

      return leftValue - rightValue;
    },
    swap(leftIndex, rightIndex) {
      if (leftIndex === rightIndex) {
        return;
      }

      [values[leftIndex], values[rightIndex]] = [values[rightIndex], values[leftIndex]];
      pushEvent(
        createSortingEvent(
          "swap",
          [leftIndex, rightIndex],
          `Swapping ${leftIndex + 1} and ${rightIndex + 1}`,
        ),
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
    finish(finalLabel = "Sorting complete") {
      pushEvent(createSortingEvent("markSorted", createIndexRange(0, values.length - 1), finalLabel));
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

function emitMergeSortEvents(initialValues: number[]) {
  const recorder = createRecorder(initialValues);
  const { values } = recorder;

  function mergeSort(start: number, end: number) {
    if (start >= end) {
      return;
    }

    const midpoint = Math.floor((start + end) / 2);
    mergeSort(start, midpoint);
    mergeSort(midpoint + 1, end);

    const mergeRange = createIndexRange(start, end);
    recorder.merge(mergeRange, `Merging range ${start + 1}-${end + 1}`);

    const mergedValues: number[] = [];
    let left = start;
    let right = midpoint + 1;

    while (left <= midpoint && right <= end) {
      if (
        recorder.compare(left, right, {
          label: `Merge compare ${left + 1} and ${right + 1}`,
        }) <= 0
      ) {
        mergedValues.push(values[left]);
        left += 1;
      } else {
        mergedValues.push(values[right]);
        right += 1;
      }
    }

    while (left <= midpoint) {
      mergedValues.push(values[left]);
      left += 1;
    }

    while (right <= end) {
      mergedValues.push(values[right]);
      right += 1;
    }

    mergedValues.forEach((value, offset) => {
      const targetIndex = start + offset;
      recorder.overwrite(targetIndex, value, `Writing ${value} into position ${targetIndex + 1}`);
    });

    recorder.merge([], `Finished merge ${start + 1}-${end + 1}`);
  }

  mergeSort(0, values.length - 1);

  return recorder.finish();
}

function emitQuickSortEvents(initialValues: number[]) {
  const recorder = createRecorder(initialValues);
  const { values } = recorder;

  function partition(start: number, end: number) {
    const pivotValue = values[end];

    recorder.pivot([end], `Pivot chosen at index ${end + 1}`);

    let partitionIndex = start;

    for (let current = start; current < end; current += 1) {
      if (
        recorder.compare(current, end, {
          label: `Compare ${current + 1} against pivot ${end + 1}`,
          rightValue: pivotValue,
        }) < 0
      ) {
        recorder.swap(partitionIndex, current);
        partitionIndex += 1;
      }
    }

    recorder.swap(partitionIndex, end);
    recorder.pivot([partitionIndex], `Pivot moved to index ${partitionIndex + 1}`);

    return partitionIndex;
  }

  function quickSort(start: number, end: number) {
    if (start > end) {
      return;
    }

    if (start === end) {
      recorder.markSorted([start], `Single value at index ${start + 1} is sorted`);
      return;
    }

    const pivotIndex = partition(start, end);
    recorder.markSorted([pivotIndex], `Pivot locked at index ${pivotIndex + 1}`);
    recorder.pivot([], `Partition complete around index ${pivotIndex + 1}`);
    quickSort(start, pivotIndex - 1);
    quickSort(pivotIndex + 1, end);
  }

  quickSort(0, values.length - 1);

  return recorder.finish();
}

function emitNativeSortEvents(initialValues: number[]) {
  const recorder = createRecorder(initialValues);
  const items = initialValues.map((value, index) => ({ value, token: `${index}-${value}` }));

  items.sort((leftItem, rightItem) => {
    const leftIndex = items.findIndex((item) => item.token === leftItem.token);
    const rightIndex = items.findIndex((item) => item.token === rightItem.token);

    recorder.compare(leftIndex, rightIndex, {
      label: `Native comparator observed ${leftIndex + 1} and ${rightIndex + 1}`,
      leftValue: leftItem.value,
      rightValue: rightItem.value,
    });

    return leftItem.value - rightItem.value;
  });

  const finalValues = items.map((item) => item.value);
  const fullRange = createIndexRange(0, finalValues.length - 1);

  recorder.merge(fullRange, "Approximating native engine write-back");

  finalValues.forEach((value, index) => {
    if (recorder.values[index] !== value) {
      recorder.overwrite(index, value, `Approximate native overwrite at position ${index + 1}`);
    }
  });

  recorder.merge([], "Finished native write-back approximation");

  return recorder.finish("Approximate native sort complete");
}

const implementations: Record<SortingAlgorithmId, SortingImplementation> = {
  bubble: emitBubbleSortEvents,
  selection: emitSelectionSortEvents,
  insertion: emitInsertionSortEvents,
  merge: emitMergeSortEvents,
  quick: emitQuickSortEvents,
  "native-js": emitNativeSortEvents,
};

export function buildSortingTimeline(
  algorithmId: SortingAlgorithmId,
  values: number[],
): SortingTimeline {
  const implementation = implementations[algorithmId];
  const events = implementation(values);

  return buildTimeline({
    initialState: createInitialSortingState(values),
    events,
    reducer: reduceSortingEvent,
  });
}
