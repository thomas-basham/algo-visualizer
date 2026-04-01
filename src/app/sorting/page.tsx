import dynamic from "next/dynamic";
import type { Metadata } from "next";

import { PageHero } from "@/components/ui/page-hero";
import { ModuleLoadingCard } from "@/components/ui/module-loading-card";
import { createPageMetadata } from "@/lib/site";

const SortingVisualizer = dynamic(
  () => import("@/features/sorting/ui/sorting-visualizer").then((module) => module.SortingVisualizer),
  {
    loading: () => (
      <ModuleLoadingCard
        title="Loading Sorting Lab"
        description="Preparing comparison controls, timeline playback, and visualization panels."
      />
    ),
  },
);

export const metadata: Metadata = createPageMetadata({
  title: "Sorting Visualizer",
  description: "Synchronized sorting comparison lab with shared playback, metrics, and visualization layers.",
  path: "/sorting",
  keywords: ["bubble sort", "merge sort", "quick sort", "sorting comparison"],
});

export default function SortingPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Sorting Lab"
        badge="Comparison Mode"
        title="A side-by-side sorting visualizer with synchronized playback, educational guidance, and a performance path for larger arrays."
        description="Choose two algorithms, run them on the same preset input, and compare their emitted operations in real time. Each panel now explains the current step, highlights matching pseudocode, and keeps a beginner-friendly description alongside the visualization."
      />
      <SortingVisualizer />
    </div>
  );
}
