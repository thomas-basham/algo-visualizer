import type { VisualizationFrame } from "@/lib/animation/types";
import { parseBarTargetIds } from "@/features/sorting/engine/event-helpers";
import type {
  SortingAlgorithmId,
  SortingAnimationState,
} from "@/features/sorting/engine/types";

type StepExplanation = {
  title: string;
  detail: string;
  pseudocodeLine: number | null;
};

function getValuesForTargets(
  frame: VisualizationFrame<SortingAnimationState> | null,
  indices: number[],
) {
  if (!frame) {
    return indices.map(() => null);
  }

  return indices.map((index) => frame.state.values[index] ?? null);
}

function getDefaultExplanation(summary: string): StepExplanation {
  return {
    title: summary,
    detail:
      "This frame shows the current state of the algorithm. Press play or step forward to see the next decision.",
    pseudocodeLine: null,
  };
}

function getPseudocodeLine(
  algorithmId: SortingAlgorithmId,
  eventType: string,
  label: string,
) {
  switch (algorithmId) {
    case "bubble":
      if (eventType === "compare") return 4;
      if (eventType === "swap") return 6;
      if (eventType === "markSorted") return label.includes("already sorted") ? 1 : 8;
      return 1;

    case "selection":
      if (eventType === "compare") return 4;
      if (eventType === "swap") return 6;
      if (eventType === "markSorted") return 7;
      return 1;

    case "insertion":
      if (eventType === "compare") return 4;
      if (eventType === "swap") return 6;
      if (eventType === "markSorted") return 7;
      return 2;

    case "merge":
      if (eventType === "merge") return 4;
      if (eventType === "compare") return 5;
      if (eventType === "overwrite") return 6;
      if (eventType === "markSorted") return 7;
      return 1;

    case "quick":
      if (eventType === "pivot") return label.includes("moved") ? 4 : 1;
      if (eventType === "compare") return 2;
      if (eventType === "swap") return 3;
      if (eventType === "markSorted") return 5;
      return 6;

    case "native-js":
      if (eventType === "compare") return 2;
      if (eventType === "merge") return 3;
      if (eventType === "overwrite") return 4;
      return 1;

    default:
      return null;
  }
}

export function getSortingStepExplanation(
  algorithmId: SortingAlgorithmId,
  currentFrame: VisualizationFrame<SortingAnimationState>,
  previousFrame: VisualizationFrame<SortingAnimationState> | null,
): StepExplanation {
  const event = currentFrame.event;

  if (!event) {
    return getDefaultExplanation(currentFrame.state.summary);
  }

  const indices = parseBarTargetIds(event.targetIds);
  const previousValues = getValuesForTargets(previousFrame, indices);
  const currentValues = getValuesForTargets(currentFrame, indices);
  const line = getPseudocodeLine(algorithmId, event.type, event.label);

  switch (event.type) {
    case "compare": {
      const [leftValue, rightValue] = previousValues;

      return {
        title: `Comparing ${leftValue ?? "?"} and ${rightValue ?? "?"}`,
        detail:
          algorithmId === "quick"
            ? "The algorithm is checking whether this value belongs on the left side of the pivot."
            : "The algorithm is deciding whether these values are already in the correct order.",
        pseudocodeLine: line,
      };
    }

    case "swap": {
      const [leftValue, rightValue] = previousValues;
      const detailByAlgorithm: Record<SortingAlgorithmId, string> = {
        bubble: `Swapping because ${leftValue ?? "the left value"} is greater than ${rightValue ?? "the right value"} in this adjacent pair.`,
        selection:
          "Swapping to place the smallest value found in the unsorted region at the front of that region.",
        insertion:
          "Swapping so the current value can slide left into its correct spot inside the sorted prefix.",
        merge:
          "Merge Sort usually writes values instead of swapping them, so swaps are not the main teaching signal here.",
        quick:
          "Swapping to grow the left partition of values that belong before the pivot.",
        "native-js":
          "This educational native view mainly highlights comparator calls and overwrite behavior rather than explicit swaps.",
      };

      return {
        title: `Swapping ${leftValue ?? "?"} and ${rightValue ?? "?"}`,
        detail: detailByAlgorithm[algorithmId],
        pseudocodeLine: line,
      };
    }

    case "overwrite": {
      const [nextValue] = currentValues;

      return {
        title: `Writing ${nextValue ?? "a value"} into the array`,
        detail:
          algorithmId === "merge"
            ? "Merge Sort is rebuilding the range in sorted order by writing the next smallest value into place."
            : "The visualizer is writing an observed final value back into the visible array.",
        pseudocodeLine: line,
      };
    }

    case "markSorted":
      return {
        title: "Marking values as sorted",
        detail:
          "These positions no longer need to move. The algorithm has proved they are in their final sorted location.",
        pseudocodeLine: line,
      };

    case "pivot": {
      const [pivotValue] = currentValues;

      return {
        title: `Pivot focus on ${pivotValue ?? "current pivot"}`,
        detail:
          "Quick Sort is using the pivot as a divider so smaller values move left and larger values stay on the right.",
        pseudocodeLine: line,
      };
    }

    case "merge":
      return {
        title: "Merging two sorted regions",
        detail:
          "The algorithm is combining smaller sorted groups into a larger sorted run while keeping order intact.",
        pseudocodeLine: line,
      };

    default:
      return getDefaultExplanation(currentFrame.state.summary);
  }
}
