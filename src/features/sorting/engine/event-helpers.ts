import type { VisualizationEvent, VisualizationEventType } from "@/lib/animation/types";

const BAR_TARGET_PREFIX = "bar:";

export function createBarTargetIds(indices: number[]) {
  return indices.map((index) => `${BAR_TARGET_PREFIX}${index}`);
}

export function parseBarTargetIds(targetIds: string[]) {
  return targetIds
    .map((targetId) => Number(targetId.replace(BAR_TARGET_PREFIX, "")))
    .filter((index) => Number.isFinite(index));
}

export function createSortingEvent(
  type: VisualizationEventType,
  indices: number[],
  label: string,
  payload?: Record<string, unknown>,
): VisualizationEvent {
  return {
    type,
    label,
    targetIds: createBarTargetIds(indices),
    payload,
  };
}

