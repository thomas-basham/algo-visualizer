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
        badge="Compare"
        title="Compare two sorting algorithms on the same array."
        description="Choose the algorithms, input preset, size, and speed. Run, pause, step, and reset while metrics and pseudocode stay in sync."
      />
      <SortingVisualizer />
    </div>
  );
}
