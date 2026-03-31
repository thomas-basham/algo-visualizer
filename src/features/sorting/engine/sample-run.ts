import type { SortingFrame, SortingMetrics } from "@/features/sorting/engine/types";

function createRandomValue() {
  return Math.floor(Math.random() * 88) + 12;
}

export function createDataset(size: number) {
  return Array.from({ length: size }, createRandomValue);
}

export function createBaseMetrics(): SortingMetrics {
  return {
    comparisons: 0,
    swaps: 0,
    elapsedMs: 0,
  };
}

export function createInitialFrame(values: number[]): SortingFrame {
  return {
    values: [...values],
    comparedIndices: [],
    swappedIndices: [],
    sortedIndices: [],
    metrics: {
      comparisons: 0,
      swaps: 0,
    },
    label: "Ready to sort",
  };
}
