import type { PlaybackStatus } from "@/lib/animation/types";
import { MetricTile } from "@/components/ui/metric-tile";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { SortingAlgorithmMeta, SortingMetrics } from "@/features/sorting/engine/types";

type SortingMetricsPanelProps = {
  metrics: SortingMetrics;
  algorithm: SortingAlgorithmMeta;
  status: PlaybackStatus;
};

export function SortingMetricsPanel({
  metrics,
  algorithm,
  status,
}: SortingMetricsPanelProps) {
  const statusLabel =
    status === "completed"
      ? "Sorted"
      : status === "playing"
        ? "Animating"
        : status === "paused"
          ? "Paused"
          : "Ready";

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <SurfaceCard
        title="Run Metrics"
        description="Metrics are derived from emitted events, then replayed through the timeline."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetricTile label="Comparisons" value={metrics.comparisons} />
          <MetricTile label="Swaps" value={metrics.swaps} />
          <MetricTile label="Elapsed Time" value={`${metrics.elapsedMs} ms`} />
          <MetricTile label="Status" value={statusLabel} />
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="Algorithm Info"
        description="Metadata stays separate from the renderer so new algorithms plug into the same event contract."
      >
        <div className="mb-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
          {algorithm.description}
        </div>
        {algorithm.note ? (
          <div className="mb-4 rounded-2xl border border-amber-300/15 bg-amber-300/8 p-4 text-sm leading-6 text-amber-100">
            {algorithm.note}
          </div>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <MetricTile label="Best" value={algorithm.bigO.best} />
          <MetricTile label="Average" value={algorithm.bigO.average} />
          <MetricTile label="Worst" value={algorithm.bigO.worst} />
          <MetricTile label="Space" value={algorithm.bigO.space} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
            {algorithm.bigO.stable ? "Stable" : "Unstable"}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
            {algorithm.bigO.inPlace ? "In-place" : "Not in-place"}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
            {algorithm.implemented ? "Implemented" : "Planned"}
          </span>
        </div>
      </SurfaceCard>
    </div>
  );
}
