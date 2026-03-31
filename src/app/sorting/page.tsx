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
        title="A side-by-side sorting visualizer with synchronized playback, reusable event-driven architecture, and a performance path for larger arrays."
        description="Choose two algorithms, run them on the same starting array, and compare their emitted operations in real time. Standard mode keeps the decorated DOM bars, while performance mode switches to a lighter Canvas renderer so larger datasets stay smooth without changing the sorting engine."
      />
      <SortingVisualizer />
    </div>
  );
}
