import type { VisualizationEvent, VisualizationEventType } from "@/lib/animation/types";

const SEARCH_TARGET_PREFIX = "cell:";

type SearchingEventOptions = {
  sourceIndices?: number[];
  payload?: Record<string, unknown>;
};

export function createSearchTargetIds(indices: number[]) {
  return indices.map((index) => `${SEARCH_TARGET_PREFIX}${index}`);
}

export function parseSearchTargetIds(targetIds: string[] = []) {
  return targetIds
    .map((targetId) => Number(targetId.replace(SEARCH_TARGET_PREFIX, "")))
    .filter((index) => Number.isFinite(index));
}

export function createSearchingEvent(
  type: VisualizationEventType,
  indices: number[],
  label: string,
  options: SearchingEventOptions = {},
): VisualizationEvent {
  return {
    type,
    label,
    targetIds: createSearchTargetIds(indices),
    sourceIds: options.sourceIndices
      ? createSearchTargetIds(options.sourceIndices)
      : undefined,
    payload: options.payload,
  };
}
