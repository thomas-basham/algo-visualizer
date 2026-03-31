"use client";

import { useState, useTransition } from "react";

import { SurfaceCard } from "@/components/ui/surface-card";
import { StatusPill } from "@/components/ui/status-pill";
import { SortingControls } from "@/features/sorting/controls/sorting-controls";
import { sortingAlgorithms } from "@/features/sorting/engine/constants";
import { createPreviewSnapshot } from "@/features/sorting/engine/sample-run";
import type { SortingAlgorithmId, SortingRunConfig } from "@/features/sorting/engine/types";
import { defaultSortingConfig } from "@/features/sorting/engine/constants";
import { SortingMetricsPanel } from "@/features/sorting/ui/sorting-metrics-panel";
import { SortingBars } from "@/features/sorting/visualization/sorting-bars";

export function SortingVisualizer() {
  const [config, setConfig] = useState<SortingRunConfig>(defaultSortingConfig);
  const [snapshot, setSnapshot] = useState(() => createPreviewSnapshot(defaultSortingConfig));
  const [isPending, startTransition] = useTransition();

  const selectedAlgorithm =
    sortingAlgorithms.find((algorithm) => algorithm.id === config.algorithmId) ??
    sortingAlgorithms[0];

  function refresh(nextConfig: SortingRunConfig) {
    startTransition(() => {
      setConfig(nextConfig);
      setSnapshot(createPreviewSnapshot(nextConfig));
    });
  }

  function updateConfig(patch: Partial<SortingRunConfig>) {
    refresh({ ...config, ...patch });
  }

  function handlePlayPause() {
    setSnapshot((current) => ({
      ...current,
      status: current.status === "playing" ? "paused" : "playing",
      metrics: {
        ...current.metrics,
        playbackMs: current.status === "playing" ? current.metrics.playbackMs : current.metrics.playbackMs + 16,
      },
    }));
  }

  function handleReset() {
    setSnapshot((current) => ({
      ...createPreviewSnapshot(config),
      status: "ready",
      values: current.values,
    }));
  }

  function handleRandomize() {
    refresh(config);
  }

  const playbackLabel = snapshot.status === "playing" ? "Pause" : "Play";

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard
          title="Control Surface"
          description="Controls are isolated from rendering so the execution engine can evolve independently."
        >
          <SortingControls
            config={config}
            isPending={isPending}
            onAlgorithmChange={(algorithmId: SortingAlgorithmId) => updateConfig({ algorithmId })}
            onDistributionChange={(distribution) => updateConfig({ distribution })}
            onSizeChange={(size) => updateConfig({ size })}
            onSpeedChange={(speed) => updateConfig({ speed })}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            onRandomize={handleRandomize}
            playbackLabel={playbackLabel}
          />
        </SurfaceCard>

        <SurfaceCard
          title={selectedAlgorithm.label}
          description={selectedAlgorithm.description}
          className="flex flex-col justify-between"
        >
          <div className="flex flex-wrap gap-2">
            <StatusPill
              label={snapshot.status === "playing" ? "Preview Playing" : "Preview Ready"}
              tone={snapshot.status === "playing" ? "success" : "accent"}
            />
            <StatusPill
              label={
                config.distribution === "nearly-sorted" ? "Nearly Sorted Input" : "Randomized Input"
              }
              tone="neutral"
            />
          </div>
          <div className="mt-6 text-sm leading-7 text-slate-300">
            This page is scaffolded for the upcoming trace engine. The renderer already accepts a
            snapshot contract, so the next step is wiring instrumented operations into the same
            shape.
          </div>
        </SurfaceCard>
      </div>

      <SurfaceCard
        title="Visualization Layer"
        description="Bar rendering is isolated from controls and algorithm metadata."
      >
        <SortingBars
          values={snapshot.values}
          activeIndices={snapshot.activeIndices}
          sortedIndices={snapshot.sortedIndices}
          pivotIndex={snapshot.pivotIndex}
          animated={snapshot.status === "playing"}
        />
      </SurfaceCard>

      <SortingMetricsPanel metrics={snapshot.metrics} algorithm={selectedAlgorithm} />
    </div>
  );
}
