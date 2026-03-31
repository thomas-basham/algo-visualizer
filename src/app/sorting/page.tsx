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
        badge="MVP Scaffold"
        title="A sorting route with clear seams between the engine, controls, and renderer."
        description="The current page is intentionally scaffolded rather than overbuilt. The next implementation step is replacing the preview snapshot generator with real instrumented traces for Bubble, Selection, Insertion, Merge, Quick, and native JavaScript sort."
      />
      <SortingVisualizer />
    </div>
  );
}

