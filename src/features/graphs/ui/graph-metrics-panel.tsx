import type { PlaybackStatus } from "@/lib/animation/types";
import { MetricTile } from "@/components/ui/metric-tile";
import type {
  GraphAlgorithmMeta,
  GraphMetrics,
} from "@/features/graphs/engine/types";

type GraphMetricsPanelProps = {
  metrics: GraphMetrics;
  algorithm: GraphAlgorithmMeta;
  status: PlaybackStatus;
};

export function GraphMetricsPanel({
  metrics,
  algorithm,
  status,
}: GraphMetricsPanelProps) {
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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricTile label="Steps" value={metrics.steps} />
        <MetricTile label="Edge Checks" value={metrics.comparisons} />
        <MetricTile label="Visited Nodes" value={metrics.visitedCount} />
        <MetricTile label="Elapsed Time" value={`${metrics.elapsedMs} ms`} />
        <MetricTile label="Status" value={statusLabel} />
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
        {algorithm.description}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <MetricTile label="Best" value={algorithm.bigO.best} />
        <MetricTile label="Average" value={algorithm.bigO.average} />
        <MetricTile label="Worst" value={algorithm.bigO.worst} />
        <MetricTile label="Space" value={algorithm.bigO.space} />
      </div>
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
        {algorithm.note ?? `${algorithm.label} is currently ${statusLabel.toLowerCase()}.`}
      </div>
    </div>
  );
}
