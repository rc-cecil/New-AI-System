import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FoundationDashboard, ProgressBar, StatusBadge } from "@/components/dashboard/foundation-dashboard";

describe("dashboard primitives", () => {
  it("announces progress and presents semantic status text", () => {
    render(<><ProgressBar value={65} label="Authentication progress" /><StatusBadge label="In Progress" tone="blue" /></>);
    expect(screen.getByLabelText("Authentication progress")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeVisible();
  });

  it("renders the operational dashboard sections", () => {
    render(<FoundationDashboard />);
    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Active Tasks" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Pending Approvals" })).toBeVisible();
    expect(screen.getByText("API Cost Today")).toBeVisible();
  });
});
