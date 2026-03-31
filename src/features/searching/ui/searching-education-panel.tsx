import type { SearchAlgorithmMeta } from "@/features/searching/engine/types";

type SearchingEducationPanelProps = {
  algorithm: SearchAlgorithmMeta;
  stepTitle: string;
  stepDetail: string;
  activeLine: number | null;
};

export function SearchingEducationPanel({
  algorithm,
  stepTitle,
  stepDetail,
  activeLine,
}: SearchingEducationPanelProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-5">
        <div className="rounded-3xl border border-cyan-300/12 bg-cyan-300/7 p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
            Current Step
          </div>
          <div className="mt-3 text-lg font-semibold text-white">{stepTitle}</div>
          <div className="mt-3 text-sm leading-7 text-slate-200">{stepDetail}</div>
        </div>

        <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Plain-English Overview
          </div>
          <div className="mt-3 text-sm leading-7 text-slate-300">
            {algorithm.beginnerExplanation}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Pseudocode
          </div>
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
            {activeLine ? `Line ${activeLine}` : "Idle"}
          </div>
        </div>

        <div className="mt-4 space-y-2 font-mono text-sm">
          {algorithm.pseudocode.map((line) => {
            const isActive = line.line === activeLine;

            return (
              <div
                key={line.line}
                className={
                  isActive
                    ? "rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-cyan-50 shadow-[0_0_0_1px_rgba(103,232,249,0.08)]"
                    : "rounded-2xl border border-transparent px-4 py-3 text-slate-400"
                }
              >
                <span className="mr-3 inline-block w-6 text-slate-500">{line.line}</span>
                <span>{line.code}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
