import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Space_Grotesk } from "next/font/google";

import { AppShell } from "@/components/layout/app-shell";
import "@/app/globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Algo Visualizer",
  description:
    "A polished educational web app scaffold for real-time data structure and algorithm visualization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${spaceGrotesk.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only absolute left-4 top-4 z-50 rounded-full border border-cyan-300/40 bg-slate-950/95 px-4 py-2 text-sm font-medium text-cyan-50 shadow-[0_18px_48px_rgba(2,6,23,0.55)] focus:not-sr-only focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
        >
          Skip to content
        </a>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
