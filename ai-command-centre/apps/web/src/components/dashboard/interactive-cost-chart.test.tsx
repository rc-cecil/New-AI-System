import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InteractiveCostChart } from "./interactive-cost-chart";

describe("InteractiveCostChart", () => {
  it("reveals exact values for hovered and focused bars", () => {
    render(<InteractiveCostChart />);
    const morning = screen.getByRole("button", { name: "6 AM: $1.42" });
    fireEvent.mouseEnter(morning);
    expect(screen.getByRole("status")).toHaveTextContent("6 AM$1.42");
    fireEvent.focus(screen.getByRole("button", { name: "8 PM: $2.58" }));
    expect(screen.getByRole("status")).toHaveTextContent("8 PM$2.58");
  });
});
