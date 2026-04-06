# Algo Visualizer

**Demo:** [https://main.d2ohi5jza0cs1j.amplifyapp.com](https://main.d2ohi5jza0cs1j.amplifyapp.com)

Algo Visualizer is a production-minded educational web app for exploring algorithms and data structures through synchronized, event-driven playback. Algorithm engines emit semantic events, reducers turn those events into UI state, and feature modules stay isolated so new labs can be added without rewriting the shell.

## Project Summary

The main technical idea is a shared event-driven playback architecture: algorithms emit semantic events, reducers derive frame state, and the UI stays focused on rendering metrics, explanations, pseudocode, and visual highlights. That design is what lets the same app support sorting comparisons, search walkthroughs, data structure operations, and graph traversal without collapsing into route-specific animation code.

## Features

- Sorting visualizer with side-by-side comparisons
- Searching visualizer for linear search and binary search
- Data structures lab for stack, queue, linked list, and binary search tree operations
- Graph traversal lab for breadth-first search and depth-first search
- Shared playback controls, metrics, pseudocode, and step explanations
- Dark, portfolio-grade UI with responsive desktop and tablet layouts
- SEO, Open Graph, sitemap, robots, manifest, and social preview routes for production deployment

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Vitest + React Testing Library + jsdom

## Getting Started

### Requirements

- Node.js 20 or newer
- npm 10 or newer

The repo includes [`.nvmrc`](.nvmrc) with the expected Node version.

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

### Validate

```bash
npm test
npm run lint
npm run build
```

## Production Configuration

Set the public site URL so canonical URLs and social metadata point at your deployed domain.

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

If the variable is not set, the app falls back to `https://algo-visualizer.vercel.app`.

## Architecture Overview

The app uses a feature-first structure so each lab owns its own engine, controls, visualization, and composed UI.

```text
src/
  app/                       App Router pages, metadata routes, global layout
  components/                Shared UI primitives, navigation, layout shell
  features/
    sorting/
    searching/
    data-structures/
    graphs/
  lib/
    animation/               Shared playback model and timeline helpers
    site.ts                  Shared site metadata helpers
  test/                      Shared test setup
  docs/                      Testing and supporting docs
```

### Event-driven execution model

- Algorithms emit semantic events such as `compare`, `swap`, `overwrite`, `markSorted`, `pivot`, and traversal-specific actions.
- Feature reducers consume those events and derive the visual state for the current frame.
- Shared playback hooks manage play, pause, step, reset, and synchronized time progression.
- UI components render current state only; they do not own algorithm logic.

This separation keeps the app easier to extend for additional sorts, graph algorithms, or future tree and pathfinding modules.

## Current Labs

### Sorting

- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort
- JavaScript native sort approximation
- Synchronized side-by-side comparison mode
- Educational presets: random, nearly sorted, reversed, and few unique values

### Searching

- Linear Search
- Binary Search

### Data Structures

- Stack
- Queue
- Linked List
- Binary Search Tree

### Graphs

- Breadth-First Search
- Depth-First Search

## Testing Strategy

The test suite is intentionally focused on correctness over snapshot volume.

- Unit tests cover algorithm engines and emitted event behavior.
- Metrics assertions verify comparisons, swaps, steps, and derived counters.
- Component tests cover controls and core UI rendering behavior.

See [docs/testing-strategy.md](docs/testing-strategy.md) for more detail.

## Performance Notes

- Heavy lab routes are dynamically imported to keep the initial route lighter.
- The sorting visualizer supports a performance mode for larger datasets.
- Shared playback logic uses explicit event timelines instead of direct React state mutation.
- Metadata, robots, sitemap, and social preview routes are generated in-app so deployment stays simple.

## Remaining Technical Debt

- Add Playwright coverage for the most important desktop and tablet interaction flows.
- Persist lab state in URL search params so comparisons and presets are shareable.
- Profile the heaviest visualizers and move more renderers to Canvas or SVG where the DOM becomes limiting.
- Expand graph support beyond traversal into weighted shortest-path algorithms.
- Run a final accessibility audit for contrast, focus order, and keyboard interaction after the UI stabilizes.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run test:watch
```
