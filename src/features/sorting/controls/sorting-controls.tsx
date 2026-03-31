"use client";

import { cn } from "@/lib/utils";
import type { PlaybackStatus } from "@/lib/animation/types";
import {
  performanceModeThreshold,
  performanceSortingSizeMax,
  standardSortingSizeMax,
} from "@/features/sorting/engine/constants";
import type {
  SortingAlgorithmId,
  SortingAlgorithmMeta,
  SortingComparisonConfig,
  SortingInputPresetId,
} from "@/features/sorting/engine/types";

type SortingControlsProps = {
  algorithms: SortingAlgorithmMeta[];
  presets: Array<{
    id: SortingInputPresetId;
    label: string;
    description: string;
  }>;
  config: SortingComparisonConfig;
  isPending: boolean;
  status: PlaybackStatus;
  onAlgorithmChange: (side: "left" | "right", algorithmId: SortingAlgorithmId) => void;
  onPresetChange: (preset: SortingInputPresetId) => void;
  onSizeChange: (size: number) => void;
  onSpeedChange: (speed: number) => void;
  onPerformanceModeChange: (enabled: boolean) => void;
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

export function SortingControls({
  algorithms,
  presets,
  config,
  isPending,
  status,
  onAlgorithmChange,
  onPresetChange,
  onSizeChange,
  onSpeedChange,
  onPerformanceModeChange,
  onPlay,
  onPauseResume,
  onStepForward,
  onReset,
  onRandomize,
  pauseResumeLabel,
  canStepForward,
}: SortingControlsProps) {
  const sizeMax = config.performanceMode
    ? performanceSortingSizeMax
    : standardSortingSizeMax;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Left Algorithm
            </span>
            <select
              value={config.leftAlgorithmId}
              onChange={(event) =>
                onAlgorithmChange("left", event.target.value as SortingAlgorithmId)
              }
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
              Right Algorithm
            </span>
            <select
              value={config.rightAlgorithmId}
              onChange={(event) =>
                onAlgorithmChange("right", event.target.value as SortingAlgorithmId)
              }
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
            >
              {algorithms.map((algorithm) => (
                <option key={algorithm.id} value={algorithm.id} className="bg-slate-950">
                  {algorithm.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Shared Run State
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
            Both panels replay the same dataset from one playback clock, so comparisons stay
            synchronized even when one algorithm completes ahead of the other.
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1fr_1fr]">
        <label className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Input Preset
            </span>
            <span className="text-sm font-medium text-slate-200">
              {presets.find((preset) => preset.id === config.inputPreset)?.label ?? "Random"}
            </span>
          </div>
          <select
            value={config.inputPreset}
            onChange={(event) => onPresetChange(event.target.value as SortingInputPresetId)}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
          >
            {presets.map((preset) => (
              <option key={preset.id} value={preset.id} className="bg-slate-950">
                {preset.label}
              </option>
            ))}
          </select>
          <div className="text-xs leading-6 text-slate-400">
            {presets.find((preset) => preset.id === config.inputPreset)?.description}
          </div>
        </label>

        <label className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Array Size
            </span>
            <span className="text-sm font-medium text-slate-200">
              {config.size} / {sizeMax}
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={sizeMax}
            step={1}
            value={config.size}
            onChange={(event) => onSizeChange(Number(event.target.value))}
            className="w-full accent-cyan-300"
          />
          <div className="text-xs leading-6 text-slate-400">
            {config.performanceMode
              ? "Performance mode raises the size ceiling and uses a lighter renderer for large runs."
              : `Standard mode keeps the DOM renderer. Turn on performance mode around ${performanceModeThreshold}+ bars.`}
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

      <label className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Performance Mode
          </div>
          <div className="mt-2 text-sm leading-6 text-slate-300">
            Uses Canvas rendering, larger dataset sizes, and stripped-down animation styling to
            keep frame updates smooth.
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={config.performanceMode}
          onClick={() => onPerformanceModeChange(!config.performanceMode)}
          className={cn(
            "relative inline-flex h-7 w-14 shrink-0 rounded-full border transition",
            config.performanceMode
              ? "border-cyan-300/30 bg-cyan-300/20"
              : "border-white/10 bg-white/[0.05]",
          )}
        >
          <span
            className={cn(
              "absolute top-1 h-5 w-5 rounded-full transition",
              config.performanceMode
                ? "left-8 bg-cyan-100"
                : "left-1 bg-slate-200",
            )}
          />
        </button>
      </label>

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
          {isPending
            ? "Rebuilding timelines..."
            : config.performanceMode
              ? "Synchronized canvas playback"
              : "Synchronized event playback"}
        </span>
      </div>
    </div>
  );
}
