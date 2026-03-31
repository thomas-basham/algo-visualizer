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
      <nav className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
        {siteRoutes.map((route) => {
          const isActive =
            route.href === "/"
              ? pathname === route.href
              : pathname.startsWith(route.href);

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "inline-flex min-w-fit items-center rounded-full border px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "border-cyan-300/40 bg-cyan-300/12 text-cyan-100 shadow-[0_0_0_1px_rgba(103,232,249,0.08)]"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-300/25 hover:bg-white/8 hover:text-white",
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
    <nav className="space-y-2">
      {siteRoutes.map((route) => {
        const isActive =
          route.href === "/" ? pathname === route.href : pathname.startsWith(route.href);

        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "block rounded-2xl border px-4 py-3 transition",
              isActive
                ? "border-cyan-300/35 bg-cyan-300/10 shadow-[0_16px_40px_rgba(10,18,36,0.4)]"
                : "border-white/8 bg-white/[0.03] hover:border-cyan-300/20 hover:bg-white/[0.05]",
            )}
          >
            <div className={cn("text-sm font-semibold", isActive ? "text-white" : "text-slate-200")}>
              {route.label}
            </div>
            <div className="mt-1 text-xs leading-5 text-slate-400">{route.description}</div>
          </Link>
        );
      })}
    </nav>
  );
}

