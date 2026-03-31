import type { VisualizationEvent, VisualizationTimeline } from "@/lib/animation/types";

export type SortingAlgorithmId =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick"
  | "native-js";

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
  overwrites: number;
  elapsedMs: number;
};

export type SortingRunConfig = {
  algorithmId: SortingAlgorithmId;
  size: number;
  speed: number;
};

export type SortingAnimationState = {
  values: number[];
  comparedIndices: number[];
  swappedIndices: number[];
  overwrittenIndices: number[];
  sortedIndices: number[];
  pivotIndices: number[];
  mergedIndices: number[];
  metrics: Pick<SortingMetrics, "comparisons" | "swaps" | "overwrites">;
  summary: string;
};

export type SortingEvent = VisualizationEvent;

export type SortingTimeline = VisualizationTimeline<SortingAnimationState>;
