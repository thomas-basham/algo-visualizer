"use client";

import { cn } from "@/lib/utils";

type StructureNodeProps = {
  value: number;
  label?: string;
  tone?: "default" | "active" | "visited" | "found" | "inserted" | "removed";
  className?: string;
};

const toneStyles: Record<NonNullable<StructureNodeProps["tone"]>, string> = {
  default: "border-white/10 bg-white/[0.05] text-slate-100",
  active: "border-cyan-300/30 bg-cyan-300/14 text-cyan-50 shadow-[0_0_0_1px_rgba(34,211,238,0.12)]",
  visited: "border-white/8 bg-white/[0.03] text-slate-400",
  found: "border-emerald-300/30 bg-emerald-300/14 text-emerald-50 shadow-[0_0_0_1px_rgba(52,211,153,0.12)]",
  inserted: "border-fuchsia-300/28 bg-fuchsia-300/12 text-fuchsia-50 shadow-[0_0_0_1px_rgba(232,121,249,0.1)]",
  removed: "border-rose-300/30 bg-rose-300/12 text-rose-50 opacity-70",
};

export function StructureNode({
  value,
  label,
  tone = "default",
  className,
}: StructureNodeProps) {
  return (
    <div
      className={cn(
        "min-w-16 rounded-3xl border px-4 py-4 text-center transition duration-300",
        toneStyles[tone],
        className,
      )}
    >
      {label ? (
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </div>
      ) : null}
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
