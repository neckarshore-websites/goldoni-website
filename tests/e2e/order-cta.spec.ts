import { test, expect } from "@playwright/test";
import { storefrontUrl } from "../../src/lib/site";

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
 * Also guards the URL: every CTA must resolve from site.ts, never a pasted
 * string. A new component is where a literal creeps in.
 *
 * Seit 2026-08-26 ist die erwartete Adresse `storefrontUrl("web")`, nicht die
 * nackte `STOREFRONT_PARTNER.url`: Website-Flaechen tragen die Kanal-Kennung,
 * damit eine Bestellung von hier von einer ueber Google oder die Wolt-App
 * unterscheidbar ist. Die nackte Form bleibt die kanonische Quelle und steht
 * weiterhin in der maschinenlesbaren Auskunft.
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
    await expect(fab).toHaveAttribute("href", storefrontUrl("web"));
    // noopener severs window.opener; noreferrer is deliberately absent so the
    // order is still attributed to this website. See OrderFab.tsx.
    await expect(fab).toHaveAttribute("rel", "noopener");
  });

  test(`${path}: mobile shows the same floating button`, async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(path);

    // Seit dem 25.08. trägt das Handy denselben Knopf wie der Desktop
    // (Variante B des A/B-Vergleichs). Vorher stand hier bewusst eine
    // Null — die Grenze war eine Entscheidung, ihre Aufhebung ist es auch.
    const fab = page.locator('[data-testid="order-cta-fab"]');
    await expect(fab).toHaveCount(1);
    await expect(fab).toBeVisible();
    await expect(fab).toHaveAttribute("href", storefrontUrl("web"));

    // Variante A (Knopf IN der klebenden Kategorieleiste) ist nicht gewählt
    // worden und liegt weiterhin nur auf /sandbox.
    await expect(page.locator('[data-testid="order-cta-pill"]')).toHaveCount(0);

    // Non-vacuity: the page must still offer a way to order at all.
    const orderLinks = page.locator(`a[href="${storefrontUrl("web")}"]`);
    expect(await orderLinks.count()).toBeGreaterThan(0);
  });
}
