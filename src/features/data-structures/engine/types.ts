import type { VisualizationEvent, VisualizationTimeline } from "@/lib/animation/types";

export type DataStructureId =
  | "stack"
  | "queue"
  | "linked-list"
  | "binary-search-tree";

export type DataStructureOperationId = "add" | "remove" | "search";

export type DataStructurePseudocodeLine = {
  line: number;
  code: string;
};

export type DataStructureOperationMeta = {
  label: string;
  description: string;
  complexity: string;
  requiresValue: boolean;
  valueLabel?: string;
  valueHint?: string;
};

export type DataStructureMeta = {
  id: DataStructureId;
  label: string;
  description: string;
  beginnerExplanation: string;
  note?: string;
  operations: Record<DataStructureOperationId, DataStructureOperationMeta>;
  pseudocode: Record<DataStructureOperationId, DataStructurePseudocodeLine[]>;
};

export type LinearStructureNode = {
  id: string;
  value: number;
};

export type TreeStructureNode = {
  id: string;
  value: number;
  leftId: string | null;
  rightId: string | null;
};

export type LinearStructureSnapshot = {
  kind: "linear";
  nodes: LinearStructureNode[];
  nextId: number;
};

export type TreeStructureSnapshot = {
  kind: "tree";
  nodes: TreeStructureNode[];
  rootId: string | null;
  nextId: number;
};

export type DataStructureSnapshot = LinearStructureSnapshot | TreeStructureSnapshot;

export type DataStructureStateCollection = Record<DataStructureId, DataStructureSnapshot>;

export type DataStructureMetrics = {
  steps: number;
  comparisons: number;
  operations: number;
  elapsedMs: number;
};

export type DataStructureAnimationState = {
  structureId: DataStructureId;
  snapshot: DataStructureSnapshot;
  activeIds: string[];
  visitedIds: string[];
  foundIds: string[];
  insertedIds: string[];
  removedIds: string[];
  metrics: Pick<DataStructureMetrics, "comparisons" | "operations">;
  summary: string;
  stepTitle: string;
  stepDetail: string;
};

export type DataStructureEvent = VisualizationEvent;

export type DataStructureTimeline = VisualizationTimeline<DataStructureAnimationState>;

export type DataStructuresRunConfig = {
  structureId: DataStructureId;
  operationId: DataStructureOperationId;
  speed: number;
};
