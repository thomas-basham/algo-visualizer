import type {
  InputDistribution,
  SortingMetrics,
  SortingRunConfig,
  SortingSnapshot,
} from "@/features/sorting/engine/types";

function createRandomValue() {
  return Math.floor(Math.random() * 92) + 8;
}

function createRandomArray(size: number) {
  return Array.from({ length: size }, createRandomValue);
}

function createNearlySortedArray(size: number) {
  const values = Array.from({ length: size }, (_, index) =>
    Math.floor(((index + 1) / size) * 100),
  );

  for (let i = 0; i < Math.max(1, Math.floor(size / 8)); i += 1) {
    const first = Math.floor(Math.random() * size);
    const second = Math.floor(Math.random() * size);
    [values[first], values[second]] = [values[second], values[first]];
  }

  return values;
}

export function createDataset(size: number, distribution: InputDistribution) {
  return distribution === "nearly-sorted"
    ? createNearlySortedArray(size)
    : createRandomArray(size);
}

export function createEmptyMetrics(): SortingMetrics {
  return {
    comparisons: 0,
    swaps: 0,
    writes: 0,
    arrayAccesses: 0,
    playbackMs: 0,
  };
}

export function createPreviewSnapshot(config: SortingRunConfig): SortingSnapshot {
  const values = createDataset(config.size, config.distribution);
  const midpoint = Math.min(2, Math.max(0, values.length - 1));

  return {
    values,
    activeIndices: values.length > 1 ? [0, midpoint] : [0],
    sortedIndices: [],
    pivotIndex: config.algorithmId === "quick" && values.length > 0 ? values.length - 1 : null,
    metrics: createEmptyMetrics(),
    status: "ready",
  };
}

