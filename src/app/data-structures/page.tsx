import type { Metadata } from "next";

import { PageHero } from "@/components/ui/page-hero";
import { SurfaceCard } from "@/components/ui/surface-card";

export const metadata: Metadata = {
  title: "Data Structures | Algo Visualizer",
  description: "Placeholder route for stack, queue, list, tree, and graph modules.",
};

const structureCards = [
  {
    title: "Linear Structures",
    items: "Stack, queue, deque, linked list",
  },
  {
    title: "Hierarchical Structures",
    items: "Binary search tree, heap, AVL tree",
  },
  {
    title: "Graph Models",
    items: "Adjacency list, BFS, DFS, shortest path",
  },
];

export default function DataStructuresPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Data Structures"
        badge="Phase 2+"
        title="A reserved space for structure-focused demos that reuse the same shell patterns."
        description="Trees and graphs need different renderers than sorting, but they should not require a different app architecture. This route exists now so the information architecture and navigation stay stable."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {structureCards.map((card) => (
          <SurfaceCard key={card.title} title={card.title} description={card.items}>
            <div className="text-sm leading-6 text-slate-400">
              Attach feature folders with domain-specific snapshots, renderers, and controls as
              these modules come online.
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}

