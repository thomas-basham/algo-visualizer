import { cn } from "@/lib/utils";

type SortingBarsProps = {
  values: number[];
  comparedIndices: number[];
  swappedIndices: number[];
  sortedIndices: number[];
  transitionMs: number;
};

export function SortingBars({
  values,
  comparedIndices,
  swappedIndices,
  sortedIndices,
  transitionMs,
}: SortingBarsProps) {
  const comparedSet = new Set(comparedIndices);
  const swappedSet = new Set(swappedIndices);
  const sortedSet = new Set(sortedIndices);

  return (
    <div className="relative rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] px-4 pb-4 pt-6 sm:px-6 sm:pb-6">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(56,189,248,0.06),transparent_25%),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(180deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:auto,40px_100%,100%_40px] bg-[position:0_0,0_0,0_100%] opacity-70" />
      <div className="relative flex h-[320px] items-end gap-1">
        {values.map((value, index) => {
          const isCompared = comparedSet.has(index);
          const isSwapped = swappedSet.has(index);
          const isSorted = sortedSet.has(index);

          return (
            <div key={index} className="flex min-w-0 flex-1 flex-col justify-end">
              <div
                className={cn(
                  "rounded-t-[14px] transition-[height,background-color,opacity] ease-out",
                  isSwapped
                    ? "bg-[linear-gradient(180deg,#fda4af,#f97316)]"
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
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          Sorted
        </span>
      </div>
    </div>
  );
}
