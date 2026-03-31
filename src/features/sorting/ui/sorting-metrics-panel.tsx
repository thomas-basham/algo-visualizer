import { MetricTile } from "@/components/ui/metric-tile";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { SortingAlgorithmMeta, SortingMetrics } from "@/features/sorting/engine/types";

type SortingMetricsPanelProps = {
  metrics: SortingMetrics;
  algorithm: SortingAlgorithmMeta;
};

export function SortingMetricsPanel({
  metrics,
  algorithm,
}: SortingMetricsPanelProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <SurfaceCard
        title="Run Metrics"
        description="Metrics are wired to the scaffold and ready for the execution engine to populate."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetricTile label="Comparisons" value={metrics.comparisons} />
          <MetricTile label="Swaps" value={metrics.swaps} />
          <MetricTile label="Writes" value={metrics.writes} />
          <MetricTile label="Array Accesses" value={metrics.arrayAccesses} />
          <MetricTile label="Playback" value={`${metrics.playbackMs} ms`} />
          <MetricTile label="Status" value="Scaffolded" hint="Hook trace output here" />
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="Complexity Summary"
        description="Algorithm metadata lives in the engine layer so controls and docs stay in sync."
      >
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
            {algorithm.category === "native" ? "Engine dependent" : "Custom algorithm"}
          </span>
        </div>
      </SurfaceCard>
    </div>
  );
}

