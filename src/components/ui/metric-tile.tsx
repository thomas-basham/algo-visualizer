import { formatNumber } from "@/lib/utils";

type MetricTileProps = {
  label: string;
  value: number | string;
  hint?: string;
};

export function MetricTile({ label, value, hint }: MetricTileProps) {
  const displayValue = typeof value === "number" ? formatNumber(value) : value;

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-white">{displayValue}</div>
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}

