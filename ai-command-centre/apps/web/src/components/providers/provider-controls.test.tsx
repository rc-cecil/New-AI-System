import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ProviderControls } from "./provider-controls";

describe("ProviderControls", () => {
  it("keeps model options aligned with the selected provider", () => {
    render(<ProviderControls />);
    expect(screen.getByLabelText("Model")).toHaveValue("gpt-4o");

    fireEvent.change(screen.getByLabelText("Provider"), { target: { value: "anthropic" } });
    expect(screen.getByLabelText("Model")).toHaveValue("sonnet");
    expect(screen.getByText("Rate limited")).toBeVisible();
    expect(screen.getByText(/Automatic routing may choose another/)).toBeVisible();
  });

  it("shows explicit loading and unavailable states", async () => {
    vi.useFakeTimers();
    render(<ProviderControls />);

    fireEvent.change(screen.getByLabelText("Provider"), { target: { value: "gemini" } });
    expect(screen.getByText("Refreshing model catalog")).toBeVisible();

    fireEvent.change(screen.getByLabelText("Provider"), { target: { value: "ollama" } });
    expect(screen.getByLabelText("Model")).toBeDisabled();
    expect(screen.getByText("Local provider is unreachable")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(screen.getByRole("button", { name: "Checking" })).toBeDisabled();
    await act(async () => { await vi.advanceTimersByTimeAsync(650); });
    expect(screen.getByRole("button", { name: "Retry" })).toBeEnabled();
    vi.useRealTimers();
  });
});
