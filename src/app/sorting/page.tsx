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
        title="A side-by-side sorting visualizer with synchronized playback and reusable event-driven architecture."
        description="Choose two algorithms, run them on the same starting array, and compare their emitted operations in real time. The controls, playback engine, renderer, and sorting logic stay separate so new algorithms can plug into the same model without UI rewrites."
      />
      <SortingVisualizer />
    </div>
  );
}
