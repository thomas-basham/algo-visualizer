import dynamic from "next/dynamic";
import type { Metadata } from "next";

import { PageHero } from "@/components/ui/page-hero";
import { ModuleLoadingCard } from "@/components/ui/module-loading-card";
import { createPageMetadata } from "@/lib/site";

const SearchingVisualizer = dynamic(
  () => import("@/features/searching/ui/searching-visualizer").then((module) => module.SearchingVisualizer),
  {
    loading: () => (
      <ModuleLoadingCard
        title="Loading Searching Lab"
        description="Preparing search controls, event playback, and metrics panels."
      />
    ),
  },
);

export const metadata: Metadata = createPageMetadata({
  title: "Searching Visualizer",
  description: "Linear and Binary Search visualizer with event-driven playback and learning panels.",
  path: "/searching",
  keywords: ["linear search", "binary search", "search visualization"],
});

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
