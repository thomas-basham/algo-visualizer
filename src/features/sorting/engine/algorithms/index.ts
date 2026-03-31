import { createInitialFrame } from "@/features/sorting/engine/sample-run";
import type {
  SortingAlgorithmId,
  SortingFrame,
  SortingRun,
} from "@/features/sorting/engine/types";

type SortingImplementation = (values: number[]) => SortingRun;

type FrameRecorder = {
  values: number[];
  compare: (leftIndex: number, rightIndex: number) => number;
  swap: (leftIndex: number, rightIndex: number) => void;
  markSorted: (indices: number[], label: string) => void;
  finish: () => SortingRun;
};

function createIndexRange(start: number, end: number) {
  if (end < start) {
    return [];
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function createRecorder(initialValues: number[]): FrameRecorder {
  const values = [...initialValues];
  const sortedIndices = new Set<number>();
  let comparisons = 0;
  let swaps = 0;
  const frames: SortingFrame[] = [createInitialFrame(values)];

  function pushFrame({
    label,
    comparedIndices = [],
    swappedIndices = [],
  }: {
    label: string;
    comparedIndices?: number[];
    swappedIndices?: number[];
  }) {
    frames.push({
      values: [...values],
      comparedIndices,
      swappedIndices,
      sortedIndices: [...sortedIndices].sort((left, right) => left - right),
      metrics: {
        comparisons,
        swaps,
      },
      label,
    });
  }

  return {
    values,
    compare(leftIndex, rightIndex) {
      comparisons += 1;
      pushFrame({
        label: `Comparing ${leftIndex + 1} and ${rightIndex + 1}`,
        comparedIndices: [leftIndex, rightIndex],
      });

      return values[leftIndex] - values[rightIndex];
    },
    swap(leftIndex, rightIndex) {
      if (leftIndex === rightIndex) {
        return;
      }

      [values[leftIndex], values[rightIndex]] = [values[rightIndex], values[leftIndex]];
      swaps += 1;

      pushFrame({
        label: `Swapping ${leftIndex + 1} and ${rightIndex + 1}`,
        swappedIndices: [leftIndex, rightIndex],
      });
    },
    markSorted(indices, label) {
      let changed = false;

      for (const index of indices) {
        if (!sortedIndices.has(index)) {
          sortedIndices.add(index);
          changed = true;
        }
      }

      if (changed) {
        pushFrame({ label });
      }
    },
    finish() {
      for (const index of createIndexRange(0, values.length - 1)) {
        sortedIndices.add(index);
      }

      pushFrame({ label: "Sorting complete" });

      return { frames };
    },
  };
}

function runBubbleSort(initialValues: number[]): SortingRun {
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

function runSelectionSort(initialValues: number[]): SortingRun {
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

function runInsertionSort(initialValues: number[]): SortingRun {
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
    bubble: runBubbleSort,
    selection: runSelectionSort,
    insertion: runInsertionSort,
  };

export function buildSortingRun(algorithmId: SortingAlgorithmId, values: number[]): SortingRun {
  const implementation = implementations[algorithmId as keyof typeof implementations];

  if (!implementation) {
    throw new Error(`Algorithm "${algorithmId}" is not implemented yet.`);
  }

  return implementation(values);
}
