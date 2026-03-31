"use client";

import { cn } from "@/lib/utils";
import type { PlaybackStatus } from "@/lib/animation/types";
import { searchingSizeMax } from "@/features/searching/engine/constants";
import type {
  SearchAlgorithmId,
  SearchAlgorithmMeta,
  SearchingRunConfig,
} from "@/features/searching/engine/types";

type SearchingControlsProps = {
  algorithms: SearchAlgorithmMeta[];
  config: SearchingRunConfig;
  values: number[];
  target: number;
  missingTarget: number;
  isPending: boolean;
  status: PlaybackStatus;
  onAlgorithmChange: (algorithmId: SearchAlgorithmId) => void;
  onTargetChange: (target: number) => void;
  onSizeChange: (size: number) => void;
  onSpeedChange: (speed: number) => void;
  onPlay: () => void;
  onPauseResume: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onRandomize: () => void;
  pauseResumeLabel: string;
  canStepForward: boolean;
};

const statusCopy: Record<PlaybackStatus, string> = {
  ready: "Ready",
  playing: "Animating",
  paused: "Paused",
  completed: "Complete",
};

export function SearchingControls({
  algorithms,
  config,
  values,
  target,
  missingTarget,
  isPending,
  status,
  onAlgorithmChange,
  onTargetChange,
  onSizeChange,
  onSpeedChange,
  onPlay,
  onPauseResume,
  onStepForward,
  onReset,
  onRandomize,
  pauseResumeLabel,
  canStepForward,
}: SearchingControlsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Algorithm
            </span>
            <select
              value={config.algorithmId}
              onChange={(event) => onAlgorithmChange(event.target.value as SearchAlgorithmId)}
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
              Target
            </span>
            <select
              value={target}
              onChange={(event) => onTargetChange(Number(event.target.value))}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
            >
              {values.map((value) => (
                <option key={value} value={value} className="bg-slate-950">
                  {value}
                </option>
              ))}
              <option value={missingTarget} className="bg-slate-950">
                Missing target ({missingTarget})
              </option>
            </select>
          </label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Run State
          </div>
          <div className="mt-3 flex items-center justify-between gap-4">
            <div className="text-sm font-medium text-white">{statusCopy[status]}</div>
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
              {isPending ? "Refreshing" : statusCopy[status]}
            </span>
          </div>
          <div className="mt-3 text-sm leading-6 text-slate-300">
            This search lab reuses the same event timeline and playback controls as the sorting
            module, but applies them to probe-by-probe search decisions.
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Array Size
            </span>
            <span className="text-sm font-medium text-slate-200">
              {config.size} / {searchingSizeMax}
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={searchingSizeMax}
            step={1}
            value={config.size}
            onChange={(event) => onSizeChange(Number(event.target.value))}
            className="w-full accent-cyan-300"
          />
          <div className="text-xs leading-6 text-slate-400">
            The search array stays sorted so Binary Search can work correctly and Linear Search
            can still inspect the same values one at a time.
          </div>
        </label>

        <label className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Animation Speed
            </span>
            <span className="text-sm font-medium text-slate-200">{config.speed}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={config.speed}
            onChange={(event) => onSpeedChange(Number(event.target.value))}
            className="w-full accent-emerald-300"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onPlay}
          disabled={isPending || status === "playing"}
          className="inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-300/12 px-4 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/16 disabled:cursor-not-allowed disabled:opacity-50"
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
          className="inline-flex items-center rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2.5 text-sm font-medium text-emerald-100 transition hover:border-emerald-300/35 hover:bg-emerald-300/16 disabled:cursor-not-allowed disabled:opacity-50"
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
        <button
          type="button"
          onClick={onRandomize}
          className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08]"
        >
          Randomize
        </button>
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-300">
          {isPending ? "Rebuilding timeline..." : "Shared playback controls"}
        </span>
      </div>
    </div>
  );
}
