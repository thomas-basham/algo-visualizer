# Algo Visualizer

An educational web app scaffold for visualizing algorithms and data structures with a feature-first architecture.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS

## Project Structure

```text
src/
  app/                      # App Router routes, layout, global styles
  components/               # Shared layout and UI primitives
  features/
    sorting/
      controls/             # Playback and dataset controls
      engine/               # Algorithm contracts, metadata, sample generators
      ui/                   # Feature composition components
      visualization/        # Visual rendering components
  lib/                      # Shared utilities
```

## Commands

```bash
npm install
npm run dev
```

