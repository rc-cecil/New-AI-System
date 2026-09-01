import { expect, test } from "@playwright/test";

test("renders the command-centre foundation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  await expect(page.getByText("API Cost Today")).toBeVisible();
});

test("opens mobile navigation", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile navigation behavior");
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
});

test("navigates between workspace sections", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop navigation coverage");
  await page.goto("/dashboard");
  await page.getByRole("link", { name: "Workspaces" }).click();

  await expect(page).toHaveURL(/\/workspaces$/);
  await expect(page.getByRole("heading", { level: 1, name: "Workspaces" })).toBeVisible();
  await expect(page.getByText("No additional workspaces yet")).toBeVisible();
  await expect(page.getByRole("link", { name: "Workspaces" })).toHaveAttribute("aria-current", "page");
});

test("signs out and restores the mock session", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop session coverage");
  await page.goto("/dashboard");
  await page.locator('summary[aria-label="Open profile menu"]').click();
  await page.getByRole("button", { name: "Sign out of mock session" }).click();

  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole("heading", { level: 2, name: "Welcome back" })).toBeVisible();
  await page.getByRole("button", { name: /Continue to Acme Engineering/ }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
});
