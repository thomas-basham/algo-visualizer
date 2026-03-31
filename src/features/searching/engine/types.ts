import type { VisualizationEvent, VisualizationTimeline } from "@/lib/animation/types";

export type SearchAlgorithmId = "linear" | "binary";

export type SearchPseudocodeLine = {
  line: number;
  code: string;
};

export type SearchAlgorithmMeta = {
  id: SearchAlgorithmId;
  label: string;
  description: string;
  beginnerExplanation: string;
  pseudocode: SearchPseudocodeLine[];
  note?: string;
  implemented: boolean;
  bigO: {
    best: string;
    average: string;
    worst: string;
    space: string;
  };
};

export type SearchingMetrics = {
  steps: number;
  comparisons: number;
  elapsedMs: number;
};

export type SearchingRunConfig = {
  algorithmId: SearchAlgorithmId;
  size: number;
  speed: number;
};

export type SearchingAnimationState = {
  values: number[];
  target: number;
  checkedIndices: number[];
  visitedIndices: number[];
  activeRangeIndices: number[];
  foundIndices: number[];
  metrics: Pick<SearchingMetrics, "comparisons">;
  summary: string;
};

export type SearchingEvent = VisualizationEvent;

export type SearchingTimeline = VisualizationTimeline<SearchingAnimationState>;
