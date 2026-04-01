"use client";

import { cn } from "@/lib/utils";
import type { PlaybackStatus } from "@/lib/animation/types";
import { dataStructuresValueMax, dataStructuresValueMin } from "@/features/data-structures/engine/constants";
import type {
  DataStructureId,
  DataStructureMeta,
  DataStructureOperationId,
} from "@/features/data-structures/engine/types";

type DataStructuresControlsProps = {
  structures: DataStructureMeta[];
  selectedStructureId: DataStructureId;
  selectedOperationId: DataStructureOperationId;
  valueInput: string;
  speed: number;
  status: PlaybackStatus;
  inputRequired: boolean;
  inputLabel?: string;
  inputHint?: string;
  canRun: boolean;
  canPlay: boolean;
  canStepForward: boolean;
  pauseResumeLabel: string;
  onStructureChange: (structureId: DataStructureId) => void;
  onOperationChange: (operationId: DataStructureOperationId) => void;
  onValueInputChange: (nextValue: string) => void;
  onSpeedChange: (speed: number) => void;
  onRunOperation: () => void;
  onPlay: () => void;
  onPauseResume: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onRestoreExample: () => void;
};

const statusCopy: Record<PlaybackStatus, string> = {
  ready: "Ready",
  playing: "Animating",
  paused: "Paused",
  completed: "Complete",
};

export function DataStructuresControls({
  structures,
  selectedStructureId,
  selectedOperationId,
  valueInput,
  speed,
  status,
  inputRequired,
  inputLabel,
  inputHint,
  canRun,
  canPlay,
  canStepForward,
  pauseResumeLabel,
  onStructureChange,
  onOperationChange,
  onValueInputChange,
  onSpeedChange,
  onRunOperation,
  onPlay,
  onPauseResume,
  onStepForward,
  onReset,
  onRestoreExample,
}: DataStructuresControlsProps) {
  const selectedStructure =
    structures.find((structure) => structure.id === selectedStructureId) ?? structures[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Structure
            </span>
            <select
              value={selectedStructureId}
              onChange={(event) => onStructureChange(event.target.value as DataStructureId)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
            >
              {structures.map((structure) => (
                <option key={structure.id} value={structure.id} className="bg-slate-950">
                  {structure.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Operation
            </span>
            <select
              value={selectedOperationId}
              onChange={(event) => onOperationChange(event.target.value as DataStructureOperationId)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
            >
              {Object.entries(selectedStructure.operations).map(([operationId, operation]) => (
                <option key={operationId} value={operationId} className="bg-slate-950">
                  {operation.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Playback State
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
              {statusCopy[status]}
            </span>
          </div>
          <div className="mt-3 text-sm leading-6 text-slate-300">
            Every structure operation emits explicit events into the same playback model used by
            the sorting and searching labs.
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <label className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {inputLabel ?? "Value"}
            </span>
            <span className="text-sm font-medium text-slate-200">
              {inputRequired ? `${dataStructuresValueMin}-${dataStructuresValueMax}` : "Optional"}
            </span>
          </div>
          <input
            type="number"
            min={dataStructuresValueMin}
            max={dataStructuresValueMax}
            value={valueInput}
            onChange={(event) => onValueInputChange(event.target.value)}
            disabled={!inputRequired}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={inputRequired ? "Enter a value" : "No value needed"}
          />
          <div className="text-xs leading-6 text-slate-400">
            {inputRequired
              ? inputHint
              : "This operation acts on the structure boundary directly, so no extra value is required."}
          </div>
        </label>

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
          <div className="text-xs leading-6 text-slate-400">
            Faster playback is useful for repeated practice. Slower playback makes each pointer or
            node decision easier to follow.
          </div>
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRunOperation}
          disabled={!canRun}
          className="inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-300/12 px-4 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/16 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Run Operation
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
          Reset Animation
        </button>
        <button
          type="button"
          onClick={onRestoreExample}
          className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08]"
        >
          Restore Example
        </button>
      </div>
    </div>
  );
}
