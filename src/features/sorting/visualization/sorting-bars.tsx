"use client";

import { memo, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type SortingBarsProps = {
  values: number[];
  comparedIndices: number[];
  swappedIndices: number[];
  overwrittenIndices: number[];
  sortedIndices: number[];
  pivotIndices: number[];
  mergedIndices: number[];
  transitionMs: number;
  performanceMode?: boolean;
};

type HighlightSets = {
  compared: Set<number>;
  swapped: Set<number>;
  overwritten: Set<number>;
  sorted: Set<number>;
  pivot: Set<number>;
  merged: Set<number>;
};

const canvasColors = {
  default: "#64748b",
  compared: "#22d3ee",
  swapped: "#f97316",
  overwritten: "#ec4899",
  pivot: "#f59e0b",
  merged: "#8b5cf6",
  sorted: "#10b981",
} as const;

function createHighlightSets({
  comparedIndices,
  swappedIndices,
  overwrittenIndices,
  sortedIndices,
  pivotIndices,
  mergedIndices,
}: SortingBarsProps): HighlightSets {
  return {
    compared: new Set(comparedIndices),
    swapped: new Set(swappedIndices),
    overwritten: new Set(overwrittenIndices),
    sorted: new Set(sortedIndices),
    pivot: new Set(pivotIndices),
    merged: new Set(mergedIndices),
  };
}

function SortingBarsLegend({ performanceMode }: { performanceMode: boolean }) {
  return (
    <div className="relative mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
      <span className="inline-flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
        Default
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
        Comparing
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
        Swapping
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-pink-400" />
        Overwrite
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        Pivot
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-violet-300" />
        Merge
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        Sorted
      </span>
      {performanceMode ? (
        <span className="inline-flex items-center gap-2 text-slate-500">
          Canvas renderer active
        </span>
      ) : null}
    </div>
  );
}

function getCanvasBarColor(index: number, highlights: HighlightSets) {
  if (highlights.overwritten.has(index)) {
    return canvasColors.overwritten;
  }

  if (highlights.swapped.has(index)) {
    return canvasColors.swapped;
  }

  if (highlights.pivot.has(index)) {
    return canvasColors.pivot;
  }

  if (highlights.merged.has(index)) {
    return canvasColors.merged;
  }

  if (highlights.compared.has(index)) {
    return canvasColors.compared;
  }

  if (highlights.sorted.has(index)) {
    return canvasColors.sorted;
  }

  return canvasColors.default;
}

function SortingBarsCanvas(props: SortingBarsProps) {
  const {
    values,
    comparedIndices,
    swappedIndices,
    overwrittenIndices,
    sortedIndices,
    pivotIndices,
    mergedIndices,
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const syncWidth = () => setCanvasWidth(container.clientWidth);
    const observer = new ResizeObserver(syncWidth);

    syncWidth();
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || canvasWidth <= 0) {
      return;
    }

    const cssHeight = 320;
    const ratio = window.devicePixelRatio || 1;
    const highlights = createHighlightSets({
      values,
      comparedIndices,
      swappedIndices,
      overwrittenIndices,
      sortedIndices,
      pivotIndices,
      mergedIndices,
      transitionMs: 0,
      performanceMode: true,
    });
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    canvas.width = Math.floor(canvasWidth * ratio);
    canvas.height = Math.floor(cssHeight * ratio);
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, canvasWidth, cssHeight);
    context.fillStyle = "#020617";
    context.fillRect(0, 0, canvasWidth, cssHeight);

    context.strokeStyle = "rgba(148, 163, 184, 0.12)";
    context.lineWidth = 1;
    for (let gridLine = 1; gridLine < 5; gridLine += 1) {
      const y = cssHeight - (cssHeight / 5) * gridLine;
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvasWidth, y);
      context.stroke();
    }

    const gap = values.length > 96 ? 0 : 1;
    const barWidth = Math.max(
      (canvasWidth - gap * Math.max(values.length - 1, 0)) / Math.max(values.length, 1),
      1,
    );

    values.forEach((value, index) => {
      const x = index * (barWidth + gap);
      const barHeight = Math.max(2, (Math.max(10, value) / 100) * cssHeight);
      const y = cssHeight - barHeight;

      context.fillStyle = getCanvasBarColor(index, highlights);
      context.fillRect(x, y, Math.max(1, barWidth), barHeight);
    });
  }, [
    canvasWidth,
    comparedIndices,
    mergedIndices,
    overwrittenIndices,
    pivotIndices,
    sortedIndices,
    swappedIndices,
    values,
  ]);

  return (
    <div className="relative rounded-[28px] border border-white/8 bg-slate-950/80 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-slate-500">
        <span>Performance Mode</span>
        <span>Canvas rendering, reduced styling</span>
      </div>
      <div
        ref={containerRef}
        className="relative h-[320px] overflow-hidden rounded-[22px] border border-white/8 bg-slate-950"
      >
        <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
      </div>
      <div className="relative mt-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
        <span>Low</span>
        <span>Relative value magnitude</span>
        <span>High</span>
      </div>
      <SortingBarsLegend performanceMode />
    </div>
  );
}

function SortingBarsDom(props: SortingBarsProps) {
  const {
    values,
    comparedIndices,
    swappedIndices,
    overwrittenIndices,
    sortedIndices,
    pivotIndices,
    mergedIndices,
    transitionMs,
  } = props;
  const comparedSet = new Set(comparedIndices);
  const swappedSet = new Set(swappedIndices);
  const overwrittenSet = new Set(overwrittenIndices);
  const sortedSet = new Set(sortedIndices);
  const pivotSet = new Set(pivotIndices);
  const mergedSet = new Set(mergedIndices);

  return (
    <div className="relative rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] px-4 pb-4 pt-6 sm:px-6 sm:pb-6">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(56,189,248,0.06),transparent_25%),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(180deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:auto,40px_100%,100%_40px] bg-[position:0_0,0_0,0_100%] opacity-70" />
      <div className="relative flex h-[320px] items-end gap-1">
        {values.map((value, index) => {
          const isCompared = comparedSet.has(index);
          const isSwapped = swappedSet.has(index);
          const isOverwritten = overwrittenSet.has(index);
          const isSorted = sortedSet.has(index);
          const isPivot = pivotSet.has(index);
          const isMerged = mergedSet.has(index);

          return (
            <div key={index} className="flex min-w-0 flex-1 flex-col justify-end">
              <div
                className={cn(
                  "rounded-t-[14px] transition-[height,background-color,opacity] ease-out",
                  isOverwritten
                    ? "bg-[linear-gradient(180deg,#f9a8d4,#db2777)]"
                    : isSwapped
                      ? "bg-[linear-gradient(180deg,#fda4af,#f97316)]"
                      : isPivot
                        ? "bg-[linear-gradient(180deg,#fde68a,#f59e0b)]"
                        : isMerged
                          ? "bg-[linear-gradient(180deg,#c4b5fd,#6366f1)]"
                          : isCompared
                            ? "bg-[linear-gradient(180deg,#67e8f9,#0ea5e9)]"
                            : isSorted
                              ? "bg-[linear-gradient(180deg,#34d399,#059669)]"
                              : "bg-[linear-gradient(180deg,#94a3b8,#475569)]",
                )}
                style={{
                  height: `${Math.max(10, value)}%`,
                  transitionDuration: `${transitionMs}ms`,
                }}
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>
      <div className="relative mt-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
        <span>Low</span>
        <span>Relative value magnitude</span>
        <span>High</span>
      </div>
      <SortingBarsLegend performanceMode={false} />
    </div>
  );
}

export const SortingBars = memo(function SortingBars({
  performanceMode = false,
  ...props
}: SortingBarsProps) {
  if (performanceMode) {
    return <SortingBarsCanvas performanceMode {...props} />;
  }

  return <SortingBarsDom performanceMode={false} {...props} />;
});
