"use client";

import { useState, useTransition } from "react";

import { usePlaybackGroup } from "@/lib/animation/use-playback";
import { SurfaceCard } from "@/components/ui/surface-card";
import { SortingControls } from "@/features/sorting/controls/sorting-controls";
import { buildSortingTimeline } from "@/features/sorting/engine/algorithms";
import {
  availableSortingAlgorithms,
  defaultSortingConfig,
  standardSortingSizeMax,
  sortingAlgorithms,
} from "@/features/sorting/engine/constants";
import { createBaseMetrics, createDataset } from "@/features/sorting/engine/sample-run";
import type {
  SortingAlgorithmId,
  SortingComparisonConfig,
  SortingMetrics,
  SortingTimeline,
} from "@/features/sorting/engine/types";
import { SortingComparisonPanel } from "@/features/sorting/ui/sorting-comparison-panel";
import { SortingWinnerSummary } from "@/features/sorting/ui/sorting-winner-summary";

type SortingTimelines = {
  left: SortingTimeline;
  right: SortingTimeline;
};

const initialDataset = createDataset(defaultSortingConfig.size);

function getStepDurationMs(speed: number) {
  return Math.max(6, Math.round(165 - speed * 2.1));
}

function createSortingTimelines(
  config: SortingComparisonConfig,
  dataset: number[],
): SortingTimelines {
  return {
    left: buildSortingTimeline(config.leftAlgorithmId, dataset),
    right: buildSortingTimeline(config.rightAlgorithmId, dataset),
  };
}

function createLiveMetrics(
  comparisons: number,
  swaps: number,
  overwrites: number,
  operations: number,
  elapsedMs: number,
): SortingMetrics {
  return {
    ...createBaseMetrics(),
    comparisons,
    swaps,
    overwrites,
    operations,
    elapsedMs,
  };
}

export function SortingVisualizer() {
  const [config, setConfig] = useState<SortingComparisonConfig>(defaultSortingConfig);
  const [dataset, setDataset] = useState(initialDataset);
  const [timelines, setTimelines] = useState<SortingTimelines>(() =>
    createSortingTimelines(defaultSortingConfig, initialDataset),
  );
  const [isPending, startTransition] = useTransition();

  const leftAlgorithm =
    sortingAlgorithms.find((algorithm) => algorithm.id === config.leftAlgorithmId) ??
    availableSortingAlgorithms[0];
  const rightAlgorithm =
    sortingAlgorithms.find((algorithm) => algorithm.id === config.rightAlgorithmId) ??
    availableSortingAlgorithms[1] ??
    availableSortingAlgorithms[0];

  const stepDuration = getStepDurationMs(config.speed);
  const playback = usePlaybackGroup(timelines, stepDuration);
  const leftRun = playback.runs.left;
  const rightRun = playback.runs.right;

  const leftMetrics = createLiveMetrics(
    leftRun.currentFrame.state.metrics.comparisons,
    leftRun.currentFrame.state.metrics.swaps,
    leftRun.currentFrame.state.metrics.overwrites,
    leftRun.frameIndex,
    leftRun.elapsedMs,
  );
  const rightMetrics = createLiveMetrics(
    rightRun.currentFrame.state.metrics.comparisons,
    rightRun.currentFrame.state.metrics.swaps,
    rightRun.currentFrame.state.metrics.overwrites,
    rightRun.frameIndex,
    rightRun.elapsedMs,
  );

  function replaceTimelines(
    nextConfig: SortingComparisonConfig,
    nextDataset = dataset,
  ) {
    startTransition(() => {
      setConfig(nextConfig);
      setDataset(nextDataset);
      setTimelines(createSortingTimelines(nextConfig, nextDataset));
    });
  }

  function handleAlgorithmChange(side: "left" | "right", algorithmId: SortingAlgorithmId) {
    if (side === "left") {
      replaceTimelines({ ...config, leftAlgorithmId: algorithmId });
      return;
    }

    replaceTimelines({ ...config, rightAlgorithmId: algorithmId });
  }

  function handleSizeChange(size: number) {
    const nextConfig = { ...config, size };
    replaceTimelines(nextConfig, createDataset(size));
  }

  function handleSpeedChange(speed: number) {
    setConfig((current) => ({ ...current, speed }));
  }

  function handlePerformanceModeChange(enabled: boolean) {
    if (!enabled && config.size > standardSortingSizeMax) {
      const nextSize = standardSortingSizeMax;
      const nextDataset = dataset.slice(0, nextSize);

      replaceTimelines(
        {
          ...config,
          size: nextSize,
          performanceMode: false,
        },
        nextDataset,
      );
      return;
    }

    setConfig((current) => ({ ...current, performanceMode: enabled }));
  }

  function handlePauseResume() {
    if (playback.status === "playing") {
      playback.pause();
      return;
    }

    playback.play();
  }

  function handleRandomize() {
    replaceTimelines(config, createDataset(config.size));
  }

  const pauseResumeLabel = playback.status === "paused" ? "Resume" : "Pause";
  const canStepForward = playback.frameIndex < playback.maxFrameIndex;

  return (
    <div className="space-y-6">
      <SurfaceCard
        title="Comparison Controls"
        description="Choose two algorithms, then run them on the same starting array with one shared playback engine."
      >
        <SortingControls
          algorithms={availableSortingAlgorithms}
          config={config}
          isPending={isPending}
          status={playback.status}
          onAlgorithmChange={handleAlgorithmChange}
          onSizeChange={handleSizeChange}
          onSpeedChange={handleSpeedChange}
          onPerformanceModeChange={handlePerformanceModeChange}
          onPlay={playback.play}
          onPauseResume={handlePauseResume}
          onStepForward={playback.stepForward}
          onReset={playback.reset}
          onRandomize={handleRandomize}
          pauseResumeLabel={pauseResumeLabel}
          canStepForward={canStepForward}
        />
      </SurfaceCard>

      {playback.status === "completed" ? (
        <SortingWinnerSummary
          leftLabel={leftAlgorithm.label}
          rightLabel={rightAlgorithm.label}
          leftMetrics={leftMetrics}
          rightMetrics={rightMetrics}
        />
      ) : (
        <SurfaceCard
          title="Synchronization Model"
          description="Both timelines advance on the same clock. If one run finishes early, it freezes on its final frame while the other continues."
        >
          <div className="grid gap-4 text-sm leading-7 text-slate-300 md:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              Left: {leftAlgorithm.label}
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              Right: {rightAlgorithm.label}
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              Shared operations elapsed: {playback.frameIndex} / {playback.maxFrameIndex}
              <div className="mt-2 text-slate-400">
                {config.performanceMode
                  ? "Canvas mode is active for smoother large-array rendering."
                  : "Decorated DOM bars are active for higher visual clarity."}
              </div>
            </div>
          </div>
        </SurfaceCard>
      )}

      <div className="grid gap-6 2xl:grid-cols-2">
        <SortingComparisonPanel
          panelLabel="Left Panel"
          algorithm={leftAlgorithm}
          status={leftRun.status}
          size={config.size}
          frameMessage={leftRun.currentFrame.event?.label ?? leftRun.currentFrame.state.summary}
          metrics={leftMetrics}
          state={leftRun.currentFrame.state}
          transitionMs={
            config.performanceMode ? 0 : Math.max(12, Math.round(stepDuration * 0.9))
          }
          performanceMode={config.performanceMode}
        />
        <SortingComparisonPanel
          panelLabel="Right Panel"
          algorithm={rightAlgorithm}
          status={rightRun.status}
          size={config.size}
          frameMessage={rightRun.currentFrame.event?.label ?? rightRun.currentFrame.state.summary}
          metrics={rightMetrics}
          state={rightRun.currentFrame.state}
          transitionMs={
            config.performanceMode ? 0 : Math.max(12, Math.round(stepDuration * 0.9))
          }
          performanceMode={config.performanceMode}
        />
      </div>
    </div>
  );
}
