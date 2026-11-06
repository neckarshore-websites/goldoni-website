import { test, expect } from "@playwright/test";

/**
 * Browser chrome tint — the theme-color tag in the rendered HTML.
 *
 * The source of the color is `--color-noir-bg` in globals.css, the sticky
 * Header's ground in both themes. The layout repeats the value because Next
 * cannot read a CSS custom property; this test holds the two together, in
 * both themes, on more than one page.
 */
const PAGES = ["/", "/kontakt"];

for (const theme of ["light", "dark"] as const) {
  test(`theme-color equals the header noir (${theme})`, async ({ page }) => {
    await page.addInitScript((t) => {
      try {
        localStorage.setItem("theme", t);
      } catch {
        /* storage unavailable: the light default applies */
      }
    }, theme);
    for (const path of PAGES) {
      // A 404 page carries the same layout and would pass the checks below.
      const res = await page.goto(path);
      expect(res?.status(), `${path}: status`).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

      const tags = page.locator('meta[name="theme-color"]');
      expect(await tags.count(), `${path}: theme-color tags`).toBe(1);
      const declared = (await tags.getAttribute("content"))?.toLowerCase();

      const token = await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue("--color-noir-bg")
          .trim()
          .toLowerCase(),
      );
      expect(declared, `${path}: tag vs --color-noir-bg`).toBe(token);
    }
  });
}
