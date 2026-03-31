import type { PlaybackStatus } from "@/lib/animation/types";
import { MetricTile } from "@/components/ui/metric-tile";
import type {
  SearchAlgorithmMeta,
  SearchingMetrics,
} from "@/features/searching/engine/types";

type SearchingMetricsPanelProps = {
  metrics: SearchingMetrics;
  algorithm: SearchAlgorithmMeta;
  status: PlaybackStatus;
};

export function SearchingMetricsPanel({
  metrics,
  algorithm,
  status,
}: SearchingMetricsPanelProps) {
  const statusLabel =
    status === "completed"
      ? "Complete"
      : status === "playing"
        ? "Animating"
        : status === "paused"
          ? "Paused"
          : "Ready";

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile label="Steps" value={metrics.steps} />
        <MetricTile label="Comparisons" value={metrics.comparisons} />
        <MetricTile label="Elapsed Time" value={`${metrics.elapsedMs} ms`} />
        <MetricTile label="Status" value={statusLabel} />
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
        {algorithm.description}
      </div>
      {algorithm.note ? (
        <div className="rounded-2xl border border-amber-300/15 bg-amber-300/8 p-4 text-sm leading-6 text-amber-100">
          {algorithm.note}
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <MetricTile label="Best" value={algorithm.bigO.best} />
        <MetricTile label="Average" value={algorithm.bigO.average} />
        <MetricTile label="Worst" value={algorithm.bigO.worst} />
        <MetricTile label="Space" value={algorithm.bigO.space} />
      </div>
    </div>
  );
}
