import type { ReactNode } from "react";

import { StatusPill } from "@/components/ui/status-pill";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  badge,
  actions,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "surface-sheen animate-enter relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,15,28,0.96),rgba(7,12,22,0.86))] px-6 py-8 shadow-[0_32px_96px_rgba(2,6,23,0.52)] sm:px-8 sm:py-10 lg:px-10 lg:py-12",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.2),transparent_24%),radial-gradient(circle_at_center_right,rgba(16,185,129,0.15),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[32%] bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.18),transparent_56%)] lg:block" />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/80">
              {eyebrow}
            </span>
            {badge ? <StatusPill label={badge} tone="accent" /> : null}
          </div>
          <div className="space-y-4">
            <h1 className="max-w-4xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[3.35rem] lg:leading-[1.02]">
              {title}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              {description}
            </p>
          </div>
        </div>
        {actions ? (
          <div className="relative flex flex-wrap gap-3 rounded-[26px] border border-white/10 bg-white/[0.035] p-2.5 backdrop-blur-sm">
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}
