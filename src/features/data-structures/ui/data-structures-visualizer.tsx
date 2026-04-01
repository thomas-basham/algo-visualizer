"use client";

import { useEffect, useMemo, useState } from "react";

import { usePlaybackTimeline } from "@/lib/animation/use-playback";
import { SurfaceCard } from "@/components/ui/surface-card";
import { DataStructuresControls } from "@/features/data-structures/controls/data-structures-controls";
import {
  availableDataStructures,
  dataStructureMap,
  defaultDataStructuresConfig,
  dataStructuresValueMax,
  dataStructuresValueMin,
} from "@/features/data-structures/engine/constants";
import { buildDataStructureTimeline } from "@/features/data-structures/engine/operations";
import {
  cloneDataStructureSnapshot,
  createInitialDataStructureSnapshots,
  createInitialDataStructureState,
} from "@/features/data-structures/engine/sample-run";
import type {
  DataStructureId,
  DataStructureMetrics,
  DataStructureOperationId,
  DataStructureSnapshot,
  DataStructureStateCollection,
  DataStructureTimeline,
  LinearStructureSnapshot,
  TreeStructureSnapshot,
} from "@/features/data-structures/engine/types";
import { DataStructuresInfoPanel } from "@/features/data-structures/ui/data-structures-info-panel";
import { DataStructuresMetricsPanel } from "@/features/data-structures/ui/data-structures-metrics-panel";
import { DataStructuresStepPanel } from "@/features/data-structures/ui/data-structures-step-panel";
import { LinearStructure } from "@/features/data-structures/visualization/linear-structure";
import { TreeStructure } from "@/features/data-structures/visualization/tree-structure";

const initialSnapshots = createInitialDataStructureSnapshots();

function getStepDurationMs(speed: number) {
  return Math.max(18, Math.round(195 - speed * 1.7));
}

function createIdleTimeline(
  structureId: DataStructureId,
  snapshot: DataStructureSnapshot,
): DataStructureTimeline {
  return {
    events: [],
    frames: [
      {
        step: 0,
        event: null,
        state: createInitialDataStructureState(structureId, snapshot),
      },
    ],
  };
}

function clampValue(rawValue: string) {
  const parsed = Number(rawValue);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.min(dataStructuresValueMax, Math.max(dataStructuresValueMin, Math.round(parsed)));
}

function createMetrics(
  steps: number,
  comparisons: number,
  operations: number,
  elapsedMs: number,
): DataStructureMetrics {
  return {
    steps,
    comparisons,
    operations,
    elapsedMs,
  };
}

export function DataStructuresVisualizer() {
  const [config, setConfig] = useState(defaultDataStructuresConfig);
  const [snapshots, setSnapshots] = useState<DataStructureStateCollection>(() =>
    Object.fromEntries(
      Object.entries(initialSnapshots).map(([structureId, snapshot]) => [
        structureId,
        cloneDataStructureSnapshot(snapshot),
      ]),
    ) as DataStructureStateCollection,
  );
  const [valueInput, setValueInput] = useState("36");
  const [timeline, setTimeline] = useState<DataStructureTimeline>(() =>
    createIdleTimeline(defaultDataStructuresConfig.structureId, initialSnapshots.stack),
  );
  const [autoplayRequested, setAutoplayRequested] = useState(false);

  const selectedStructure =
    dataStructureMap[config.structureId] ?? availableDataStructures[0];
  const selectedOperation = selectedStructure.operations[config.operationId];
  const stepDuration = getStepDurationMs(config.speed);
  const playback = usePlaybackTimeline(timeline, stepDuration);
  const currentFrame = playback.currentFrame;
  const metrics = createMetrics(
    playback.frameIndex,
    currentFrame.state.metrics.comparisons,
    currentFrame.state.metrics.operations,
    playback.elapsedMs,
  );

  const inputRequired = selectedOperation.requiresValue;
  const normalizedValue = useMemo(() => clampValue(valueInput), [valueInput]);
  const canRun = !inputRequired || normalizedValue !== null;
  const canPlay = timeline.frames.length > 1;
  const canStepForward = playback.frameIndex < timeline.frames.length - 1;

  useEffect(() => {
    if (!autoplayRequested || playback.status !== "ready") {
      return;
    }

    playback.play();
    setAutoplayRequested(false);
  }, [autoplayRequested, playback, playback.status]);

  function handleStructureChange(structureId: DataStructureId) {
    const nextStructure = dataStructureMap[structureId];
    const nextOperationId: DataStructureOperationId = "add";
    const operation = nextStructure.operations[nextOperationId];

    setConfig((current) => ({
      ...current,
      structureId,
      operationId: nextOperationId,
    }));
    setValueInput(operation.requiresValue ? valueInput || "36" : "");
    setTimeline(createIdleTimeline(structureId, snapshots[structureId]));
    setAutoplayRequested(false);
  }

  function handleOperationChange(operationId: DataStructureOperationId) {
    const nextOperation = selectedStructure.operations[operationId];

    setConfig((current) => ({
      ...current,
      operationId,
    }));

    if (!nextOperation.requiresValue) {
      setValueInput("");
      return;
    }

    if (!valueInput) {
      setValueInput("36");
    }
  }

  function handleRunOperation() {
    const baseSnapshot = currentFrame.state.snapshot;
    const nextValue = selectedOperation.requiresValue ? normalizedValue ?? undefined : undefined;
    const nextTimeline = buildDataStructureTimeline(
      config.structureId,
      baseSnapshot,
      config.operationId,
      nextValue,
    );
    const finalSnapshot =
      nextTimeline.frames.at(-1)?.state.snapshot ?? cloneDataStructureSnapshot(baseSnapshot);

    setTimeline(nextTimeline);
    setSnapshots((current) => ({
      ...current,
      [config.structureId]: cloneDataStructureSnapshot(finalSnapshot),
    }));
    setAutoplayRequested(true);
  }

  function handleRestoreExample() {
    const nextSnapshot = cloneDataStructureSnapshot(initialSnapshots[config.structureId]);

    setSnapshots((current) => ({
      ...current,
      [config.structureId]: nextSnapshot,
    }));
    setTimeline(createIdleTimeline(config.structureId, nextSnapshot));
    setAutoplayRequested(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard
          title="Structure Controls"
          description="Run one structure operation at a time, then replay it with the shared playback engine."
        >
          <DataStructuresControls
            structures={availableDataStructures}
            selectedStructureId={config.structureId}
            selectedOperationId={config.operationId}
            valueInput={valueInput}
            speed={config.speed}
            status={playback.status}
            inputRequired={inputRequired}
            inputLabel={selectedOperation.valueLabel}
            inputHint={selectedOperation.valueHint}
            canRun={canRun}
            canPlay={canPlay}
            canStepForward={canStepForward}
            pauseResumeLabel={playback.status === "paused" ? "Resume" : "Pause"}
            onStructureChange={handleStructureChange}
            onOperationChange={handleOperationChange}
            onValueInputChange={setValueInput}
            onSpeedChange={(speed) => setConfig((current) => ({ ...current, speed }))}
            onRunOperation={handleRunOperation}
            onPlay={playback.play}
            onPauseResume={() => {
              if (playback.status === "playing") {
                playback.pause();
                return;
              }

              playback.play();
            }}
            onStepForward={playback.stepForward}
            onReset={playback.reset}
            onRestoreExample={handleRestoreExample}
          />
        </SurfaceCard>

        <SurfaceCard
          title="Operation Guide"
          description="Plain-English context keeps the current interaction grounded in the underlying data-structure rules."
        >
          <DataStructuresInfoPanel
            structureId={config.structureId}
            operationId={config.operationId}
            structure={selectedStructure}
          />
        </SurfaceCard>
      </div>

      <SurfaceCard
        title="Visualization Layer"
        description="The renderers stay structure-specific, but they all consume the same event-driven animation state."
      >
        {currentFrame.state.snapshot.kind === "linear" ? (
          <LinearStructure
            structureId={config.structureId as Exclude<DataStructureId, "binary-search-tree">}
            snapshot={currentFrame.state.snapshot as LinearStructureSnapshot}
            activeIds={currentFrame.state.activeIds}
            visitedIds={currentFrame.state.visitedIds}
            foundIds={currentFrame.state.foundIds}
            insertedIds={currentFrame.state.insertedIds}
            removedIds={currentFrame.state.removedIds}
          />
        ) : (
          <TreeStructure
            snapshot={currentFrame.state.snapshot as TreeStructureSnapshot}
            activeIds={currentFrame.state.activeIds}
            visitedIds={currentFrame.state.visitedIds}
            foundIds={currentFrame.state.foundIds}
            insertedIds={currentFrame.state.insertedIds}
            removedIds={currentFrame.state.removedIds}
          />
        )}
      </SurfaceCard>

      <SurfaceCard
        title="Learning View"
        description="Step copy updates with each emitted event so beginners can connect the animation to the structural rule."
      >
        <DataStructuresStepPanel
          title={currentFrame.state.stepTitle}
          detail={currentFrame.state.stepDetail}
          summary={currentFrame.state.summary}
          operationId={config.operationId}
          structure={selectedStructure}
        />
      </SurfaceCard>

      <SurfaceCard
        title="Run Metrics"
        description="Metrics come from the playback timeline rather than direct component mutation."
      >
        <DataStructuresMetricsPanel
          metrics={metrics}
          snapshot={currentFrame.state.snapshot}
          structure={selectedStructure}
        />
      </SurfaceCard>
    </div>
  );
}
