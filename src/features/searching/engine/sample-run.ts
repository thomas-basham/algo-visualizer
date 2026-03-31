import type {
  SearchingAnimationState,
  SearchingMetrics,
} from "@/features/searching/engine/types";

function createSeededRandom(seed: number) {
  let nextSeed = seed;

  return () => {
    nextSeed = (nextSeed * 1664525 + 1013904223) % 4294967296;
    return nextSeed / 4294967296;
  };
}

function createRandomSource(seed?: number) {
  if (typeof seed === "number") {
    return createSeededRandom(seed);
  }

  return Math.random;
}

export function createSearchingDataset(size: number, seed?: number) {
  const random = createRandomSource(seed);
  let current = Math.floor(random() * 10) + 8;

  return Array.from({ length: size }, () => {
    current += Math.floor(random() * 8) + 3;
    return current;
  });
}

export function getDefaultSearchTarget(values: number[]) {
  return values[Math.floor(values.length / 2)] ?? 0;
}

export function getMissingSearchTarget(values: number[]) {
  return (values[values.length - 1] ?? 0) + 7;
}

export function createSearchingBaseMetrics(): SearchingMetrics {
  return {
    steps: 0,
    comparisons: 0,
    elapsedMs: 0,
  };
}

export function createInitialSearchingState(
  values: number[],
  target: number,
): SearchingAnimationState {
  return {
    values: [...values],
    target,
    checkedIndices: [],
    visitedIndices: [],
    activeRangeIndices: values.map((_, index) => index),
    foundIndices: [],
    metrics: {
      comparisons: 0,
    },
    summary: "Ready to search",
  };
}
