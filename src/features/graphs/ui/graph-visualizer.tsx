"use client";

import { useEffect, useState } from "react";

import { usePlaybackTimeline } from "@/lib/animation/use-playback";
import { SurfaceCard } from "@/components/ui/surface-card";
import { StatusPill } from "@/components/ui/status-pill";
import { GraphControls } from "@/features/graphs/controls/graph-controls";
import { buildGraphTimeline } from "@/features/graphs/engine/algorithms";
import { availableGraphAlgorithms, defaultGraphConfig } from "@/features/graphs/engine/constants";
import {
  createInitialGraphState,
  getDefaultStartNodeId,
  getGraphSample,
  getNextGraphSample,
} from "@/features/graphs/engine/sample-run";
import type {
  GraphAlgorithmId,
  GraphMetrics,
  GraphRunConfig,
  GraphSample,
  GraphTimeline,
} from "@/features/graphs/engine/types";
import { GraphEducationPanel } from "@/features/graphs/ui/graph-education-panel";
import { GraphFrontierPanel } from "@/features/graphs/ui/graph-frontier-panel";
import { GraphMetricsPanel } from "@/features/graphs/ui/graph-metrics-panel";
import { GraphCanvas } from "@/features/graphs/visualization/graph-canvas";

const initialGraph = getGraphSample(defaultGraphConfig.sampleId);

function getStepDurationMs(speed: number) {
  return Math.max(18, Math.round(195 - speed * 1.75));
}

function createIdleTimeline(graph: GraphSample, algorithmId: GraphAlgorithmId): GraphTimeline {
  return {
    events: [],
    frames: [
      {
        step: 0,
        event: null,
        state: createInitialGraphState(graph, algorithmId),
      },
    ],
  };
}

function createMetrics(
  steps: number,
  comparisons: number,
  visitedCount: number,
  elapsedMs: number,
): GraphMetrics {
  return {
    steps,
    comparisons,
    visitedCount,
    elapsedMs,
  };
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

export function GraphVisualizer() {
  const [config, setConfig] = useState<GraphRunConfig>(defaultGraphConfig);
  const [graph, setGraph] = useState<GraphSample>(initialGraph);
  const [timeline, setTimeline] = useState<GraphTimeline>(() =>
    createIdleTimeline(initialGraph, defaultGraphConfig.algorithmId),
  );
  const [autoplayRequested, setAutoplayRequested] = useState(false);

  const selectedAlgorithm =
    availableGraphAlgorithms.find((algorithm) => algorithm.id === config.algorithmId) ??
    availableGraphAlgorithms[0];
  const stepDuration = getStepDurationMs(config.speed);
  const playback = usePlaybackTimeline(timeline, stepDuration);
  const currentFrame = playback.currentFrame;
  const metrics = createMetrics(
    playback.frameIndex,
    currentFrame.state.metrics.comparisons,
    currentFrame.state.metrics.visitedCount,
    playback.elapsedMs,
  );

  useEffect(() => {
    if (!autoplayRequested || playback.status !== "ready") {
      return;
    }

    playback.play();
    setAutoplayRequested(false);
  }, [autoplayRequested, playback, playback.status]);

  function replaceGraph(nextGraph: GraphSample, nextConfig: GraphRunConfig) {
    setGraph(nextGraph);
    setConfig(nextConfig);
    setTimeline(createIdleTimeline(nextGraph, nextConfig.algorithmId));
    setAutoplayRequested(false);
  }

  function handleAlgorithmChange(algorithmId: GraphAlgorithmId) {
    setConfig((current) => ({ ...current, algorithmId }));
    setTimeline(createIdleTimeline(graph, algorithmId));
    setAutoplayRequested(false);
  }

  function handleStartNodeChange(startNodeId: string) {
    setConfig((current) => ({ ...current, startNodeId }));
    setTimeline(createIdleTimeline(graph, config.algorithmId));
    setAutoplayRequested(false);
  }

  function handleGenerateSample() {
    const nextGraph = getNextGraphSample(config.sampleId);
    const nextConfig = {
      ...config,
      sampleId: nextGraph.id,
      startNodeId: getDefaultStartNodeId(nextGraph),
    };

    replaceGraph(nextGraph, nextConfig);
  }

  function handleStartTraversal() {
    const nextTimeline = buildGraphTimeline(config.algorithmId, graph, config.startNodeId);
    setTimeline(nextTimeline);
    setAutoplayRequested(true);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard
          title="Traversal Controls"
          description="Generate a graph, pick a start node, and replay the traversal through the shared event-driven playback system."
        >
          <GraphControls
            algorithms={availableGraphAlgorithms}
            graph={graph}
            nodes={graph.nodes}
            algorithmId={config.algorithmId}
            startNodeId={config.startNodeId}
            speed={config.speed}
            status={playback.status}
            pauseResumeLabel={playback.status === "paused" ? "Resume" : "Pause"}
            canStepForward={playback.frameIndex < timeline.frames.length - 1}
            canPlay={timeline.frames.length > 1}
            onAlgorithmChange={handleAlgorithmChange}
            onStartNodeChange={handleStartNodeChange}
            onSpeedChange={(speed) => setConfig((current) => ({ ...current, speed }))}
            onGenerateSample={handleGenerateSample}
            onStartTraversal={handleStartTraversal}
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
          />
        </SurfaceCard>

        <SurfaceCard
          title={selectedAlgorithm.label}
          description={selectedAlgorithm.description}
          className="flex flex-col justify-between"
        >
          <div className="flex flex-wrap gap-2">
            <StatusPill label={getStatusLabel(playback.status)} tone={getStatusTone(playback.status)} />
            <StatusPill
              label={`Start ${graph.nodes.find((node) => node.id === config.startNodeId)?.label ?? config.startNodeId}`}
              tone="neutral"
            />
            <StatusPill label={graph.name} tone="neutral" />
          </div>
          <div className="mt-6 text-sm leading-7 text-slate-300">
            {currentFrame.event?.label ?? currentFrame.state.summary}. The traversal renderer
            highlights the current node, active edge, visited set, and the live {selectedAlgorithm.frontierLabel.toLowerCase()} state.
          </div>
        </SurfaceCard>
      </div>

      <SurfaceCard
        title="Visualization Layer"
        description="Nodes and edges are rendered from graph snapshots, while frontier state and traversal order stay synchronized beside the canvas."
      >
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <GraphCanvas
            graph={currentFrame.state.graph}
            activeNodeIds={currentFrame.state.activeNodeIds}
            activeEdgeIds={currentFrame.state.activeEdgeIds}
            visitedNodeIds={currentFrame.state.visitedNodeIds}
            frontierNodeIds={currentFrame.state.frontierNodeIds}
            currentNodeId={currentFrame.state.currentNodeId}
          />
          <GraphFrontierPanel
            graph={currentFrame.state.graph}
            frontierLabel={currentFrame.state.frontierLabel}
            frontierNodeIds={currentFrame.state.frontierNodeIds}
            traversalOrderIds={currentFrame.state.traversalOrderIds}
            currentNodeId={currentFrame.state.currentNodeId}
          />
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="Learning View"
        description="Traversal notes and pseudocode update from the same event payloads that drive the graph renderer."
      >
        <GraphEducationPanel
          algorithm={selectedAlgorithm}
          stepTitle={currentFrame.state.stepTitle}
          stepDetail={currentFrame.state.stepDetail}
          activeLine={currentFrame.state.pseudocodeLine}
        />
      </SurfaceCard>

      <SurfaceCard
        title="Run Metrics"
        description="Traversal metrics are derived from the playback frames rather than direct component mutation."
      >
        <GraphMetricsPanel
          metrics={metrics}
          algorithm={selectedAlgorithm}
          status={playback.status}
        />
      </SurfaceCard>
    </div>
  );
}
