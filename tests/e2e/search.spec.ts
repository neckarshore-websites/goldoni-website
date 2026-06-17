import { test, expect, type Page } from "@playwright/test";

const dialog = (page: Page) => page.getByRole("dialog", { name: "Suche" });
const combo = (page: Page) => page.getByRole("combobox", { name: /durchsuchen/i });

// The Cmd/Ctrl+K listener attaches on client hydration. In dev the first page
// load is cold-compiled, so retry the keypress until the overlay opens — and
// only press while it's closed, so we never toggle an open overlay shut.
async function openWithShortcut(page: Page, key: "Meta+k" | "Control+k") {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Suche öffnen" }).first()).toBeVisible();
  await expect(async () => {
    if (!(await dialog(page).isVisible())) await page.keyboard.press(key);
    await expect(dialog(page)).toBeVisible({ timeout: 500 });
  }).toPass({ timeout: 10_000 });
}

test("Cmd+K opens search, finds a dish, Enter deep-links to the menu", async ({ page }) => {
  await openWithShortcut(page, "Meta+k");
  await combo(page).fill("vitello");
  const firstOption = page.getByRole("option").first();
  await expect(firstOption).toBeVisible();
  await page.keyboard.press("Enter");
  // App Router defers the URL change until the on-demand-compiled route's RSC
  // payload arrives in dev — generous timeout absorbs the cold compile.
  await expect(page).toHaveURL(/\/menu#/, { timeout: 15_000 });
});

test("Escape closes the overlay", async ({ page }) => {
  await openWithShortcut(page, "Control+k");
  await page.keyboard.press("Escape");
  await expect(dialog(page)).toHaveCount(0);
});

test("mobile: header search icon opens the overlay", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Suche öffnen" }).first().click();
  await expect(dialog(page)).toBeVisible();
});

test("a page result navigates to the page", async ({ page }) => {
  await openWithShortcut(page, "Meta+k");
  await combo(page).fill("impressum");
  await page.getByRole("option").first().click();
  await expect(page).toHaveURL(/\/impressum/, { timeout: 15_000 });
});

test("FAQ result deep-links and expands the answer", async ({ page }) => {
  await openWithShortcut(page, "Meta+k");
  await combo(page).fill("reservieren");
  const faqHit = page.getByRole("option").filter({ hasText: "FAQ" }).first();
  await faqHit.click();
  await expect(page).toHaveURL(/\/#/, { timeout: 15_000 });
  await expect(page.locator("details[open]")).toHaveCount(1, { timeout: 5000 });
});
