import type { SortingAnimationState, SortingMetrics } from "@/features/sorting/engine/types";

function createRandomValue() {
  return Math.floor(Math.random() * 88) + 12;
}

function createSeededValue(seed: number) {
  let nextSeed = seed;

  return () => {
    nextSeed = (nextSeed * 1664525 + 1013904223) % 4294967296;
    return Math.floor((nextSeed / 4294967296) * 88) + 12;
  };
}

export function createDataset(size: number, seed?: number) {
  if (typeof seed === "number") {
    return Array.from({ length: size }, createSeededValue(seed));
  }

  return Array.from({ length: size }, createRandomValue);
}

export function createBaseMetrics(): SortingMetrics {
  return {
    comparisons: 0,
    swaps: 0,
    overwrites: 0,
    operations: 0,
    elapsedMs: 0,
  };
}

export function createInitialSortingState(values: number[]): SortingAnimationState {
  return {
    values: [...values],
    comparedIndices: [],
    swappedIndices: [],
    overwrittenIndices: [],
    sortedIndices: [],
    pivotIndices: [],
    mergedIndices: [],
    metrics: {
      comparisons: 0,
      swaps: 0,
      overwrites: 0,
    },
    summary: "Ready to sort",
  };
}
