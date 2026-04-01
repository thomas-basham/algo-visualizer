# Testing Strategy

This project uses a focused testing stack for a Next.js + TypeScript application:

- `Vitest` for fast unit and component test execution
- `React Testing Library` for rendering components through accessible UI queries
- `@testing-library/user-event` for realistic control interactions
- `@testing-library/jest-dom` for readable DOM assertions
- `jsdom` as the browser-like environment for component tests

## Why this stack

- It is lighter and faster than a Jest-first setup for this app.
- It fits the project architecture well because most correctness lives in pure algorithm engines and timeline reducers.
- It keeps component tests close to how users interact with the controls instead of testing implementation details.

For end-to-end coverage later, `Playwright` is the next layer to add. It is not required for the current representative test suite.

## Test Layers

### 1. Engine unit tests

Primary target:

- Algorithm timeline builders
- Reducers
- Metric derivation from emitted events

Guidelines:

- Assert final state correctness first
- Assert a few semantic event milestones, not every frame
- Prefer stable properties such as event types, sorted output, found indices, and metric totals

### 2. Event-sequence tests

Use these when the sequence itself is part of the product behavior:

- Merge Sort should emit merge and overwrite events
- Binary Search should shrink the active range through compare events before marking found

Avoid brittle full-timeline snapshots. Check only the specific sequence guarantees the UI depends on.

### 3. Component tests

Primary target:

- Control surfaces
- Basic metrics rendering
- Accessible interactions

Guidelines:

- Query by role, name, or current display value
- Verify callbacks are fired with the expected payloads
- Avoid class-name assertions unless the class is the behavior

## Current Scope

Representative tests currently cover:

- Bubble Sort engine behavior
- Merge Sort engine behavior and merge/overwrite event emission
- Binary Search engine behavior and comparison metrics
- Sorting controls interaction wiring
- Metrics panel rendering

## Commands

```bash
npm test
npm run test:watch
```
