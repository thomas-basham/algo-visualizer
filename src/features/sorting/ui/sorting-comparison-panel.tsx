import { memo } from "react";

import type { PlaybackStatus } from "@/lib/animation/types";
import { SurfaceCard } from "@/components/ui/surface-card";
import { StatusPill } from "@/components/ui/status-pill";
import type {
  SortingAlgorithmMeta,
  SortingAnimationState,
  SortingMetrics,
} from "@/features/sorting/engine/types";
import { SortingMetricsPanel } from "@/features/sorting/ui/sorting-metrics-panel";
import { SortingBars } from "@/features/sorting/visualization/sorting-bars";

type SortingComparisonPanelProps = {
  panelLabel: string;
  algorithm: SortingAlgorithmMeta;
  status: PlaybackStatus;
  size: number;
  frameMessage: string;
  metrics: SortingMetrics;
  state: SortingAnimationState;
  transitionMs: number;
  performanceMode: boolean;
};

function getStatusTone(status: PlaybackStatus) {
  if (status === "completed") {
    return "success";
  }

  if (status === "paused") {
    return "warning";
  }

  if (status === "playing") {
    return "accent";
  }

  return "neutral";
}

function getStatusLabel(status: PlaybackStatus) {
  if (status === "completed") {
    return "Complete";
  }

  if (status === "paused") {
    return "Paused";
  }

  if (status === "playing") {
    return "Running";
  }

  return "Ready";
}

function SortingComparisonPanelComponent({
  panelLabel,
  algorithm,
  status,
  size,
  frameMessage,
  metrics,
  state,
  transitionMs,
  performanceMode,
}: SortingComparisonPanelProps) {
  return (
    <SurfaceCard
      title={algorithm.label}
      description={`${panelLabel} shares the dataset but keeps its own derived event stream and completion state.`}
    >
      <div className="flex flex-wrap gap-2">
        <StatusPill label={panelLabel} tone="neutral" />
        <StatusPill label={getStatusLabel(status)} tone={getStatusTone(status)} />
        <StatusPill label={`${size} Bars`} tone="neutral" />
      </div>

      <div className="mt-6 text-sm leading-7 text-slate-300">{frameMessage}</div>

      <div className="mt-6">
        <SortingBars
          values={state.values}
          comparedIndices={state.comparedIndices}
          swappedIndices={state.swappedIndices}
          overwrittenIndices={state.overwrittenIndices}
          sortedIndices={state.sortedIndices}
          pivotIndices={state.pivotIndices}
          mergedIndices={state.mergedIndices}
          transitionMs={transitionMs}
          performanceMode={performanceMode}
        />
      </div>

      <div className="mt-6">
        <SortingMetricsPanel metrics={metrics} algorithm={algorithm} status={status} />
      </div>
    </SurfaceCard>
  );
}

export const SortingComparisonPanel = memo(
  SortingComparisonPanelComponent,
  (previousProps, nextProps) =>
    previousProps.panelLabel === nextProps.panelLabel &&
    previousProps.algorithm.id === nextProps.algorithm.id &&
    previousProps.status === nextProps.status &&
    previousProps.size === nextProps.size &&
    previousProps.frameMessage === nextProps.frameMessage &&
    previousProps.transitionMs === nextProps.transitionMs &&
    previousProps.performanceMode === nextProps.performanceMode &&
    previousProps.state === nextProps.state &&
    previousProps.metrics.comparisons === nextProps.metrics.comparisons &&
    previousProps.metrics.swaps === nextProps.metrics.swaps &&
    previousProps.metrics.overwrites === nextProps.metrics.overwrites &&
    previousProps.metrics.operations === nextProps.metrics.operations &&
    previousProps.metrics.elapsedMs === nextProps.metrics.elapsedMs,
);
