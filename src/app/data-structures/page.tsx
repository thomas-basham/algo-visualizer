import dynamic from "next/dynamic";
import type { Metadata } from "next";

import { PageHero } from "@/components/ui/page-hero";
import { ModuleLoadingCard } from "@/components/ui/module-loading-card";
import { createPageMetadata } from "@/lib/site";

const DataStructuresVisualizer = dynamic(
  () =>
    import("@/features/data-structures/ui/data-structures-visualizer").then(
      (module) => module.DataStructuresVisualizer,
    ),
  {
    loading: () => (
      <ModuleLoadingCard
        title="Loading Data Structures Lab"
        description="Preparing structure operations, visual renderers, and playback guidance."
      />
    ),
  },
);

export const metadata: Metadata = createPageMetadata({
  title: "Data Structures Visualizer",
  description: "Interactive data-structure demos for stack, queue, linked list, and BST operations.",
  path: "/data-structures",
  keywords: ["stack visualizer", "queue visualizer", "linked list visualizer", "binary search tree visualizer"],
});

export default function DataStructuresPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Data Structures"
        badge="Operations"
        title="Run add, remove, and search operations on classic data structures."
        description="Work with stacks, queues, linked lists, and binary search trees one operation at a time."
      />

      <DataStructuresVisualizer />
    </div>
  );
}
