import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { IntegrationsPage } from "./integrations-page";

describe("IntegrationsPage", () => {
  it("keeps credentials masked and confirms connection state", async () => {
    vi.useFakeTimers();
    render(<IntegrationsPage />);
    const input = screen.getByLabelText("API token or connection secret");
    expect(input).toHaveAttribute("type", "password");
    fireEvent.change(input, { target: { value: "not-a-real-secret" } });
    fireEvent.click(screen.getByRole("button", { name: "Test & connect" }));
    expect(screen.getByRole("button", { name: "Testing connection" })).toBeDisabled();
    await act(async () => { await vi.advanceTimersByTimeAsync(700); });
    expect(screen.getAllByText("connected").length).toBeGreaterThan(0);
    vi.useRealTimers();
  });

  it("switches provider configuration without exposing a stored value", () => {
    render(<IntegrationsPage />);
    fireEvent.click(screen.getByRole("button", { name: /OpenAI Workspace credential/ }));
    expect(screen.getByRole("heading", { name: "Configure OpenAI" })).toBeVisible();
    expect(screen.getByLabelText("API token or connection secret")).toHaveValue("");
  });
});
