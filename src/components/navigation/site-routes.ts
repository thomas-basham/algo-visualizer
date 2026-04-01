import type { Route } from "next";

export type SiteRoute = {
  href: Route;
  label: string;
  description: string;
};

export const siteRoutes: SiteRoute[] = [
  {
    href: "/",
    label: "Home",
    description: "Overview and product entry point",
  },
  {
    href: "/sorting",
    label: "Sorting Visualizer",
    description: "Playback, metrics, and extensible sorting scaffolds",
  },
  {
    href: "/searching",
    label: "Searching Visualizer",
    description: "Linear and binary search playback with guided explanations",
  },
  {
    href: "/data-structures",
    label: "Data Structures",
    description: "Interactive stacks, queues, linked lists, and tree operations",
  },
  {
    href: "/graphs",
    label: "Graph Visualizer",
    description: "Breadth-first and depth-first traversal with live frontier state",
  },
  {
    href: "/about",
    label: "About",
    description: "Architecture, intent, and expansion plan",
  },
];
