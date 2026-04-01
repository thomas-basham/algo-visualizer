import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SortingControls } from "@/features/sorting/controls/sorting-controls";
import {
  defaultSortingConfig,
  sortingAlgorithms,
  sortingInputPresets,
} from "@/features/sorting/engine/constants";

describe("SortingControls", () => {
  it("renders the key controls and forwards user interactions through callbacks", async () => {
    const user = userEvent.setup();
    const onAlgorithmChange = vi.fn();
    const onPerformanceModeChange = vi.fn();
    const onPlay = vi.fn();

    render(
      <SortingControls
        algorithms={sortingAlgorithms}
        presets={sortingInputPresets}
        config={defaultSortingConfig}
        isPending={false}
        status="ready"
        onAlgorithmChange={onAlgorithmChange}
        onPresetChange={vi.fn()}
        onSizeChange={vi.fn()}
        onSpeedChange={vi.fn()}
        onPerformanceModeChange={onPerformanceModeChange}
        onPlay={onPlay}
        onPauseResume={vi.fn()}
        onStepForward={vi.fn()}
        onReset={vi.fn()}
        onRandomize={vi.fn()}
        pauseResumeLabel="Pause"
        canStepForward
      />,
    );

    expect(screen.getByRole("button", { name: "Play" })).toBeEnabled();
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
    expect(screen.getByText("Shared Run State")).toBeInTheDocument();

    await user.selectOptions(screen.getByDisplayValue("Bubble Sort"), "merge");
    await user.click(screen.getByRole("switch"));
    await user.click(screen.getByRole("button", { name: "Play" }));

    expect(onAlgorithmChange).toHaveBeenCalledWith("left", "merge");
    expect(onPerformanceModeChange).toHaveBeenCalledWith(true);
    expect(onPlay).toHaveBeenCalledTimes(1);
  });
});
