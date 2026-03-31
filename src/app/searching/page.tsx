import type { Metadata } from "next";

import { PageHero } from "@/components/ui/page-hero";
import { SearchingVisualizer } from "@/features/searching/ui/searching-visualizer";

export const metadata: Metadata = {
  title: "Searching Visualizer | Algo Visualizer",
  description: "Linear and Binary Search visualizer with event-driven playback and learning panels.",
};

export default function SearchingPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Searching Lab"
        badge="Working Version"
        title="A search visualizer with event-driven playback, target selection, and guided algorithm explanations."
        description="Linear Search and Binary Search now run through the same playback architecture as the sorting lab. Each step highlights the checked value, updates metrics, and keeps algorithm info plus pseudocode aligned with the active frame."
      />
      <SearchingVisualizer />
    </div>
  );
}
