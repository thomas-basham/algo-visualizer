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
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="surface-sheen sticky top-4 hidden h-[calc(100vh-2rem)] w-[320px] shrink-0 overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,14,28,0.96),rgba(7,12,22,0.88))] p-6 shadow-[0_34px_110px_rgba(2,6,23,0.54)] backdrop-blur-xl xl:flex xl:flex-col">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_56%)]" />
          <div className="relative flex items-center gap-4">
            <LogoMark />
            <div>
              <div className="font-display text-sm font-semibold tracking-[0.28em] text-slate-200 uppercase">
                Algo Visualizer
              </div>
              <div className="mt-1 text-sm leading-6 text-slate-400">
                Serious algorithm labs for education, interviews, and product demos
              </div>
            </div>
          </div>

          <div className="relative mt-6 rounded-[28px] border border-white/10 bg-white/[0.035] p-4">
            <StatusPill label="Portfolio Build" tone="accent" />
            <p className="mt-3 text-sm leading-6 text-slate-300">
              A dark, developer-grade interface with event-driven labs for sorting, searching,
              graphs, and core data structures.
            </p>
          </div>

          <div className="relative mt-8 flex-1">
            <SiteNavigation />
          </div>

          <div className="relative rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(11,20,35,0.84),rgba(8,14,26,0.88))] p-5">
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3.5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Labs
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-white">4</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3.5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Playback
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-white">Shared</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3.5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Focus
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-white">Clarity</div>
              </div>
            </div>

            <Link
              href="/about"
              className="interactive-lift mt-5 inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-4 py-2 text-sm font-medium text-cyan-100 hover:border-cyan-300/35 hover:bg-cyan-300/[0.12]"
            >
              Review architecture
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="surface-sheen sticky top-4 z-20 rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,14,28,0.94),rgba(7,12,22,0.88))] px-4 py-4 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl xl:hidden">
            <div className="mb-4 flex items-center gap-3">
              <LogoMark />
              <div>
                <div className="font-display text-sm font-semibold uppercase tracking-[0.28em] text-slate-200">
                  Algo Visualizer
                </div>
                <div className="text-xs text-slate-400">Developer-grade algorithm labs</div>
              </div>
            </div>
            <SiteNavigation mobile />
          </header>

          <main id="main-content" className="flex-1 py-6 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
