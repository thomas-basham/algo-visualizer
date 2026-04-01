import { describe, expect, it } from "vitest";

import { buildSortingTimeline } from "@/features/sorting/engine/algorithms";

function countEventsByType(
  eventTypes: string[],
  type: string,
) {
  return eventTypes.filter((eventType) => eventType === type).length;
}

describe("sorting engine timelines", () => {
  it("builds a correct Bubble Sort timeline with matching comparison and swap metrics", () => {
    const values = [5, 1, 4, 2, 8];
    const timeline = buildSortingTimeline("bubble", values);
    const eventTypes = timeline.events.map((event) => event.type);
    const finalFrame = timeline.frames.at(-1);

    expect(finalFrame).toBeDefined();
    expect(finalFrame?.state.values).toEqual([1, 2, 4, 5, 8]);
    expect(eventTypes.slice(0, 2)).toEqual(["compare", "swap"]);
    expect(eventTypes.at(-1)).toBe("markSorted");
    expect(finalFrame?.state.metrics.comparisons).toBe(countEventsByType(eventTypes, "compare"));
    expect(finalFrame?.state.metrics.swaps).toBe(countEventsByType(eventTypes, "swap"));
    expect(finalFrame?.state.sortedIndices).toEqual([0, 1, 2, 3, 4]);
  });

  it("builds a Merge Sort timeline that emits merge and overwrite events with correct overwrite metrics", () => {
    const values = [7, 2, 6, 3, 9, 1];
    const timeline = buildSortingTimeline("merge", values);
    const eventTypes = timeline.events.map((event) => event.type);
    const mergeIndex = eventTypes.indexOf("merge");
    const overwriteIndex = eventTypes.indexOf("overwrite");
    const finalFrame = timeline.frames.at(-1);

    expect(finalFrame).toBeDefined();
    expect(finalFrame?.state.values).toEqual([1, 2, 3, 6, 7, 9]);
    expect(mergeIndex).toBeGreaterThanOrEqual(0);
    expect(overwriteIndex).toBeGreaterThan(mergeIndex);
    expect(countEventsByType(eventTypes, "merge")).toBeGreaterThan(0);
    expect(countEventsByType(eventTypes, "overwrite")).toBeGreaterThan(0);
    expect(finalFrame?.state.metrics.comparisons).toBe(countEventsByType(eventTypes, "compare"));
    expect(finalFrame?.state.metrics.overwrites).toBe(countEventsByType(eventTypes, "overwrite"));
    expect(finalFrame?.state.sortedIndices).toEqual([0, 1, 2, 3, 4, 5]);
  });
});
