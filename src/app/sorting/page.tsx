import type { Metadata } from "next";

import { PageHero } from "@/components/ui/page-hero";
import { SortingVisualizer } from "@/features/sorting/ui/sorting-visualizer";

export const metadata: Metadata = {
  title: "Sorting Visualizer | Algo Visualizer",
  description: "Synchronized sorting comparison lab with shared playback, metrics, and visualization layers.",
};

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
