import type { VisualizationFrame } from "@/lib/animation/types";
import type { SearchingAnimationState } from "@/features/searching/engine/types";

type SearchingStepExplanation = {
  title: string;
  detail: string;
  pseudocodeLine: number | null;
};

export function getSearchingStepExplanation(
  frame: VisualizationFrame<SearchingAnimationState>,
): SearchingStepExplanation {
  if (!frame.event) {
    return {
      title: "Ready to search",
      detail:
        "Pick a target, then press play or step forward to watch the algorithm inspect values one decision at a time.",
      pseudocodeLine: null,
    };
  }

  return {
    title:
      typeof frame.event.payload?.stepTitle === "string"
        ? frame.event.payload.stepTitle
        : frame.event.label,
    detail:
      typeof frame.event.payload?.stepDetail === "string"
        ? frame.event.payload.stepDetail
        : frame.state.summary,
    pseudocodeLine:
      typeof frame.event.payload?.pseudocodeLine === "number"
        ? frame.event.payload.pseudocodeLine
        : null,
  };
}
