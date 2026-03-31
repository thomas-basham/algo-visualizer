import { cn } from "@/lib/utils";

type StatusPillProps = {
  label: string;
  tone?: "neutral" | "accent" | "success" | "warning";
};

const toneStyles = {
  neutral: "border-white/10 bg-white/6 text-slate-200",
  accent: "border-cyan-300/25 bg-cyan-300/12 text-cyan-100",
  success: "border-emerald-300/25 bg-emerald-300/12 text-emerald-100",
  warning: "border-amber-300/25 bg-amber-300/12 text-amber-100",
} as const;

export function StatusPill({ label, tone = "neutral" }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-[0.18em] uppercase",
        toneStyles[tone],
      )}
    >
      {label}
    </span>
  );
}

