export type VisualizationEventType =
  | "compare"
  | "swap"
  | "overwrite"
  | "markSorted"
  | "pivot"
  | "merge";

/**
 * Event schema:
 * - Algorithms emit semantic events instead of mutating React state directly.
 * - `targetIds` are stable scene element IDs, so the same model can address bars, tree nodes,
 *   graph nodes, or edges later.
 * - `payload` carries domain-specific data such as overwrite values, traversal metadata, or
 *   merge ranges without changing the playback engine.
 */
export type VisualizationEvent = {
  type: VisualizationEventType;
  label: string;
  targetIds: string[];
  sourceIds?: string[];
  payload?: Record<string, unknown>;
};

export type VisualizationFrame<State> = {
  step: number;
  event: VisualizationEvent | null;
  state: State;
};

export type VisualizationTimeline<State> = {
  events: VisualizationEvent[];
  frames: VisualizationFrame<State>[];
};

export type PlaybackStatus = "ready" | "playing" | "paused" | "completed";

