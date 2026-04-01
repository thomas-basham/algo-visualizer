import type {
  DataStructureMeta,
  DataStructureOperationId,
} from "@/features/data-structures/engine/types";

type DataStructuresStepPanelProps = {
  title: string;
  detail: string;
  summary: string;
  operationId: DataStructureOperationId;
  structure: DataStructureMeta;
};

export function DataStructuresStepPanel({
  title,
  detail,
  summary,
  operationId,
  structure,
}: DataStructuresStepPanelProps) {
  const pseudocode = structure.pseudocode[operationId];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Current Step
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-white">{title}</h3>
          <p className="text-sm leading-7 text-slate-300">{detail}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm leading-7 text-slate-300">
          {summary}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Operation Outline
        </div>
        <div className="mt-4 space-y-3">
          {pseudocode.map((line) => (
            <div
              key={line.line}
              className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
            >
              <span className="mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-2 text-[11px] font-semibold text-slate-300">
                {line.line}
              </span>
              <code className="text-sm leading-7 text-slate-200">{line.code}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
