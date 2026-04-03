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
        badge="Step-by-step"
        title="Search for a target value step by step."
        description="Switch between Linear Search and Binary Search, choose the target, and follow each comparison with metrics and pseudocode."
      />
      <SearchingVisualizer />
    </div>
  );
}
