"use client";

import { useState, useTransition } from "react";

import { usePlaybackTimeline } from "@/lib/animation/use-playback";
import { SurfaceCard } from "@/components/ui/surface-card";
import { StatusPill } from "@/components/ui/status-pill";
import { SearchingControls } from "@/features/searching/controls/searching-controls";
import { getSearchingStepExplanation } from "@/features/searching/education/step-copy";
import { buildSearchingTimeline } from "@/features/searching/engine/algorithms";
import {
  availableSearchAlgorithms,
  defaultSearchingConfig,
  searchAlgorithms,
} from "@/features/searching/engine/constants";
import {
  createSearchingBaseMetrics,
  createSearchingDataset,
  getDefaultSearchTarget,
  getMissingSearchTarget,
} from "@/features/searching/engine/sample-run";
import type {
  SearchAlgorithmId,
  SearchingMetrics,
  SearchingRunConfig,
  SearchingTimeline,
} from "@/features/searching/engine/types";
import { SearchingEducationPanel } from "@/features/searching/ui/searching-education-panel";
import { SearchingMetricsPanel } from "@/features/searching/ui/searching-metrics-panel";
import { SearchingArray } from "@/features/searching/visualization/searching-array";

const initialDatasetSeed = 29;
const initialDataset = createSearchingDataset(defaultSearchingConfig.size, initialDatasetSeed);
const initialTarget = getDefaultSearchTarget(initialDataset);

function getStepDurationMs(speed: number) {
  return Math.max(16, Math.round(185 - speed * 2));
}

function buildTimeline(
  config: SearchingRunConfig,
  values: number[],
  target: number,
): SearchingTimeline {
  return buildSearchingTimeline(config.algorithmId, values, target);
}

function createMetrics(
  steps: number,
  comparisons: number,
  elapsedMs: number,
): SearchingMetrics {
  return {
    ...createSearchingBaseMetrics(),
    steps,
    comparisons,
    elapsedMs,
  };
}

function resolveNextTarget(
  currentValues: number[],
  nextValues: number[],
  currentTarget: number,
) {
  const currentWasMissing = !currentValues.includes(currentTarget);

  if (currentWasMissing) {
    return getMissingSearchTarget(nextValues);
  }

  if (nextValues.includes(currentTarget)) {
    return currentTarget;
  }

  return getDefaultSearchTarget(nextValues);
}

function getStatusTone(status: "ready" | "playing" | "paused" | "completed") {
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

function getStatusLabel(status: "ready" | "playing" | "paused" | "completed") {
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

export function SearchingVisualizer() {
  const [config, setConfig] = useState<SearchingRunConfig>(defaultSearchingConfig);
  const [values, setValues] = useState(initialDataset);
  const [target, setTarget] = useState(initialTarget);
  const [timeline, setTimeline] = useState<SearchingTimeline>(() =>
    buildTimeline(defaultSearchingConfig, initialDataset, initialTarget),
  );
  const [isPending, startTransition] = useTransition();

  const selectedAlgorithm =
    searchAlgorithms.find((algorithm) => algorithm.id === config.algorithmId) ??
    availableSearchAlgorithms[0];
  const stepDuration = getStepDurationMs(config.speed);
  const playback = usePlaybackTimeline(timeline, stepDuration);
  const currentFrame = playback.currentFrame;
  const currentStep = getSearchingStepExplanation(currentFrame);
  const metrics = createMetrics(
    playback.frameIndex,
    currentFrame.state.metrics.comparisons,
    playback.elapsedMs,
  );
  const missingTarget = getMissingSearchTarget(values);

  function replaceTimeline(
    nextConfig: SearchingRunConfig,
    nextValues = values,
    nextTarget = target,
  ) {
    startTransition(() => {
      setConfig(nextConfig);
      setValues(nextValues);
      setTarget(nextTarget);
      setTimeline(buildTimeline(nextConfig, nextValues, nextTarget));
    });
  }

  function handleAlgorithmChange(algorithmId: SearchAlgorithmId) {
    replaceTimeline({ ...config, algorithmId });
  }

  function handleTargetChange(nextTarget: number) {
    replaceTimeline(config, values, nextTarget);
  }

  function handleSizeChange(size: number) {
    const nextValues = createSearchingDataset(size);
    const nextTarget = resolveNextTarget(values, nextValues, target);

    replaceTimeline({ ...config, size }, nextValues, nextTarget);
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

  function handleRandomize() {
    const nextValues = createSearchingDataset(config.size);
    const nextTarget = resolveNextTarget(values, nextValues, target);

    replaceTimeline(config, nextValues, nextTarget);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SurfaceCard
          title="Search Controls"
          description="Linear and Binary Search emit semantic events into the same playback engine used elsewhere in the app."
        >
          <SearchingControls
            algorithms={availableSearchAlgorithms}
            config={config}
            values={values}
            target={target}
            missingTarget={missingTarget}
            isPending={isPending}
            status={playback.status}
            onAlgorithmChange={handleAlgorithmChange}
            onTargetChange={handleTargetChange}
            onSizeChange={handleSizeChange}
            onSpeedChange={handleSpeedChange}
            onPlay={playback.play}
            onPauseResume={handlePauseResume}
            onStepForward={playback.stepForward}
            onReset={playback.reset}
            onRandomize={handleRandomize}
            pauseResumeLabel={playback.status === "paused" ? "Resume" : "Pause"}
            canStepForward={playback.frameIndex < timeline.frames.length - 1}
          />
        </SurfaceCard>

        <SurfaceCard
          title={selectedAlgorithm.label}
          description={selectedAlgorithm.description}
          className="flex flex-col justify-between"
        >
          <div className="flex flex-wrap gap-2">
            <StatusPill label={getStatusLabel(playback.status)} tone={getStatusTone(playback.status)} />
            <StatusPill label={`Target ${target}`} tone="neutral" />
            <StatusPill label={`${config.size} Values`} tone="neutral" />
          </div>
          <div className="mt-6 text-sm leading-7 text-slate-300">
            {currentFrame.event?.label ?? currentFrame.state.summary}. Linear Search scans values
            one by one, while Binary Search keeps narrowing the sorted range around the target.
          </div>
        </SurfaceCard>
      </div>

      <SurfaceCard
        title="Visualization Layer"
        description="The search array highlights the current check, the active binary-search range, and any values already inspected."
      >
        <SearchingArray
          values={currentFrame.state.values}
          target={target}
          checkedIndices={currentFrame.state.checkedIndices}
          visitedIndices={currentFrame.state.visitedIndices}
          activeRangeIndices={currentFrame.state.activeRangeIndices}
          foundIndices={currentFrame.state.foundIndices}
        />
      </SurfaceCard>

      <SurfaceCard
        title="Learning View"
        description="Step copy and pseudocode stay aligned with the emitted event payload for the active frame."
      >
        <SearchingEducationPanel
          algorithm={selectedAlgorithm}
          stepTitle={currentStep.title}
          stepDetail={currentStep.detail}
          activeLine={currentStep.pseudocodeLine}
        />
      </SurfaceCard>

      <SurfaceCard
        title="Run Metrics"
        description="Search metrics are derived from the playback timeline, not from direct component mutation."
      >
        <SearchingMetricsPanel
          metrics={metrics}
          algorithm={selectedAlgorithm}
          status={playback.status}
        />
      </SurfaceCard>
    </div>
  );
}
