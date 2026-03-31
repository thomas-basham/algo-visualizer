"use client";

import { memo } from "react";

import { cn } from "@/lib/utils";

type SearchingArrayProps = {
  values: number[];
  target: number;
  checkedIndices: number[];
  visitedIndices: number[];
  activeRangeIndices: number[];
  foundIndices: number[];
};

export const SearchingArray = memo(function SearchingArray({
  values,
  target,
  checkedIndices,
  visitedIndices,
  activeRangeIndices,
  foundIndices,
}: SearchingArrayProps) {
  const checkedSet = new Set(checkedIndices);
  const visitedSet = new Set(visitedIndices);
  const activeRangeSet = new Set(activeRangeIndices);
  const foundSet = new Set(foundIndices);

  return (
    <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-5">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
          Target {target}
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-400">
          Values stay sorted for Binary Search
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {values.map((value, index) => {
          const isChecked = checkedSet.has(index);
          const isVisited = visitedSet.has(index);
          const isActiveRange = activeRangeSet.has(index);
          const isFound = foundSet.has(index);

          return (
            <div
              key={`${index}-${value}`}
              className={cn(
                "rounded-3xl border px-4 py-4 transition",
                isFound
                  ? "border-emerald-300/30 bg-emerald-300/14 text-emerald-50 shadow-[0_0_0_1px_rgba(52,211,153,0.12)]"
                  : isChecked
                    ? "border-cyan-300/30 bg-cyan-300/12 text-cyan-50 shadow-[0_0_0_1px_rgba(34,211,238,0.12)]"
                    : isActiveRange
                      ? "border-violet-300/20 bg-violet-300/8 text-slate-100"
                      : isVisited
                        ? "border-white/8 bg-white/[0.025] text-slate-500"
                        : "border-white/8 bg-white/[0.04] text-slate-200",
              )}
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Index {index}
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
          Current check
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-violet-300" />
          Active range
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
          Already visited
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          Found target
        </span>
      </div>
    </div>
  );
});
