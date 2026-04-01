import type { VisualizationEventType } from "@/lib/animation/types";
import type {
  DataStructureEvent,
  DataStructureOperationId,
  DataStructureSnapshot,
} from "@/features/data-structures/engine/types";

type DataStructureEventOptions = {
  operation: DataStructureOperationId;
  stepTitle: string;
  stepDetail: string;
  snapshot?: DataStructureSnapshot;
  sourceIds?: string[];
};

export function createDataStructureEvent(
  type: VisualizationEventType,
  targetIds: string[],
  label: string,
  options: DataStructureEventOptions,
): DataStructureEvent {
  return {
    type,
    label,
    targetIds,
    sourceIds: options.sourceIds,
    payload: {
      operation: options.operation,
      stepTitle: options.stepTitle,
      stepDetail: options.stepDetail,
      snapshot: options.snapshot,
    },
  };
}

export function mergeSceneIds(currentIds: string[], nextIds: string[]) {
  return Array.from(new Set([...currentIds, ...nextIds]));
}
