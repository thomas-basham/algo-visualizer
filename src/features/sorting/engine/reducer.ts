import type { VisualizationEvent } from "@/lib/animation/types";
import { parseBarTargetIds } from "@/features/sorting/engine/event-helpers";
import type { SortingAnimationState } from "@/features/sorting/engine/types";

function mergeIndices(currentIndices: number[], nextIndices: number[]) {
  return Array.from(new Set([...currentIndices, ...nextIndices])).sort((left, right) => left - right);
}

function createNextState(
  state: SortingAnimationState,
  event: VisualizationEvent,
): SortingAnimationState {
  return {
    ...state,
    values: state.values,
    comparedIndices: [],
    swappedIndices: [],
    overwrittenIndices: [],
    sortedIndices: state.sortedIndices,
    pivotIndices: state.pivotIndices,
    mergedIndices: state.mergedIndices,
    metrics: { ...state.metrics },
    summary: event.label,
  };
}

export function reduceSortingEvent(
  state: SortingAnimationState,
  event: VisualizationEvent,
): SortingAnimationState {
  const targetIndices = parseBarTargetIds(event.targetIds);
  const nextState = createNextState(state, event);

  switch (event.type) {
    case "compare": {
      nextState.comparedIndices = targetIndices;
      nextState.metrics.comparisons += 1;
      return nextState;
    }

    case "swap": {
      const [leftIndex, rightIndex] = targetIndices;

      if (leftIndex !== undefined && rightIndex !== undefined) {
        nextState.values = [...state.values];
        [nextState.values[leftIndex], nextState.values[rightIndex]] = [
          nextState.values[rightIndex],
          nextState.values[leftIndex],
        ];
      }

      nextState.swappedIndices = targetIndices;
      nextState.metrics.swaps += 1;
      return nextState;
    }

    case "overwrite": {
      const overwriteValues = Array.isArray(event.payload?.values)
        ? event.payload.values
        : [event.payload?.value];

      nextState.values = [...state.values];
      targetIndices.forEach((index, targetIndex) => {
        const nextValue = overwriteValues[targetIndex];

        if (typeof nextValue === "number") {
          nextState.values[index] = nextValue;
        }
      });

      nextState.overwrittenIndices = targetIndices;
      nextState.metrics.overwrites += targetIndices.length;
      return nextState;
    }

    case "markSorted": {
      nextState.sortedIndices = mergeIndices(state.sortedIndices, targetIndices);
      return nextState;
    }

    case "pivot": {
      nextState.pivotIndices = targetIndices;
      return nextState;
    }

    case "merge": {
      nextState.mergedIndices = targetIndices;
      return nextState;
    }

    default: {
      return nextState;
    }
  }
}
