import { test, expect } from "@playwright/test";

/**
 * Guards what the rendered /datenschutz page says about the mail path and Turnstile.
 *
 * Until 2026-11-03 section 5 named DomainFactory as the mail service, four months after
 * the form had moved to IONOS, and section 4 called Cloudflare only a processor. Nothing
 * failed, because no test read the page text. This spec reads the RENDERED page, not the
 * source, so a wording that lives in a component or in legal.ts is caught either way.
 *
 * Wording source: Dr. Sommer's report 2026-11-02-dr-sommer-25tinx-turnstile
 * (texts.goldoni_section_5, texts.goldoni_legal_ts, texts.turnstile_sie).
 *
 * WHAT THIS CANNOT DO: tell whether the named provider is still the one the form uses.
 * The mail path lives in kontakt-config.ts and is guarded by the kontakt unit test; only
 * a live submit proves it.
 */

const MUST_NOT_APPEAR = [
  "DomainFactory",
  "Cloudflare agiert als Auftragsverarbeiter",
  "Drittlandübermittlung findet beim E-Mail-Versand selbst nicht statt",
];

const MUST_APPEAR = [
  "IONOS SE",
  "Microsoft 365",
  "cf.turnstile.u",
  "§ 25 Abs. 2 Nr. 2 TDDDG",
  "Rollen und Speicherdauer",
];

test.describe("/datenschutz wording", () => {
  test("names the real mail path and both Turnstile roles", async ({ page }) => {
    await page.goto("/datenschutz");
    const text = (await page.locator("main").innerText()).replace(/\s+/g, " ");

    for (const phrase of MUST_NOT_APPEAR) {
      expect(text, `must not say: ${phrase}`).not.toContain(phrase);
    }
    for (const phrase of MUST_APPEAR) {
      expect(text, `must say: ${phrase}`).toContain(phrase);
    }
  });
});
