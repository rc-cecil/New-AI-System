import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RepositoriesPage } from "./repositories-page";

describe("RepositoriesPage", () => {
  it("filters repositories that need attention and supports an empty search", () => {
    render(<RepositoriesPage />);

    fireEvent.click(screen.getByRole("button", { name: "Needs attention" }));
    expect(screen.getByRole("button", { name: "View acme/infrastructure" })).toBeVisible();
    expect(screen.getByRole("button", { name: "View acme/analytics-service" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "View acme/web-app" })).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Search repositories"), { target: { value: "missing" } });
    expect(screen.getByRole("heading", { name: "No repositories match" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByRole("button", { name: "View acme/web-app" })).toBeVisible();
  });

  it("changes the selected repository and confirms a sync before reporting success", async () => {
    vi.useFakeTimers();
    render(<RepositoriesPage />);

    fireEvent.click(screen.getByRole("button", { name: "View acme/infrastructure" }));
    expect(screen.getByRole("heading", { name: "acme/infrastructure" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Sync repository" }));
    expect(screen.getByRole("button", { name: "Synchronizing" })).toBeDisabled();

    await act(async () => { await vi.advanceTimersByTimeAsync(900); });
    expect(screen.getByRole("button", { name: "Sync repository" })).toBeEnabled();
    expect(screen.getByText("just now")).toBeVisible();
    vi.useRealTimers();
  });
});
