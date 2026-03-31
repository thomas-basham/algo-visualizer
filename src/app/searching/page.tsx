import type { Metadata } from "next";

import { PageHero } from "@/components/ui/page-hero";
import { SurfaceCard } from "@/components/ui/surface-card";

export const metadata: Metadata = {
  title: "Searching Visualizer | Algo Visualizer",
  description: "Placeholder route for search algorithm walkthroughs.",
};

const searchModules = [
  {
    title: "Linear Search",
    body: "Ideal starter module for step-by-step comparisons, probes, and access counts.",
  },
  {
    title: "Binary Search",
    body: "Adds sorted-array constraints, midpoint math, and interval highlighting.",
  },
  {
    title: "Future Extensions",
    body: "Interpolation search, jump search, and tree/path search can attach to the same playback shell.",
  },
];

export default function SearchingPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Searching Lab"
        badge="Placeholder Route"
        title="Prepared for search walkthroughs without coupling it to the sorting module."
        description="This route reserves the structure for future search visualizers. Keep the same product shell, but define search-specific snapshot contracts, metrics, and renderers inside a dedicated feature folder."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {searchModules.map((module) => (
          <SurfaceCard key={module.title} title={module.title} description={module.body}>
            <div className="text-sm leading-6 text-slate-400">
              Route scaffold is ready. Add search engine contracts, timeline state, and domain
              controls here.
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}

