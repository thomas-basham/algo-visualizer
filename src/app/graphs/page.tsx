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
        badge="Working Version"
        title="Trace BFS and DFS across a live graph with visible frontier state and traversal order."
        description="This module reuses the shared playback architecture, but switches to a graph renderer so nodes, edges, queue/stack state, and traversal explanations stay synchronized. Generate a sample graph, pick a start node, and watch the traversal expand one event at a time."
      />
      <GraphVisualizer />
    </div>
  );
}
