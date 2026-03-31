import type { Metadata } from "next";

import { PageHero } from "@/components/ui/page-hero";
import { SortingVisualizer } from "@/features/sorting/ui/sorting-visualizer";

export const metadata: Metadata = {
  title: "Sorting Visualizer | Algo Visualizer",
  description: "Sorting lab scaffold with controls, metrics, and visualization layers.",
};

export default function SortingPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Sorting Lab"
        badge="Working Version"
        title="A live sorting visualizer with real-time frame playback and clear engine boundaries."
        description="Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, and a native Array.sort approximation now run through the same event-driven playback model. Controls, renderer, and algorithm logic stay separate so future visualizers can reuse the same animation architecture."
      />
      <SortingVisualizer />
    </div>
  );
}
