export type SiteRoute = {
  href: string;
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
    description: "Placeholder route for search walkthroughs",
  },
  {
    href: "/data-structures",
    label: "Data Structures",
    description: "Placeholder route for stacks, queues, trees, and more",
  },
  {
    href: "/about",
    label: "About",
    description: "Architecture, intent, and expansion plan",
  },
];

