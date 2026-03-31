export type SortingAlgorithmId =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick"
  | "native-js";

export type InputDistribution = "random" | "nearly-sorted";

export type PlaybackStatus = "idle" | "ready" | "playing" | "paused";

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
  category: "comparison" | "native";
  bigO: BigOSummary;
};

export type SortingMetrics = {
  comparisons: number;
  swaps: number;
  writes: number;
  arrayAccesses: number;
  playbackMs: number;
};

export type SortingRunConfig = {
  algorithmId: SortingAlgorithmId;
  distribution: InputDistribution;
  size: number;
  speed: number;
};

export type SortingSnapshot = {
  values: number[];
  activeIndices: number[];
  sortedIndices: number[];
  pivotIndex: number | null;
  metrics: SortingMetrics;
  status: PlaybackStatus;
};

