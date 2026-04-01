import type { VisualizationEvent } from "@/lib/animation/types";
import { mergeSceneIds } from "@/features/data-structures/engine/event-helpers";
import type {
  DataStructureAnimationState,
  DataStructureOperationId,
  DataStructureSnapshot,
} from "@/features/data-structures/engine/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDataStructureSnapshot(value: unknown): value is DataStructureSnapshot {
  if (!isRecord(value)) {
    return false;
  }

  return value.kind === "linear" || value.kind === "tree";
}

function readPayloadString(
  payload: VisualizationEvent["payload"],
  key: "stepTitle" | "stepDetail" | "operation",
): string | null {
  if (!isRecord(payload)) {
    return null;
  }

  const value = payload[key];
  return typeof value === "string" ? value : null;
}

function readPayloadSnapshot(
  payload: VisualizationEvent["payload"],
): DataStructureSnapshot | null {
  if (!isRecord(payload)) {
    return null;
  }

  const snapshot = payload.snapshot;
  return isDataStructureSnapshot(snapshot) ? snapshot : null;
}

function createNextState(
  state: DataStructureAnimationState,
  event: VisualizationEvent,
): DataStructureAnimationState {
  return {
    ...state,
    snapshot: state.snapshot,
    activeIds: event.sourceIds ?? event.targetIds,
    insertedIds: [],
    removedIds: [],
    foundIds: [],
    metrics: { ...state.metrics },
    summary: event.label,
    stepTitle: readPayloadString(event.payload, "stepTitle") ?? event.label,
    stepDetail:
      readPayloadString(event.payload, "stepDetail") ??
      "The structure is responding to the current event.",
  };
}

export function reduceDataStructureEvent(
  state: DataStructureAnimationState,
  event: VisualizationEvent,
): DataStructureAnimationState {
  const nextState = createNextState(state, event);
  const nextSnapshot = readPayloadSnapshot(event.payload);
  const operation = readPayloadString(event.payload, "operation") as DataStructureOperationId | null;

  switch (event.type) {
    case "compare": {
      nextState.activeIds = event.targetIds;
      nextState.visitedIds = mergeSceneIds(state.visitedIds, event.targetIds);
      nextState.metrics.comparisons += 1;
      nextState.metrics.operations += 1;
      return nextState;
    }

    case "insert": {
      nextState.insertedIds = event.targetIds;
      nextState.visitedIds = mergeSceneIds(state.visitedIds, event.targetIds);
      nextState.metrics.operations += 1;

      if (nextSnapshot) {
        nextState.snapshot = nextSnapshot;
      }

      return nextState;
    }

    case "remove": {
      nextState.activeIds = event.sourceIds ?? event.targetIds;
      nextState.removedIds = event.targetIds;
      nextState.visitedIds = mergeSceneIds(
        state.visitedIds,
        [...event.targetIds, ...(event.sourceIds ?? [])],
      );
      nextState.metrics.operations += 1;

      if (nextSnapshot) {
        nextState.snapshot = nextSnapshot;
      }

      return nextState;
    }

    case "markFound": {
      nextState.activeIds = event.targetIds;
      nextState.foundIds = mergeSceneIds(state.foundIds, event.targetIds);
      nextState.visitedIds = mergeSceneIds(state.visitedIds, event.targetIds);
      nextState.metrics.operations += 1;
      return nextState;
    }

    case "annotate": {
      if (operation === "add" || operation === "remove" || operation === "search") {
        nextState.activeIds = event.sourceIds ?? event.targetIds;
      }

      return nextState;
    }

    default: {
      return nextState;
    }
  }
}
