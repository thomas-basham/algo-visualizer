import dynamic from "next/dynamic";
import type { Metadata } from "next";

import { PageHero } from "@/components/ui/page-hero";
import { ModuleLoadingCard } from "@/components/ui/module-loading-card";
import { createPageMetadata } from "@/lib/site";

const GraphVisualizer = dynamic(
  () => import("@/features/graphs/ui/graph-visualizer").then((module) => module.GraphVisualizer),
  {
    loading: () => (
      <ModuleLoadingCard
        title="Loading Graph Lab"
        description="Preparing traversal controls, graph rendering, and queue or stack playback."
      />
    ),
  },
);

export const metadata: Metadata = createPageMetadata({
  title: "Graph Visualizer",
  description: "Breadth-First Search and Depth-First Search visualizer with event-driven playback.",
  path: "/graphs",
  keywords: ["breadth-first search", "depth-first search", "graph traversal visualizer"],
});

export default function GraphsPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Graph Lab"
        badge="Traversal"
        title="Traverse sample graphs with BFS or DFS."
        description="Pick a graph and start node, then follow visited nodes, active edges, and queue or stack state."
      />
      <GraphVisualizer />
    </div>
  );
}
