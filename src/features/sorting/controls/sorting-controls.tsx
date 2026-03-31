"use client";

import type { SortingAlgorithmId, SortingRunConfig } from "@/features/sorting/engine/types";

type SortingControlsProps = {
  config: SortingRunConfig;
  isPending: boolean;
  onAlgorithmChange: (algorithmId: SortingAlgorithmId) => void;
  onDistributionChange: (distribution: SortingRunConfig["distribution"]) => void;
  onSizeChange: (size: number) => void;
  onSpeedChange: (speed: number) => void;
  onPlayPause: () => void;
  onReset: () => void;
  onRandomize: () => void;
  playbackLabel: string;
};

const algorithmOptions: Array<{ value: SortingAlgorithmId; label: string }> = [
  { value: "bubble", label: "Bubble Sort" },
  { value: "selection", label: "Selection Sort" },
  { value: "insertion", label: "Insertion Sort" },
  { value: "merge", label: "Merge Sort" },
  { value: "quick", label: "Quick Sort" },
  { value: "native-js", label: "JS Native Sort" },
];

export function SortingControls({
  config,
  isPending,
  onAlgorithmChange,
  onDistributionChange,
  onSizeChange,
  onSpeedChange,
  onPlayPause,
  onReset,
  onRandomize,
  playbackLabel,
}: SortingControlsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Algorithm
          </span>
          <select
            value={config.algorithmId}
            onChange={(event) => onAlgorithmChange(event.target.value as SortingAlgorithmId)}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
          >
            {algorithmOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-slate-950">
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Distribution
          </span>
          <select
            value={config.distribution}
            onChange={(event) =>
              onDistributionChange(event.target.value as SortingRunConfig["distribution"])
            }
            className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
          >
            <option value="random" className="bg-slate-950">
              Randomized
            </option>
            <option value="nearly-sorted" className="bg-slate-950">
              Nearly Sorted
            </option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Array Size
            </span>
            <span className="text-sm font-medium text-slate-200">{config.size}</span>
          </div>
          <input
            type="range"
            min={8}
            max={96}
            step={1}
            value={config.size}
            onChange={(event) => onSizeChange(Number(event.target.value))}
            className="w-full accent-cyan-300"
          />
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
          onClick={onPlayPause}
          className="inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-300/12 px-4 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/16"
        >
          {playbackLabel}
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
        <span className="inline-flex items-center rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2.5 text-sm text-amber-100">
          {isPending ? "Refreshing dataset..." : "Engine hook scaffolded"}
        </span>
      </div>
    </div>
  );
}

