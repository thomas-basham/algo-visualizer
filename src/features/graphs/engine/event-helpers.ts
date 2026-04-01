import type { VisualizationEventType } from "@/lib/animation/types";
import type { GraphEvent } from "@/features/graphs/engine/types";

type GraphEventOptions = {
  frontierNodeIds: string[];
  frontierLabel: string;
  stepTitle: string;
  stepDetail: string;
  pseudocodeLine: number | null;
  currentNodeId?: string | null;
  sourceIds?: string[];
};

type GraphSceneIds = {
  nodeIds: string[];
  edgeIds: string[];
};

export function parseGraphSceneIds(sceneIds: string[] = []): GraphSceneIds {
  return {
    nodeIds: sceneIds.filter((sceneId) => sceneId.startsWith("node-")),
    edgeIds: sceneIds.filter((sceneId) => sceneId.startsWith("edge-")),
  };
}

export function createGraphEvent(
  type: VisualizationEventType,
  targetIds: string[],
  label: string,
  options: GraphEventOptions,
): GraphEvent {
  return {
    type,
    label,
    targetIds,
    sourceIds: options.sourceIds,
    payload: {
      frontierNodeIds: options.frontierNodeIds,
      frontierLabel: options.frontierLabel,
      stepTitle: options.stepTitle,
      stepDetail: options.stepDetail,
      pseudocodeLine: options.pseudocodeLine,
      currentNodeId: options.currentNodeId ?? null,
    },
  };
}
