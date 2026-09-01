import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandMark } from "@/components/brand-mark";

describe("BrandMark", () => {
  it("exposes the product name", () => {
    render(<BrandMark />);
    expect(screen.getByLabelText("AI Command Centre")).toBeInTheDocument();
    expect(screen.getByText("AI Command Centre")).toBeVisible();
  });
});
