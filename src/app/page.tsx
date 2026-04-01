import Link from "next/link";

import { PageHero } from "@/components/ui/page-hero";
import { StatusPill } from "@/components/ui/status-pill";
import { SurfaceCard } from "@/components/ui/surface-card";

const featureCards = [
  {
    title: "Sorting Lab",
    description:
      "Real-time playback, dataset controls, and metric instrumentation for custom and native sorting implementations.",
    href: "/sorting",
  },
  {
    title: "Searching Lab",
    description:
      "Linear Search and Binary Search walkthroughs with event-driven playback and learning panels.",
    href: "/searching",
  },
  {
    title: "Data Structures",
    description:
      "Interactive stack, queue, linked list, and binary search tree operations with shared playback.",
    href: "/data-structures",
  },
  {
    title: "Graph Lab",
    description:
      "Breadth-First Search and Depth-First Search traversals with node, edge, and frontier playback.",
    href: "/graphs",
  },
];

const architectureCards = [
  {
    title: "Engine contracts",
    body: "Algorithm metadata, snapshot schemas, and future trace emitters live outside the route layer.",
  },
  {
    title: "Composable controls",
    body: "Playback controls are isolated so every lab can reuse the same UX primitives without sharing implementation details.",
  },
  {
    title: "Visualization adapters",
    body: "Bars, arrays, graphs, and tree layouts all consume playback snapshots rather than route state.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Interactive Computer Science"
        badge="Next.js App Router"
        title="See algorithms operate one step at a time, with the UI and engine built to scale."
        description="This scaffold is designed for a polished educational product rather than a one-off demo. It separates controls, visualization, and execution contracts so you can add more labs without rewriting the shell."
        actions={
          <>
            <Link
              href="/sorting"
              className="inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-300/12 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/18"
            >
              Open sorting lab
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08]"
            >
              Review architecture
            </Link>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SurfaceCard
          title="What ships in this scaffold"
          description="A production-minded foundation for algorithm education."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Routes</div>
              <div className="mt-3 text-3xl font-semibold tracking-tight text-white">6</div>
              <div className="mt-2 text-sm leading-6 text-slate-400">
                Home, Sorting, Searching, Data Structures, Graphs, and About are scaffolded with App Router.
              </div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Layers</div>
              <div className="mt-3 text-3xl font-semibold tracking-tight text-white">3</div>
              <div className="mt-2 text-sm leading-6 text-slate-400">
                UI shell, feature composition, and engine contracts are split cleanly.
              </div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Theme</div>
              <div className="mt-3 text-3xl font-semibold tracking-tight text-white">Dark</div>
              <div className="mt-2 text-sm leading-6 text-slate-400">
                Gradient-backed, low-glare interface tuned for dashboards and classroom projection.
              </div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard
          title="Build direction"
          description="Suggested next implementation milestones after the scaffold."
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <StatusPill label="Phase 1" tone="accent" />
              <div className="mt-3 text-sm leading-6 text-slate-300">
                Replace the preview snapshot generator with an instrumented sorting trace engine.
              </div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <StatusPill label="Phase 2" tone="success" />
              <div className="mt-3 text-sm leading-6 text-slate-300">
                Add side-by-side comparisons, benchmark mode, and pseudocode highlighting.
              </div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <StatusPill label="Phase 3" tone="warning" />
              <div className="mt-3 text-sm leading-6 text-slate-300">
                Extend the graph and structure labs with weighted graphs, shortest paths, and balanced trees.
              </div>
            </div>
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        {featureCards.map((card) => (
          <SurfaceCard key={card.title} title={card.title} description={card.description}>
            <Link
              href={card.href}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-300/25 hover:bg-white/[0.08]"
            >
              Explore module
            </Link>
          </SurfaceCard>
        ))}
      </div>

      <SurfaceCard
        title="Architecture principles"
        description="The core product decision is keeping feature code layered and extensible."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {architectureCards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <div className="text-base font-semibold text-white">{card.title}</div>
              <div className="mt-2 text-sm leading-6 text-slate-400">{card.body}</div>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
