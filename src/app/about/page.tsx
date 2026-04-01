import type { Metadata } from "next";

import { PageHero } from "@/components/ui/page-hero";
import { SurfaceCard } from "@/components/ui/surface-card";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description: "Architecture, deployment notes, and remaining technical debt for Algo Visualizer.",
  path: "/about",
  keywords: ["architecture overview", "technical debt", "deployment notes"],
});

const principles = [
  {
    title: "Feature-first organization",
    body: "Feature code lives with its own engine, controls, visualization, and composed UI so complexity stays local.",
  },
  {
    title: "Contracts over route state",
    body: "Pages should compose modules, not hold algorithm logic. Snapshot types are the handoff point between execution and rendering.",
  },
  {
    title: "Extensible visualizers",
    body: "Sorting uses DOM bars now, while graphs and trees can move to SVG later without rewriting the app shell.",
  },
];

const technicalDebt = [
  "Add Playwright end-to-end coverage for the critical interactive flows on desktop and tablet breakpoints.",
  "Persist route state in search params so algorithm, speed, preset, and sample selection are shareable.",
  "Profile the heaviest visualizers and selectively move more renderers toward Canvas or SVG where the DOM becomes limiting.",
  "Add weighted graph and shortest-path modules, then revisit graph metadata and rendering abstractions for more advanced use cases.",
  "Audit color contrast and keyboard flow across every control group after the final design system settles.",
];

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="About The Scaffold"
        badge="Architecture"
        title="The app shell is designed to outlive the first sorting demo."
        description="This scaffold aims for a maintainable product architecture rather than a fast one-page prototype. The important boundary is between execution contracts and rendering components, because that is what makes later labs practical."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <SurfaceCard
          title="Design Principles"
          description="Decisions that keep the codebase stable as the product grows."
        >
          <div className="space-y-4">
            {principles.map((principle) => (
              <div key={principle.title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <div className="text-base font-semibold text-white">{principle.title}</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">{principle.body}</div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard
          title="Technical Debt And Cleanup"
          description="Known follow-up work before the product can be considered fully mature."
        >
          <ol className="space-y-3 text-sm leading-6 text-slate-300">
            {technicalDebt.map((step, index) => (
              <li
                key={step}
                className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4"
              >
                <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-xs font-semibold text-cyan-100">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </SurfaceCard>
      </div>
    </div>
  );
}
