import type {
  SortingAnimationState,
  SortingInputPresetId,
  SortingMetrics,
} from "@/features/sorting/engine/types";

type DatasetOptions = {
  preset?: SortingInputPresetId;
  seed?: number;
};

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

function createRandomValue(random: () => number) {
  return Math.floor(random() * 88) + 12;
}

function createRandomDataset(size: number, random: () => number) {
  return Array.from({ length: size }, () => createRandomValue(random));
}

function createSortedBase(size: number, random: () => number) {
  return createRandomDataset(size, random).sort((left, right) => left - right);
}

function createNearlySortedDataset(size: number, random: () => number) {
  const values = createSortedBase(size, random);
  const swaps = Math.max(1, Math.floor(size * 0.12));

  for (let count = 0; count < swaps; count += 1) {
    const index = Math.floor(random() * Math.max(size - 1, 1));
    [values[index], values[index + 1]] = [values[index + 1], values[index]];
  }

  return values;
}

function createReversedDataset(size: number, random: () => number) {
  return createSortedBase(size, random).reverse();
}

function createFewUniqueDataset(size: number, random: () => number) {
  const uniqueCount = Math.min(5, Math.max(3, Math.floor(size / 8) + 1));
  const palette = Array.from({ length: uniqueCount }, () => createRandomValue(random)).sort(
    (left, right) => left - right,
  );

  return Array.from({ length: size }, () => {
    const paletteIndex = Math.floor(random() * palette.length);
    return palette[paletteIndex];
  });
}

export function createDataset(size: number, options: DatasetOptions = {}) {
  const { preset = "random", seed } = options;
  const random = createRandomSource(seed);

  switch (preset) {
    case "nearly-sorted":
      return createNearlySortedDataset(size, random);

    case "reversed":
      return createReversedDataset(size, random);

    case "few-unique":
      return createFewUniqueDataset(size, random);

    default:
      return createRandomDataset(size, random);
  }
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
