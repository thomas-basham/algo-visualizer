import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { searchAlgorithms } from "@/features/searching/engine/constants";
import { SearchingMetricsPanel } from "@/features/searching/ui/searching-metrics-panel";

describe("SearchingMetricsPanel", () => {
  it("renders metric values and algorithm complexity details", () => {
    render(
      <SearchingMetricsPanel
        metrics={{
          steps: 4,
          comparisons: 3,
          elapsedMs: 240,
        }}
        algorithm={searchAlgorithms[1]}
        status="completed"
      />,
    );

    expect(screen.getByText("Steps")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("Comparisons")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("240 ms")).toBeInTheDocument();
    expect(screen.getAllByText("O(log n)")).toHaveLength(2);
    expect(screen.getByText(/Binary Search requires the array to stay sorted/i)).toBeInTheDocument();
  });
});
