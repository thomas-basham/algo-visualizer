"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteRoutes } from "@/components/navigation/site-routes";
import { cn } from "@/lib/utils";

type SiteNavigationProps = {
  mobile?: boolean;
};

export function SiteNavigation({ mobile = false }: SiteNavigationProps) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <nav aria-label="Primary" className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
        {siteRoutes.map((route) => {
          const isActive =
            route.href === "/"
              ? pathname === route.href
              : pathname.startsWith(route.href);

          return (
            <Link
              key={route.href}
              href={route.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "interactive-lift inline-flex min-w-fit items-center rounded-full border px-3.5 py-2 text-sm font-medium transition",
                isActive
                  ? "border-cyan-300/40 bg-cyan-300/12 text-cyan-100 shadow-[0_0_0_1px_rgba(103,232,249,0.08)]"
                  : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-300/25 hover:bg-white/[0.08] hover:text-white",
              )}
            >
              {route.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Primary" className="space-y-2.5">
      {siteRoutes.map((route) => {
        const isActive =
          route.href === "/" ? pathname === route.href : pathname.startsWith(route.href);

        return (
          <Link
            key={route.href}
            href={route.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "interactive-lift group block rounded-[24px] border px-4 py-3.5 transition",
              isActive
                ? "border-cyan-300/35 bg-cyan-300/10 shadow-[0_20px_44px_rgba(10,18,36,0.38)]"
                : "border-white/8 bg-white/[0.025] hover:border-cyan-300/20 hover:bg-white/[0.05]",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={cn(
                  "text-sm font-semibold tracking-tight",
                  isActive ? "text-white" : "text-slate-200",
                )}
              >
                {route.label}
              </div>
              <span
                className={cn(
                  "mt-1 h-2.5 w-2.5 rounded-full transition",
                  isActive
                    ? "bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.65)]"
                    : "bg-white/12 group-hover:bg-cyan-300/50",
                )}
              />
            </div>
            <div className="mt-2 text-xs leading-5 text-slate-400">{route.description}</div>
          </Link>
        );
      })}
    </nav>
  );
}
