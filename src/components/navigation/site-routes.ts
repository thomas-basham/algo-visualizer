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
    description: "Overview",
  },
  {
    href: "/sorting",
    label: "Sorting Visualizer",
    description: "Compare sorting algorithms",
  },
  {
    href: "/searching",
    label: "Searching Visualizer",
    description: "Run Linear Search or Binary Search",
  },
  {
    href: "/data-structures",
    label: "Data Structures",
    description: "Operate on classic structures",
  },
  {
    href: "/graphs",
    label: "Graph Visualizer",
    description: "Traverse sample graphs",
  },
  {
    href: "/about",
    label: "About",
    description: "Project notes",
  },
];
