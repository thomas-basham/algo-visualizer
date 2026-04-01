import type { VisualizationEvent } from "@/lib/animation/types";
import { parseGraphSceneIds } from "@/features/graphs/engine/event-helpers";
import type { GraphAnimationState } from "@/features/graphs/engine/types";

function mergeIds(currentIds: string[], nextIds: string[]) {
  return Array.from(new Set([...currentIds, ...nextIds]));
}

function readPayloadArray(
  payload: VisualizationEvent["payload"],
  key: "frontierNodeIds",
) {
  const value = payload?.[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function readPayloadString(
  payload: VisualizationEvent["payload"],
  key: "frontierLabel" | "stepTitle" | "stepDetail" | "currentNodeId",
) {
  const value = payload?.[key];
  return typeof value === "string" ? value : null;
}

function readPayloadNumber(
  payload: VisualizationEvent["payload"],
  key: "pseudocodeLine",
) {
  const value = payload?.[key];
  return typeof value === "number" ? value : null;
}

function createNextState(
  state: GraphAnimationState,
  event: VisualizationEvent,
): GraphAnimationState {
  return {
    ...state,
    activeNodeIds: [],
    activeEdgeIds: [],
    frontierNodeIds: readPayloadArray(event.payload, "frontierNodeIds"),
    frontierLabel: readPayloadString(event.payload, "frontierLabel") ?? state.frontierLabel,
    currentNodeId: readPayloadString(event.payload, "currentNodeId") ?? state.currentNodeId,
    metrics: { ...state.metrics },
    summary: event.label,
    stepTitle: readPayloadString(event.payload, "stepTitle") ?? event.label,
    stepDetail:
      readPayloadString(event.payload, "stepDetail") ??
      "The traversal is evaluating the next graph step.",
    pseudocodeLine: readPayloadNumber(event.payload, "pseudocodeLine"),
  };
}

export function reduceGraphEvent(
  state: GraphAnimationState,
  event: VisualizationEvent,
): GraphAnimationState {
  const targetScene = parseGraphSceneIds(event.targetIds);
  const sourceScene = parseGraphSceneIds(event.sourceIds);
  const nextState = createNextState(state, event);

  switch (event.type) {
    case "compare": {
      nextState.activeNodeIds = mergeIds(sourceScene.nodeIds, targetScene.nodeIds);
      nextState.activeEdgeIds = targetScene.edgeIds;
      nextState.metrics.comparisons += 1;
      return nextState;
    }

    case "visit": {
      nextState.activeNodeIds = targetScene.nodeIds;
      nextState.activeEdgeIds = targetScene.edgeIds;
      nextState.visitedNodeIds = mergeIds(state.visitedNodeIds, targetScene.nodeIds);
      nextState.traversalOrderIds = mergeIds(state.traversalOrderIds, targetScene.nodeIds);
      nextState.metrics.visitedCount = nextState.traversalOrderIds.length;
      nextState.currentNodeId = targetScene.nodeIds[0] ?? nextState.currentNodeId;
      return nextState;
    }

    case "annotate": {
      nextState.activeNodeIds = mergeIds(sourceScene.nodeIds, targetScene.nodeIds);
      nextState.activeEdgeIds = targetScene.edgeIds;
      return nextState;
    }

    default: {
      return nextState;
    }
  }
}
