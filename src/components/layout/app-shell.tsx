import type { ReactNode } from "react";

import Link from "next/link";

import { SiteNavigation } from "@/components/navigation/site-navigation";
import { LogoMark } from "@/components/ui/logo-mark";
import { StatusPill } from "@/components/ui/status-pill";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-[304px] shrink-0 overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/60 p-5 shadow-[0_30px_100px_rgba(2,6,23,0.55)] backdrop-blur-xl lg:flex lg:flex-col">
          <div className="flex items-center gap-4">
            <LogoMark />
            <div>
              <div className="text-sm font-semibold tracking-[0.24em] text-slate-300 uppercase">
                Algo Visualizer
              </div>
              <div className="mt-1 text-sm text-slate-400">
                Algorithm labs for education and product-grade demos
              </div>
            </div>
          </div>

          <div className="mt-8 flex-1">
            <SiteNavigation />
          </div>

          <div className="rounded-[28px] border border-cyan-300/14 bg-cyan-300/[0.06] p-5">
            <StatusPill label="Engine Ready" tone="success" />
            <h2 className="mt-4 text-lg font-semibold text-white">Feature-first scaffold</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              UI, controls, visualization, and algorithm contracts are separated so future
              labs do not collapse into route-level components.
            </p>
            <Link
              href="/about"
              className="mt-5 inline-flex items-center rounded-full border border-cyan-300/20 bg-white/6 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/35 hover:bg-white/10"
            >
              Review architecture
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-4 z-20 rounded-[28px] border border-white/10 bg-slate-950/55 px-4 py-4 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl lg:hidden">
            <div className="mb-4 flex items-center gap-3">
              <LogoMark />
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-200">
                  Algo Visualizer
                </div>
                <div className="text-xs text-slate-400">Interactive computer science labs</div>
              </div>
            </div>
            <SiteNavigation mobile />
          </header>

          <main className="flex-1 py-6 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

