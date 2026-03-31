import { SurfaceCard } from "@/components/ui/surface-card";
import type { SortingMetrics } from "@/features/sorting/engine/types";

type SortingWinnerSummaryProps = {
  leftLabel: string;
  rightLabel: string;
  leftMetrics: SortingMetrics;
  rightMetrics: SortingMetrics;
};

function formatOutcome(label: string, metrics: SortingMetrics) {
  return `${label} finished in ${metrics.elapsedMs} ms across ${metrics.operations} operations.`;
}

export function SortingWinnerSummary({
  leftLabel,
  rightLabel,
  leftMetrics,
  rightMetrics,
}: SortingWinnerSummaryProps) {
  const leftWon = leftMetrics.operations < rightMetrics.operations;
  const rightWon = rightMetrics.operations < leftMetrics.operations;

  const title = leftWon
    ? `${leftLabel} wins`
    : rightWon
      ? `${rightLabel} wins`
      : "Tie on playback";

  const description = leftWon
    ? `${formatOutcome(leftLabel, leftMetrics)} ${formatOutcome(rightLabel, rightMetrics)}`
    : rightWon
      ? `${formatOutcome(rightLabel, rightMetrics)} ${formatOutcome(leftLabel, leftMetrics)}`
      : `${formatOutcome(leftLabel, leftMetrics)} ${formatOutcome(rightLabel, rightMetrics)}`;

  return (
    <SurfaceCard
      title="Winner Summary"
      description="Winner is based on the synchronized playback timeline: the fewest emitted operations finishes first."
    >
      <div className="rounded-3xl border border-emerald-300/12 bg-emerald-300/8 p-5">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-100">
          {title}
        </div>
        <div className="mt-3 text-sm leading-7 text-slate-200">{description}</div>
      </div>
    </SurfaceCard>
  );
}
