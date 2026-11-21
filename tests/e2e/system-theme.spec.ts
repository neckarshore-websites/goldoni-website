import { test, expect } from "@playwright/test";

/**
 * The theme follows the device setting (prefers-color-scheme) until the
 * visitor uses the toggle; the toggle's choice then wins. Privacy half:
 * without a choice nothing is written to localStorage.
 */
const html = (page: import("@playwright/test").Page) => page.locator("html");
const storedTheme = (page: import("@playwright/test").Page) =>
  page.evaluate(() => localStorage.getItem("theme"));

for (const scheme of ["light", "dark"] as const) {
  test(`device ${scheme}, no choice -> ${scheme}, nothing stored`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    await expect(html(page)).toHaveAttribute("data-theme", scheme);
    expect(await storedTheme(page)).toBeNull();
  });
}

test("stored choice beats the device setting", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  await page.goto("/");
  await expect(html(page)).toHaveAttribute("data-theme", "light");
});

test("device switch while open is followed when there is no choice", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(html(page)).toHaveAttribute("data-theme", "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(html(page)).toHaveAttribute("data-theme", "dark");
});

test("toggle stores the choice and the device switch no longer overrides it", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(html(page)).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: /Theme wechseln/ }).first().click();
  await expect(html(page)).toHaveAttribute("data-theme", "light");
  expect(await storedTheme(page)).toBe("light");
  await page.emulateMedia({ colorScheme: "light" });
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(html(page)).toHaveAttribute("data-theme", "light");
});
