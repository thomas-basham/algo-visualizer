import type { Metadata } from "next";

const defaultSiteUrl = "https://algo-visualizer.vercel.app";

export const siteConfig = {
  name: "Algo Visualizer",
  shortName: "AlgoViz",
  description:
    "A production-minded educational developer tool for visualizing algorithms and data structures with event-driven playback.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl,
  locale: "en_US",
  keywords: [
    "algorithm visualizer",
    "data structures visualizer",
    "sorting visualizer",
    "searching visualizer",
    "graph traversal visualizer",
    "next.js educational app",
    "developer tool",
  ],
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: PageMetadataOptions): Metadata {
  const canonicalUrl = absoluteUrl(path);
  const imageUrl = absoluteUrl("/opengraph-image");
  const resolvedTitle = `${title} | ${siteConfig.name}`;

  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: resolvedTitle,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${resolvedTitle} social preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [imageUrl],
    },
  };
}
