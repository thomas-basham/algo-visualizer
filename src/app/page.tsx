import Link from "next/link";

import { PageHero } from "@/components/ui/page-hero";
import { StatusPill } from "@/components/ui/status-pill";
import { SurfaceCard } from "@/components/ui/surface-card";

const featureCards = [
  {
    title: "Sorting Lab",
    eyebrow: "Comparative analysis",
    description:
      "Real-time playback, dataset controls, and metric instrumentation for custom and native sorting implementations.",
    href: "/sorting",
    status: "Live",
    highlights: ["Side-by-side comparisons", "Educational copy", "Performance mode"],
  },
  {
    title: "Searching Lab",
    eyebrow: "Step-by-step traversal",
    description:
      "Linear Search and Binary Search walkthroughs with event-driven playback and learning panels.",
    href: "/searching",
    status: "Live",
    highlights: ["Target controls", "Pseudocode sync", "Frame metrics"],
  },
  {
    title: "Data Structures",
    eyebrow: "Interactive operations",
    description:
      "Interactive stack, queue, linked list, and binary search tree operations with shared playback.",
    href: "/data-structures",
    status: "Live",
    highlights: ["Add / remove / search", "Reusable primitives", "Operation guides"],
  },
  {
    title: "Graph Lab",
    eyebrow: "Traversal playback",
    description:
      "Breadth-First Search and Depth-First Search traversals with node, edge, and frontier playback.",
    href: "/graphs",
    status: "Live",
    highlights: ["Queue / stack state", "Node-edge highlighting", "Sample graph generation"],
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

const productStats = [
  {
    label: "Labs",
    value: "4",
    detail: "Sorting, searching, structures, and graphs",
  },
  {
    label: "Playback Model",
    value: "Shared",
    detail: "One event-driven animation architecture",
  },
  {
    label: "Theme",
    value: "Dark",
    detail: "Low-glare UI tuned for long sessions",
  },
];

const promiseCards = [
  {
    title: "Built for explanation",
    body: "Each lab favors legibility over gimmicks: explicit metrics, guided copy, and clean traversal states stay visible as the animation advances.",
  },
  {
    title: "Built to extend",
    body: "New modules plug into shared playback, route shell, and card primitives instead of rebuilding the same controls from scratch.",
  },
  {
    title: "Built to present",
    body: "The visual system is restrained and polished enough for portfolios, classroom demos, and deploy-ready educational tooling.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8 lg:space-y-10">
      <PageHero
        eyebrow="Interactive Computer Science"
        badge="Portfolio Product"
        title="A serious educational developer tool for understanding algorithms through live, event-driven playback."
        description="Algo Visualizer turns sorting, searching, graph traversal, and core data structures into inspectable labs. The interface is polished for presentation, but the architecture stays practical: playback, metrics, controls, and renderers are cleanly separated so the product can keep growing."
        actions={
          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[22rem] lg:grid-cols-1">
            <Link
              href="/sorting"
              className="interactive-lift inline-flex items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/14 px-5 py-3 text-sm font-medium text-cyan-100 hover:border-cyan-300/45 hover:bg-cyan-300/18"
            >
              Open sorting lab
            </Link>
            <Link
              href="/graphs"
              className="interactive-lift inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-medium text-slate-100 hover:border-white/20 hover:bg-white/[0.08]"
            >
              Explore graph lab
            </Link>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 text-left">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Product focus
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-200">
                Premium dark UI, accessible interactions, and reusable engine contracts instead of one-off demo code.
              </div>
            </div>
          </div>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard
          className="animate-enter"
          title="What the product is"
          description="A focused learning environment for developers who want algorithm intuition without sacrificing clarity or polish."
        >
          <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-4">
              <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
                  Product thesis
                </div>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200">
                  This project is positioned as an educational developer tool, not a toy. It is
                  designed to explain algorithm behavior with enough visual polish for a portfolio
                  and enough architectural discipline to support more labs over time.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {productStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="interactive-lift rounded-[24px] border border-white/8 bg-white/[0.03] p-4"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {stat.label}
                    </div>
                    <div className="mt-3 font-display text-3xl font-semibold tracking-tight text-white">
                      {stat.value}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-slate-400">{stat.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {promiseCards.map((card) => (
                <div
                  key={card.title}
                  className="interactive-lift rounded-[26px] border border-white/8 bg-white/[0.03] p-5"
                >
                  <div className="font-display text-lg font-semibold tracking-tight text-white">
                    {card.title}
                  </div>
                  <div className="mt-2 text-sm leading-7 text-slate-400">{card.body}</div>
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard
          className="animate-enter"
          title="Why it feels premium"
          description="The UI is tuned for legibility, projection, and repeated use during demos or study sessions."
        >
          <div className="space-y-4">
            <div className="interactive-lift rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
              <StatusPill label="Visual identity" tone="accent" />
              <div className="mt-3 text-sm leading-7 text-slate-300">
                A restrained dark palette, high-contrast typography, and measured accent color make the product feel intentional instead of overly playful.
              </div>
            </div>
            <div className="interactive-lift rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
              <StatusPill label="Accessibility" tone="success" />
              <div className="mt-3 text-sm leading-7 text-slate-300">
                Focus visibility, reduced-motion support, large interaction targets, and clear hierarchy keep the interface usable beyond screenshots.
              </div>
            </div>
            <div className="interactive-lift rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
              <StatusPill label="Deploy-ready" tone="warning" />
              <div className="mt-3 text-sm leading-7 text-slate-300">
                The same design language carries from the landing page into each lab, so the app feels like a product system rather than disconnected demos.
              </div>
            </div>
          </div>
        </SurfaceCard>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/75">
              Explore the Labs
            </div>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Each module teaches a different family of algorithm behavior.
            </h2>
          </div>
          <Link
            href="/about"
            className="interactive-lift inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-slate-100 hover:border-white/20 hover:bg-white/[0.08]"
          >
            Review architecture
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-4">
        {featureCards.map((card) => (
          <Link key={card.title} href={card.href} className="block h-full">
            <SurfaceCard
              className="interactive-lift h-full"
              title={card.title}
              description={card.description}
            >
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
                    {card.eyebrow}
                  </span>
                  <StatusPill label={card.status} tone="success" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {card.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className="inline-flex items-center rounded-full border border-cyan-300/18 bg-cyan-300/[0.08] px-4 py-2 text-sm font-medium text-cyan-100">
                  Open module
                </div>
              </div>
            </SurfaceCard>
          </Link>
        ))}
        </div>
      </section>

      <SurfaceCard
        title="Architecture principles"
        description="The visual polish sits on top of disciplined product structure, not in place of it."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {architectureCards.map((card) => (
            <div
              key={card.title}
              className="interactive-lift rounded-[26px] border border-white/8 bg-white/[0.03] p-5"
            >
              <div className="font-display text-lg font-semibold tracking-tight text-white">
                {card.title}
              </div>
              <div className="mt-2 text-sm leading-7 text-slate-400">{card.body}</div>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
