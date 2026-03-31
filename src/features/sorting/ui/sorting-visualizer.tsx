"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { SurfaceCard } from "@/components/ui/surface-card";
import { StatusPill } from "@/components/ui/status-pill";
import { SortingControls } from "@/features/sorting/controls/sorting-controls";
import { buildSortingRun } from "@/features/sorting/engine/algorithms";
import {
  availableSortingAlgorithms,
  defaultSortingConfig,
  sortingAlgorithms,
} from "@/features/sorting/engine/constants";
import { createBaseMetrics, createDataset, createInitialFrame } from "@/features/sorting/engine/sample-run";
import type {
  PlaybackStatus,
  SortingAlgorithmId,
  SortingRun,
  SortingRunConfig,
} from "@/features/sorting/engine/types";
import { SortingMetricsPanel } from "@/features/sorting/ui/sorting-metrics-panel";
import { SortingBars } from "@/features/sorting/visualization/sorting-bars";

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
  const [dataset, setDataset] = useState(() => createDataset(defaultSortingConfig.size));
  const [run, setRun] = useState<SortingRun | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [status, setStatus] = useState<PlaybackStatus>("ready");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isPending, startTransition] = useTransition();
  const elapsedOffsetRef = useRef(0);
  const startedAtRef = useRef<number | null>(null);

  const selectedAlgorithm =
    sortingAlgorithms.find((algorithm) => algorithm.id === config.algorithmId) ??
    availableSortingAlgorithms[0];
  const currentFrame = run?.frames[frameIndex] ?? createInitialFrame(dataset);
  const stepDuration = getStepDurationMs(config.speed);
  const liveMetrics = {
    ...createBaseMetrics(),
    comparisons: currentFrame.metrics.comparisons,
    swaps: currentFrame.metrics.swaps,
    elapsedMs,
  };

  function resetPlayback(nextDataset?: number[]) {
    elapsedOffsetRef.current = 0;
    startedAtRef.current = null;
    setRun(null);
    setFrameIndex(0);
    setElapsedMs(0);
    setStatus("ready");

    if (nextDataset) {
      setDataset(nextDataset);
    }
  }

  function resetWithDataset(nextConfig: SortingRunConfig) {
    startTransition(() => {
      setConfig(nextConfig);
      resetPlayback(createDataset(nextConfig.size));
    });
  }

  function getElapsedNow(now: number) {
    if (startedAtRef.current === null) {
      return elapsedOffsetRef.current;
    }

    return Math.round(elapsedOffsetRef.current + (now - startedAtRef.current));
  }

  function handleAlgorithmChange(algorithmId: SortingAlgorithmId) {
    setConfig((current) => ({ ...current, algorithmId }));
    resetPlayback();
  }

  function handleSizeChange(size: number) {
    resetWithDataset({ ...config, size });
  }

  function handleSpeedChange(speed: number) {
    setConfig((current) => ({ ...current, speed }));
  }

  function handleStart() {
    const nextRun = buildSortingRun(config.algorithmId, dataset);

    elapsedOffsetRef.current = 0;
    startedAtRef.current = performance.now();
    setElapsedMs(0);
    setFrameIndex(0);
    setRun(nextRun);
    setStatus("playing");
  }

  function handlePauseResume() {
    if (!run) {
      return;
    }

    if (status === "playing") {
      const nextElapsed = getElapsedNow(performance.now());
      elapsedOffsetRef.current = nextElapsed;
      startedAtRef.current = null;
      setElapsedMs(nextElapsed);
      setStatus("paused");
      return;
    }

    if (status === "paused") {
      startedAtRef.current = performance.now();
      setStatus("playing");
    }
  }

  function handleReset() {
    resetPlayback();
  }

  function handleRandomize() {
    startTransition(() => {
      resetPlayback(createDataset(config.size));
    });
  }

  useEffect(() => {
    if (status !== "playing" || !run) {
      return;
    }

    if (frameIndex >= run.frames.length - 1) {
      const completedElapsed = getElapsedNow(performance.now());
      elapsedOffsetRef.current = completedElapsed;
      startedAtRef.current = null;
      setElapsedMs(completedElapsed);
      setStatus("completed");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const now = performance.now();
      const nextElapsed = getElapsedNow(now);
      const nextIndex = frameIndex + 1;

      setElapsedMs(nextElapsed);

      if (nextIndex >= run.frames.length - 1) {
        elapsedOffsetRef.current = nextElapsed;
        startedAtRef.current = null;
        setFrameIndex(run.frames.length - 1);
        setStatus("completed");
        return;
      }

      setFrameIndex(nextIndex);
    }, stepDuration);

    return () => window.clearTimeout(timeoutId);
  }, [frameIndex, run, status, stepDuration]);

  const pauseResumeLabel = status === "paused" ? "Resume" : "Pause";

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard
          title="Control Surface"
          description="The UI drives playback, while the algorithm engine precomputes frames for clean, testable behavior."
        >
          <SortingControls
            algorithms={availableSortingAlgorithms}
            config={config}
            isPending={isPending}
            status={status}
            onAlgorithmChange={handleAlgorithmChange}
            onSizeChange={handleSizeChange}
            onSpeedChange={handleSpeedChange}
            onStart={handleStart}
            onPauseResume={handlePauseResume}
            onReset={handleReset}
            onRandomize={handleRandomize}
            pauseResumeLabel={pauseResumeLabel}
          />
        </SurfaceCard>

        <SurfaceCard
          title={selectedAlgorithm.label}
          description={selectedAlgorithm.description}
          className="flex flex-col justify-between"
        >
          <div className="flex flex-wrap gap-2">
            <StatusPill label={getStatusLabel(status)} tone={getStatusTone(status)} />
            <StatusPill label={`${config.size} Bars`} tone="neutral" />
          </div>
          <div className="mt-6 text-sm leading-7 text-slate-300">
            {currentFrame.label}. Bubble, Selection, and Insertion sort all run through the same
            frame-based engine so Merge Sort, Quick Sort, and benchmark modes can slot into the
            same playback surface later.
          </div>
        </SurfaceCard>
      </div>

      <SurfaceCard
        title="Visualization Layer"
        description="Bar colors reflect default, comparison, swap, and sorted states in real time."
      >
        <SortingBars
          values={currentFrame.values}
          comparedIndices={currentFrame.comparedIndices}
          swappedIndices={currentFrame.swappedIndices}
          sortedIndices={currentFrame.sortedIndices}
          transitionMs={Math.max(12, Math.round(stepDuration * 0.9))}
        />
      </SurfaceCard>

      <SortingMetricsPanel metrics={liveMetrics} algorithm={selectedAlgorithm} status={status} />
    </div>
  );
}
