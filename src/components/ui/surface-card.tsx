import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SurfaceCardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function SurfaceCard({
  title,
  description,
  children,
  className,
}: SurfaceCardProps) {
  return (
    <section
      className={cn(
        "surface-sheen rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(11,18,33,0.86),rgba(7,12,24,0.78))] p-6 shadow-[0_28px_90px_rgba(2,6,23,0.42)] backdrop-blur-xl sm:p-7",
        className,
      )}
    >
      {(title || description) && (
        <header className="relative mb-6 space-y-1.5">
          {title ? (
            <h2 className="font-display text-lg font-semibold tracking-tight text-white sm:text-[1.15rem]">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="max-w-3xl text-sm leading-6 text-slate-400">{description}</p>
          ) : null}
        </header>
      )}
      <div className="relative">{children}</div>
    </section>
  );
}
