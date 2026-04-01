import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

const routes = [
  "/",
  "/sorting",
  "/searching",
  "/data-structures",
  "/graphs",
  "/about",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(route),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
    lastModified: new Date(),
  }));
}
