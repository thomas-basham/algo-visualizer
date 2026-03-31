"use client";

import { useState, useTransition } from "react";

import { usePlaybackTimeline } from "@/lib/animation/use-playback";
import type { PlaybackStatus } from "@/lib/animation/types";
import { SurfaceCard } from "@/components/ui/surface-card";
import { StatusPill } from "@/components/ui/status-pill";
import { SortingControls } from "@/features/sorting/controls/sorting-controls";
import { buildSortingTimeline } from "@/features/sorting/engine/algorithms";
import {
  availableSortingAlgorithms,
  defaultSortingConfig,
  sortingAlgorithms,
} from "@/features/sorting/engine/constants";
import { createBaseMetrics, createDataset } from "@/features/sorting/engine/sample-run";
import type { SortingAlgorithmId, SortingRunConfig, SortingTimeline } from "@/features/sorting/engine/types";
import { SortingMetricsPanel } from "@/features/sorting/ui/sorting-metrics-panel";
import { SortingBars } from "@/features/sorting/visualization/sorting-bars";

const initialDataset = createDataset(defaultSortingConfig.size);

function getStepDurationMs(speed: number) {
  return Math.max(6, Math.round(165 - speed * 2.1));
}

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
    return "Run Complete";
  }

  if (status === "paused") {
    return "Paused";
  }

  if (status === "playing") {
    return "Running";
  }

  return "Ready";
}

export function SortingVisualizer() {
  const [config, setConfig] = useState<SortingRunConfig>(defaultSortingConfig);
  const [dataset, setDataset] = useState(initialDataset);
  const [timeline, setTimeline] = useState<SortingTimeline>(() =>
    buildSortingTimeline(defaultSortingConfig.algorithmId, initialDataset),
  );
  const [isPending, startTransition] = useTransition();

  const selectedAlgorithm =
    sortingAlgorithms.find((algorithm) => algorithm.id === config.algorithmId) ??
    availableSortingAlgorithms[0];
  const stepDuration = getStepDurationMs(config.speed);
  const playback = usePlaybackTimeline(timeline, stepDuration);
  const currentFrame = playback.currentFrame;
  const liveMetrics = {
    ...createBaseMetrics(),
    comparisons: currentFrame.state.metrics.comparisons,
    swaps: currentFrame.state.metrics.swaps,
    elapsedMs: playback.elapsedMs,
  };

  function replaceTimeline(nextConfig: SortingRunConfig, nextDataset = dataset) {
    startTransition(() => {
      setConfig(nextConfig);
      setDataset(nextDataset);
      setTimeline(buildSortingTimeline(nextConfig.algorithmId, nextDataset));
    });
  }

  function handleAlgorithmChange(algorithmId: SortingAlgorithmId) {
    replaceTimeline({ ...config, algorithmId });
  }

  function handleSizeChange(size: number) {
    const nextConfig = { ...config, size };
    replaceTimeline(nextConfig, createDataset(size));
  }

  function handleSpeedChange(speed: number) {
    setConfig((current) => ({ ...current, speed }));
  }

  function handlePauseResume() {
    if (playback.status === "playing") {
      playback.pause();
      return;
    }

    playback.play();
  }

  function handleReset() {
    playback.reset();
  }

  function handleRandomize() {
    replaceTimeline(config, createDataset(config.size));
  }

  const pauseResumeLabel = playback.status === "paused" ? "Resume" : "Pause";
  const canStepForward = playback.frameIndex < timeline.frames.length - 1;
  const frameMessage = currentFrame.event?.label ?? currentFrame.state.summary;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard
          title="Control Surface"
          description="Algorithms emit events. A reducer turns those events into frames, and the playback engine drives the UI."
        >
          <SortingControls
            algorithms={availableSortingAlgorithms}
            config={config}
            isPending={isPending}
            status={playback.status}
            onAlgorithmChange={handleAlgorithmChange}
            onSizeChange={handleSizeChange}
            onSpeedChange={handleSpeedChange}
            onPlay={playback.play}
            onPauseResume={handlePauseResume}
            onStepForward={playback.stepForward}
            onReset={handleReset}
            onRandomize={handleRandomize}
            pauseResumeLabel={pauseResumeLabel}
            canStepForward={canStepForward}
          />
        </SurfaceCard>

        <SurfaceCard
          title={selectedAlgorithm.label}
          description={selectedAlgorithm.description}
          className="flex flex-col justify-between"
        >
          <div className="flex flex-wrap gap-2">
            <StatusPill label={getStatusLabel(playback.status)} tone={getStatusTone(playback.status)} />
            <StatusPill label={`${config.size} Bars`} tone="neutral" />
          </div>
          <div className="mt-6 text-sm leading-7 text-slate-300">
            {frameMessage}. Bubble, Selection, Insertion, Merge, Quick, and the native sort
            approximation all run through the same event pipeline, so the playback model stays
            consistent even when the visualization semantics change.
          </div>
        </SurfaceCard>
      </div>

      <SurfaceCard
        title="Visualization Layer"
        description="The bar view consumes reducer-built frames instead of direct algorithm mutations, including overwrite, pivot, and merge states."
      >
        <SortingBars
          values={currentFrame.state.values}
          comparedIndices={currentFrame.state.comparedIndices}
          swappedIndices={currentFrame.state.swappedIndices}
          overwrittenIndices={currentFrame.state.overwrittenIndices}
          sortedIndices={currentFrame.state.sortedIndices}
          pivotIndices={currentFrame.state.pivotIndices}
          mergedIndices={currentFrame.state.mergedIndices}
          transitionMs={Math.max(12, Math.round(stepDuration * 0.9))}
        />
      </SurfaceCard>

      <SortingMetricsPanel
        metrics={liveMetrics}
        algorithm={selectedAlgorithm}
        status={playback.status}
      />
    </div>
  );
}
