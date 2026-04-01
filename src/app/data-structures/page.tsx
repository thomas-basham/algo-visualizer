import type { Metadata } from "next";

import { PageHero } from "@/components/ui/page-hero";
import { DataStructuresVisualizer } from "@/features/data-structures/ui/data-structures-visualizer";

export const metadata: Metadata = {
  title: "Data Structures | Algo Visualizer",
  description: "Interactive data-structure demos for stack, queue, linked list, and BST operations.",
};

export default function DataStructuresPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Data Structures"
        badge="Interactive Lab"
        title="Watch stack, queue, linked-list, and tree operations play out one decision at a time."
        description="This section reuses the same event-driven playback model as the sorting and searching labs, but swaps in structure-specific renderers and operation guides. Add, remove, and search values while the app explains what the structure is doing and why."
      />

      <DataStructuresVisualizer />
    </div>
  );
}
