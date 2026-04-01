import type { Metadata } from "next";

import { PageHero } from "@/components/ui/page-hero";
import { GraphVisualizer } from "@/features/graphs/ui/graph-visualizer";

export const metadata: Metadata = {
  title: "Graph Visualizer | Algo Visualizer",
  description: "Breadth-First Search and Depth-First Search visualizer with event-driven playback.",
};

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
