import Link from "next/link";
import type { Metadata, Route } from "next";

import { PageHero } from "@/components/ui/page-hero";
import { StatusPill } from "@/components/ui/status-pill";
import { SurfaceCard } from "@/components/ui/surface-card";
import { createPageMetadata } from "@/lib/site";

type FeatureCard = {
  title: string;
  eyebrow: string;
  description: string;
  href: Route;
  status: string;
  highlights: string[];
};

export const metadata: Metadata = createPageMetadata({
  title: "Interactive Algorithm Visualizer",
  description:
    "Compare algorithms and explore data structures through step-by-step playback.",
  path: "/",
  keywords: ["algorithm education", "interactive visualization", "computer science learning"],
});

const featureCards: FeatureCard[] = [
  {
    title: "Sorting Lab",
    eyebrow: "Comparative analysis",
    description:
      "Real-time playback, dataset controls, and metric instrumentation for custom and native sorting implementations.",
    href: "/sorting",
    status: "Live",
    highlights: ["Side-by-side comparisons", "Step explanations", "Performance mode"],
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

const productStats = [
  {
    label: "Labs",
    value: "4",
    detail: "Sorting, searching, structures, and graphs",
  },
  {
    label: "Controls",
    value: "Shared",
    detail: "Play, pause, step, and reset",
  },
  {
    label: "Metrics",
    value: "Live",
    detail: "Comparisons, steps, and elapsed time",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8 lg:space-y-10">
      <PageHero
        eyebrow="Algorithm Labs"
        badge="Live"
        title="Compare algorithms and trace data structures step by step."
        description="Run sorting, searching, graph traversal, and data structure demos with live metrics, pseudocode, and playback controls."
        actions={
          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[20rem] lg:grid-cols-1">
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
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        {productStats.map((stat) => (
          <SurfaceCard
            key={stat.label}
            className="interactive-lift"
            title={stat.label}
            description={stat.detail}
          >
            <div className="font-display text-3xl font-semibold tracking-tight text-white">
              {stat.value}
            </div>
          </SurfaceCard>
        ))}
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
            About project
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-4">
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
    </div>
  );
}
