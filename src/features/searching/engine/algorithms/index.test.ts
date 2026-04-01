import { describe, expect, it } from "vitest";

import { buildSearchingTimeline } from "@/features/searching/engine/algorithms";

describe("searching engine timelines", () => {
  it("builds a Binary Search timeline that narrows candidates and computes comparisons correctly", () => {
    const values = [4, 9, 15, 20, 28, 34, 42];
    const timeline = buildSearchingTimeline("binary", values, 28);
    const finalFrame = timeline.frames.at(-1);
    const compareEvents = timeline.events.filter((event) => event.type === "compare");

    expect(finalFrame).toBeDefined();
    expect(compareEvents).toHaveLength(3);
    expect(timeline.events.at(-1)?.type).toBe("markFound");
    expect(finalFrame?.state.foundIndices).toEqual([4]);
    expect(finalFrame?.state.checkedIndices).toEqual([4]);
    expect(finalFrame?.state.activeRangeIndices).toEqual([4]);
    expect(finalFrame?.state.visitedIndices).toEqual([3, 4, 5]);
    expect(finalFrame?.state.metrics.comparisons).toBe(3);
    expect(finalFrame?.state.summary).toContain("Found 28");
  });
});
