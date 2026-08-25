import { test, expect } from "@playwright/test";
import { STOREFRONT_PARTNER } from "../../src/lib/site";

/**
 * Guards the ordering CTAs on the two menu pages — and, just as importantly,
 * the line between desktop and mobile.
 *
 * Owner decision 2026-08-25: the desktop version ships now, the mobile one is
 * judged separately after an A/B prototype. That split lives in exactly one
 * place — the `md:` breakpoint (768 px) in OrderCta.tsx — and it is invisible
 * to every other kind of test. A stray `sm:` would put the buttons on phones
 * in landscape, which is precisely the surface still under review.
 *
 * Also guards the URL: every CTA must resolve from `STOREFRONT_PARTNER`, never
 * a pasted string. A new component is where a literal creeps in.
 *
 * WHY THE MOBILE ASSERTION IS NOT "no ordering path on phones": the footer
 * link stays on every viewport. The mobile checks therefore assert zero
 * *CTAs* and one surviving order link — otherwise a change that removed the
 * footer link too would still pass.
 */

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

// Ein einziger schwebender Knopf je Seite — Betreiber-Entscheidung
// 2026-08-25 nach dem Prototyp-Vergleich. Er ersetzte den Knopf neben der
// Ueberschrift und die Streifen in der Karte, die am selben Tag kurz live
// waren. Steigt diese Zahl wieder, war das eine Entscheidung und kein Zufall.
const PAGES = ["/menu", "/empfehlungen"];

for (const path of PAGES) {
  test(`${path}: desktop shows the floating order button`, async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(path);

    const fab = page.locator('[data-testid="order-cta-fab"]');
    await expect(fab).toHaveCount(1);
    await expect(fab).toBeVisible();
    await expect(fab).toHaveAttribute("href", STOREFRONT_PARTNER.url);
    // noopener severs window.opener; noreferrer is deliberately absent so the
    // order is still attributed to this website. See OrderFab.tsx.
    await expect(fab).toHaveAttribute("rel", "noopener");
  });

  test(`${path}: mobile shows no order CTA but keeps the footer order link`, async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(path);

    // `:visible`, not a DOM count. The CTAs are hidden with `display: none`,
    // so they remain in the markup on phones — what must be zero is what a
    // guest can SEE and tap. A DOM-count assertion here would fail against a
    // correct implementation and tempt the next person to "fix" the component.
    await expect(
      page.locator('[data-testid="order-cta"]:visible'),
    ).toHaveCount(0);

    // Die Handy-Varianten liegen weiterhin nur auf /sandbox. Der schwebende
    // Knopf ist am Desktop live, darf hier aber nicht sichtbar werden; der
    // Pillen-Knopf ist nirgends live.
    await expect(page.locator('[data-testid="order-cta-pill"]')).toHaveCount(0);
    await expect(
      page.locator('[data-testid="order-cta-fab"]:visible'),
    ).toHaveCount(0);

    // Non-vacuity: the page must still offer a way to order at all.
    const orderLinks = page.locator(`a[href="${STOREFRONT_PARTNER.url}"]`);
    expect(await orderLinks.count()).toBeGreaterThan(0);
  });
}
