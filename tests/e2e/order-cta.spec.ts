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

const PAGES = [
  { path: "/menu", ctas: 3 }, // headline + band after `pizze` + band after `dolci`
  { path: "/empfehlungen", ctas: 2 }, // headline + band after `primi-pizze`
];

for (const { path, ctas } of PAGES) {
  test(`${path}: desktop shows ${ctas} order CTAs, all pointing at the Storefront`, async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(path);

    const cta = page.locator('[data-testid="order-cta"]');
    await expect(cta).toHaveCount(ctas);

    for (let i = 0; i < ctas; i++) {
      await expect(cta.nth(i)).toBeVisible();
      await expect(cta.nth(i)).toHaveAttribute("href", STOREFRONT_PARTNER.url);
      // noopener severs window.opener; noreferrer is deliberately absent so the
      // order is still attributed to this website. See OrderCta.tsx.
      await expect(cta.nth(i)).toHaveAttribute("rel", "noopener");
    }
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

    // The prototype variants (pill inside the sticky bar, floating button)
    // live on /sandbox only. If either ever leaks onto a live page without a
    // decision, this fails — the whole point of the 25.08. split.
    await expect(page.locator('[data-testid="order-cta-pill"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="order-cta-fab"]')).toHaveCount(0);

    // Non-vacuity: the page must still offer a way to order at all.
    const orderLinks = page.locator(`a[href="${STOREFRONT_PARTNER.url}"]`);
    expect(await orderLinks.count()).toBeGreaterThan(0);
  });
}
