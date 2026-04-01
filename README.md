# Algo Visualizer

An educational web app scaffold for visualizing algorithms and data structures with a feature-first architecture.

**Demo:** [https://main.d2ohi5jza0cs1j.amplifyapp.com](https://main.d2ohi5jza0cs1j.amplifyapp.com)

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Vitest + React Testing Library

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
npm test
```

## Testing

The recommended testing stack for this app is:

- `Vitest` for unit and component tests
- `React Testing Library` with `user-event` for control and rendering tests
- `jsdom` for browser-like component execution
- `Playwright` later for end-to-end coverage if deployment flows need browser-level validation

Testing strategy details live in [docs/testing-strategy.md](docs/testing-strategy.md).
