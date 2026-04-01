# Portfolio Kit

This document turns the shipped product into reusable portfolio language. Every section below is grounded in the current codebase: the shared event model in `src/lib/animation`, the feature-first lab modules in `src/features`, the responsive app shell in `src/components/layout`, and the production deployment setup in `src/app` and `src/lib/site.ts`.

## Portfolio Project Description

### Long version

Algo Visualizer is a production-minded educational developer tool that turns core computer science concepts into interactive, event-driven labs. I built it as a multi-module Next.js application with a shared playback engine so sorting, searching, data structures, and graph traversal can all reuse the same animation architecture instead of duplicating logic in the UI layer.

The product includes synchronized side-by-side sorting comparisons, search walkthroughs, interactive data structure operations, and graph traversal visualizations for BFS and DFS. Each algorithm emits semantic events such as `compare`, `swap`, `overwrite`, `pivot`, and `visit`; reducers turn those events into frame state; and the UI renders metrics, pseudocode, step explanations, and visual highlights in real time. The result is an educational interface that feels polished enough for production while staying extensible enough to support more labs later.

### Short version

Built a production-ready algorithm visualization platform in Next.js with a shared event-driven playback engine powering sorting, searching, graph traversal, and data structure labs.

## Resume Bullet Points

- Built a production-ready educational web app in Next.js, React, and TypeScript that visualizes sorting, searching, data structures, and graph traversal through a shared event-driven playback architecture.
- Designed a reusable animation system where algorithms emit semantic events and reducers derive visualization state, enabling the same playback model to support bars, arrays, trees, and graphs.
- Implemented side-by-side sorting comparisons with synchronized timing, live metrics, pseudocode highlighting, preset datasets, and a performance mode for larger arrays.
- Added feature-first lab modules for Linear Search, Binary Search, Stack, Queue, Linked List, Binary Search Tree, BFS, and DFS while keeping engine logic separate from React components.
- Hardened the app for deployment with typed routes, route-level lazy loading, SEO and Open Graph metadata, sitemap and robots generation, responsive dark-theme UI, and representative Vitest coverage for algorithm correctness.

## GitHub README Copy

### Repo opener

Algo Visualizer is a production-minded educational developer tool for learning algorithms through interactive playback. Instead of hard-coding animation logic into React components, the app uses a shared event-driven architecture: algorithms emit semantic steps, reducers build frame state, and reusable visualizers render the result across sorting, searching, graph traversal, and data structure labs.

### Why it stands out

- Shared playback engine across multiple algorithm domains
- Side-by-side algorithm comparison with synchronized timing
- Educational UX: live metrics, pseudocode sync, and plain-English step explanations
- Feature-first architecture designed for adding more labs without rewriting the shell
- Production deployment setup with responsive UI, SEO metadata, Open Graph previews, and test coverage

### Suggested “Built With” line

Next.js 15, React 19, TypeScript, Tailwind CSS 4, Vitest, React Testing Library, and a custom event-driven visualization engine.

## Feature Highlights

- Sorting lab with Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, and an educational approximation of native JavaScript sort.
- Side-by-side sorting comparison panels that run against identical starting arrays and stay synchronized under one playback clock.
- Educational dataset presets for random, nearly sorted, reversed, and few-unique-value inputs.
- Search lab with Linear Search and Binary Search, including target selection, range highlighting, and comparison metrics.
- Data structures lab for Stack, Queue, Linked List, and Binary Search Tree operations with animated add, remove, and search flows.
- Graph lab for Breadth-First Search and Depth-First Search with node and edge highlighting plus visible queue or stack state.
- Shared educational surfaces across labs: algorithm info, complexity summaries, pseudocode panels, and live step explanations.
- Performance-minded route loading and a dedicated sorting performance mode for larger arrays.

## Technical Architecture Summary

Algo Visualizer is organized as a feature-first Next.js App Router application. Each lab owns its own engine, controls, visualization components, and composed UI while sharing a common playback layer. The core abstraction is a semantic event timeline: algorithms emit events such as `compare`, `swap`, `overwrite`, `markSorted`, `pivot`, `merge`, and `visit`; reducers consume those events to derive current visual state; and React components render the active frame without containing algorithm logic.

The playback system supports play, pause, step-forward, reset, elapsed timing, and synchronized multi-run comparisons. This makes it practical to compare two sorting algorithms under a single clock while still supporting different final frame counts. On top of that engine, each feature module adds domain-specific state and educational UI such as metrics, pseudocode highlighting, operation descriptions, and beginner explanations.

At the product layer, the app uses a polished dark theme, responsive shell, typed routes, route-level lazy loading, and production metadata including sitemap, robots, manifest, and Open Graph image generation. Testing focuses on correctness where it matters most: algorithm engines, emitted event behavior, metric derivation, and core control interactions.

## Interview Elevator Pitch

I built a production-ready algorithm visualization platform in Next.js that goes beyond a simple sorting demo. The key architectural decision was to separate algorithm execution from presentation: each algorithm emits semantic events, a shared playback layer turns those into frames, and the UI just renders the current state. That let me reuse the same system across sorting comparisons, binary search, graph traversal, and interactive data structures while keeping the codebase easy to extend and reason about.

## Interview Talking Points

- Why event timelines are a better long-term abstraction than directly mutating React state during animations
- How synchronized playback works when two algorithms have different run lengths
- Why native JavaScript sort had to be modeled as an educational approximation rather than a true internal trace
- How feature-first organization kept sorting, searching, graphs, and data structures isolated but consistent
- Where performance work mattered most: lazy-loaded heavy routes, a sorting performance mode, and minimizing UI-driven animation logic
- What production hardening included beyond the visuals: typed routes, SEO metadata, social previews, responsive layout, and testing

## One-Line Interview Answer

It is an event-driven algorithm visualization platform: the hard part was designing one playback architecture that could explain sorting, searching, data structures, and graph traversal without coupling the engines to the UI.
