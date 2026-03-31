import type { VisualizationEvent } from "@/lib/animation/types";
import { parseSearchTargetIds } from "@/features/searching/engine/event-helpers";
import type { SearchingAnimationState } from "@/features/searching/engine/types";

function mergeIndices(currentIndices: number[], nextIndices: number[]) {
  return Array.from(new Set([...currentIndices, ...nextIndices])).sort((left, right) => left - right);
}

function createNextState(
  state: SearchingAnimationState,
  event: VisualizationEvent,
): SearchingAnimationState {
  return {
    ...state,
    checkedIndices: [],
    visitedIndices: state.visitedIndices,
    activeRangeIndices: state.activeRangeIndices,
    foundIndices: state.foundIndices,
    metrics: { ...state.metrics },
    summary: event.label,
  };
}

export function reduceSearchingEvent(
  state: SearchingAnimationState,
  event: VisualizationEvent,
): SearchingAnimationState {
  const targetIndices = parseSearchTargetIds(event.targetIds);
  const sourceIndices = parseSearchTargetIds(event.sourceIds);
  const nextState = createNextState(state, event);

  switch (event.type) {
    case "compare": {
      const checkedIndices = sourceIndices.length > 0 ? sourceIndices : targetIndices;

      nextState.checkedIndices = checkedIndices;
      nextState.visitedIndices = mergeIndices(state.visitedIndices, checkedIndices);
      nextState.activeRangeIndices =
        targetIndices.length > 0 ? targetIndices : state.activeRangeIndices;
      nextState.metrics.comparisons += 1;
      return nextState;
    }

    case "markFound": {
      nextState.checkedIndices = targetIndices;
      nextState.visitedIndices = mergeIndices(state.visitedIndices, targetIndices);
      nextState.activeRangeIndices = targetIndices;
      nextState.foundIndices = targetIndices;
      return nextState;
    }

    default: {
      return nextState;
    }
  }
}
