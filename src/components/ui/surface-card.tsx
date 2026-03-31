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
        "rounded-[28px] border border-white/10 bg-slate-950/55 p-6 shadow-[0_24px_80px_rgba(3,8,20,0.45)] backdrop-blur-xl",
        className,
      )}
    >
      {(title || description) && (
        <header className="mb-5 space-y-1">
          {title ? <h2 className="text-lg font-semibold text-white">{title}</h2> : null}
          {description ? <p className="text-sm leading-6 text-slate-400">{description}</p> : null}
        </header>
      )}
      {children}
    </section>
  );
}

