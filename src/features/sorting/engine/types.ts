export type SortingAlgorithmId =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick"
  | "native-js";

export type PlaybackStatus = "ready" | "playing" | "paused" | "completed";

export type BigOSummary = {
  best: string;
  average: string;
  worst: string;
  space: string;
  stable: boolean;
  inPlace: boolean;
};

export type SortingAlgorithmMeta = {
  id: SortingAlgorithmId;
  label: string;
  description: string;
  implemented: boolean;
  bigO: BigOSummary;
};

export type SortingMetrics = {
  comparisons: number;
  swaps: number;
  elapsedMs: number;
};

export type SortingRunConfig = {
  algorithmId: SortingAlgorithmId;
  size: number;
  speed: number;
};

export type SortingFrame = {
  values: number[];
  comparedIndices: number[];
  swappedIndices: number[];
  sortedIndices: number[];
  metrics: Pick<SortingMetrics, "comparisons" | "swaps">;
  label: string;
};

export type SortingRun = {
  frames: SortingFrame[];
};
