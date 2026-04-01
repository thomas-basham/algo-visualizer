import type { VisualizationEvent, VisualizationTimeline } from "@/lib/animation/types";

export type GraphAlgorithmId = "bfs" | "dfs";

export type GraphPseudocodeLine = {
  line: number;
  code: string;
};

export type GraphAlgorithmMeta = {
  id: GraphAlgorithmId;
  label: string;
  description: string;
  beginnerExplanation: string;
  frontierLabel: string;
  note?: string;
  pseudocode: GraphPseudocodeLine[];
  bigO: {
    best: string;
    average: string;
    worst: string;
    space: string;
  };
};

export type GraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
};

export type GraphEdge = {
  id: string;
  from: string;
  to: string;
};

export type GraphSample = {
  id: string;
  name: string;
  description: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type GraphMetrics = {
  steps: number;
  comparisons: number;
  visitedCount: number;
  elapsedMs: number;
};

export type GraphRunConfig = {
  algorithmId: GraphAlgorithmId;
  speed: number;
  sampleId: string;
  startNodeId: string;
};

export type GraphAnimationState = {
  graph: GraphSample;
  frontierLabel: string;
  frontierNodeIds: string[];
  activeNodeIds: string[];
  activeEdgeIds: string[];
  visitedNodeIds: string[];
  traversalOrderIds: string[];
  currentNodeId: string | null;
  metrics: Pick<GraphMetrics, "comparisons" | "visitedCount">;
  summary: string;
  stepTitle: string;
  stepDetail: string;
  pseudocodeLine: number | null;
};

export type GraphEvent = VisualizationEvent;

export type GraphTimeline = VisualizationTimeline<GraphAnimationState>;
