import { dataStructureMap } from "@/features/data-structures/engine/constants";
import type {
  DataStructureId,
  DataStructureMeta,
  DataStructureOperationId,
} from "@/features/data-structures/engine/types";

type DataStructuresInfoPanelProps = {
  structureId: DataStructureId;
  operationId: DataStructureOperationId;
  structure: DataStructureMeta;
};

export function DataStructuresInfoPanel({
  structureId,
  operationId,
  structure,
}: DataStructuresInfoPanelProps) {
  const operation = structure.operations[operationId];
  const structureLabel = dataStructureMap[structureId].label;

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
            {structureLabel}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
            {operation.label}
          </span>
        </div>
        <p className="text-sm leading-7 text-slate-300">{structure.description}</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Beginner Explanation
        </div>
        <p className="mt-3 text-sm leading-7 text-slate-300">{structure.beginnerExplanation}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {Object.entries(structure.operations).map(([key, item]) => (
          <div
            key={key}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-4"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {item.label}
            </div>
            <div className="mt-3 text-sm leading-6 text-slate-300">{item.description}</div>
            <div className="mt-3 text-xs uppercase tracking-[0.18em] text-cyan-200/80">
              {item.complexity}
            </div>
          </div>
        ))}
      </div>

      {structure.note ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-slate-300">
          {structure.note}
        </div>
      ) : null}
    </div>
  );
}
