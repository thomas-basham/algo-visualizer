"use client";

import { cn } from "@/lib/utils";
import type { PlaybackStatus } from "@/lib/animation/types";
import type {
  GraphAlgorithmId,
  GraphAlgorithmMeta,
  GraphNode,
  GraphSample,
} from "@/features/graphs/engine/types";

type GraphControlsProps = {
  algorithms: GraphAlgorithmMeta[];
  graph: GraphSample;
  nodes: GraphNode[];
  algorithmId: GraphAlgorithmId;
  startNodeId: string;
  speed: number;
  status: PlaybackStatus;
  pauseResumeLabel: string;
  canStepForward: boolean;
  canPlay: boolean;
  onAlgorithmChange: (algorithmId: GraphAlgorithmId) => void;
  onStartNodeChange: (startNodeId: string) => void;
  onSpeedChange: (speed: number) => void;
  onGenerateSample: () => void;
  onStartTraversal: () => void;
  onPlay: () => void;
  onPauseResume: () => void;
  onStepForward: () => void;
  onReset: () => void;
};

const statusCopy: Record<PlaybackStatus, string> = {
  ready: "Ready",
  playing: "Animating",
  paused: "Paused",
  completed: "Complete",
};

export function GraphControls({
  algorithms,
  graph,
  nodes,
  algorithmId,
  startNodeId,
  speed,
  status,
  pauseResumeLabel,
  canStepForward,
  canPlay,
  onAlgorithmChange,
  onStartNodeChange,
  onSpeedChange,
  onGenerateSample,
  onStartTraversal,
  onPlay,
  onPauseResume,
  onStepForward,
  onReset,
}: GraphControlsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Algorithm
            </span>
            <select
              value={algorithmId}
              onChange={(event) => onAlgorithmChange(event.target.value as GraphAlgorithmId)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
            >
              {algorithms.map((algorithm) => (
                <option key={algorithm.id} value={algorithm.id} className="bg-slate-950">
                  {algorithm.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Start Node
            </span>
            <select
              value={startNodeId}
              onChange={(event) => onStartNodeChange(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
            >
              {nodes.map((node) => (
                <option key={node.id} value={node.id} className="bg-slate-950">
                  {node.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Sample Graph
          </div>
          <div className="mt-3 flex items-center justify-between gap-4">
            <div className="text-sm font-medium text-white">{graph.name}</div>
            <span
              className={cn(
                "inline-flex rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]",
                status === "completed"
                  ? "border-emerald-300/25 bg-emerald-300/12 text-emerald-100"
                  : status === "paused"
                    ? "border-amber-300/25 bg-amber-300/12 text-amber-100"
                    : status === "playing"
                      ? "border-cyan-300/25 bg-cyan-300/12 text-cyan-100"
                      : "border-white/10 bg-white/[0.04] text-slate-200",
              )}
            >
              {statusCopy[status]}
            </span>
          </div>
          <div className="mt-3 text-sm leading-6 text-slate-300">{graph.description}</div>
        </div>
      </div>

      <label className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Animation Speed
          </span>
          <span className="text-sm font-medium text-slate-200">{speed}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={100}
          step={5}
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          className="w-full accent-emerald-300"
        />
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onGenerateSample}
          className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08]"
        >
          Generate Sample Graph
        </button>
        <button
          type="button"
          onClick={onStartTraversal}
          className="inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-300/12 px-4 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/16"
        >
          Start Traversal
        </button>
        <button
          type="button"
          onClick={onPlay}
          disabled={!canPlay || status === "playing"}
          className="inline-flex items-center rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2.5 text-sm font-medium text-emerald-100 transition hover:border-emerald-300/35 hover:bg-emerald-300/16 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Play
        </button>
        <button
          type="button"
          onClick={onPauseResume}
          disabled={status !== "playing" && status !== "paused"}
          className="inline-flex items-center rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2.5 text-sm font-medium text-amber-100 transition hover:border-amber-300/35 hover:bg-amber-300/16 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pauseResumeLabel}
        </button>
        <button
          type="button"
          onClick={onStepForward}
          disabled={!canStepForward || status === "playing"}
          className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Step
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08]"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
