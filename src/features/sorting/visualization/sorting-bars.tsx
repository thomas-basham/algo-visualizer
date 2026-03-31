import { cn } from "@/lib/utils";

type SortingBarsProps = {
  values: number[];
  activeIndices: number[];
  sortedIndices: number[];
  pivotIndex: number | null;
  animated?: boolean;
};

export function SortingBars({
  values,
  activeIndices,
  sortedIndices,
  pivotIndex,
  animated = false,
}: SortingBarsProps) {
  return (
    <div className="relative rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] px-4 pb-4 pt-6 sm:px-6 sm:pb-6">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(56,189,248,0.06),transparent_25%),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(180deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:auto,40px_100%,100%_40px] bg-[position:0_0,0_0,0_100%] opacity-70" />
      <div className="relative flex h-[320px] items-end gap-1">
        {values.map((value, index) => {
          const isActive = activeIndices.includes(index);
          const isSorted = sortedIndices.includes(index);
          const isPivot = pivotIndex === index;

          return (
            <div key={`${index}-${value}`} className="flex min-w-0 flex-1 flex-col justify-end">
              <div
                className={cn(
                  "rounded-t-[14px] transition-all duration-300",
                  animated ? "animate-pulse" : "",
                  isSorted
                    ? "bg-[linear-gradient(180deg,#34d399,#059669)]"
                    : isPivot
                      ? "bg-[linear-gradient(180deg,#fbbf24,#f59e0b)]"
                      : isActive
                        ? "bg-[linear-gradient(180deg,#67e8f9,#0ea5e9)]"
                        : "bg-[linear-gradient(180deg,#94a3b8,#475569)]",
                )}
                style={{ height: `${Math.max(10, value)}%` }}
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
    </div>
  );
}

