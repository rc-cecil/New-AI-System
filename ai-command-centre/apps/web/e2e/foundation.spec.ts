import { expect, test } from "@playwright/test";

test("renders the command-centre foundation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Command centre foundation" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  await expect(page.getByText("Next.js workspace")).toBeVisible();
});

test("opens mobile navigation", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile navigation behavior");
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
});
