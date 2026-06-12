import type { Page } from "@playwright/test";

/**
 * Wait for the Cloudflare Turnstile token before submitting a form.
 *
 * When the captcha is ENABLED (NEXT_PUBLIC_CAPTCHA_ENABLED=true + sitekey
 * set — e.g. the local prod-build validation with Cloudflare TEST keys),
 * the widget injects a hidden `cf-turnstile-response` input asynchronously.
 * Happy-path specs click submit instantly and would race that token-load →
 * empty token → the server rejects (missing-solution). This helper waits
 * for a non-empty token, but ONLY when the widget is present — so the same
 * specs stay green in the DORMANT state (no widget → instant no-op).
 *
 * Mirrors a real user: by the time a human has filled the form (seconds),
 * the managed widget has long since solved.
 */
export async function waitForTurnstileToken(page: Page): Promise<void> {
  // Dormant (flag off) → no widget rendered → nothing to wait for.
  if ((await page.locator(".cf-turnstile").count()) === 0) return;

  await page.waitForFunction(
    () => {
      const el = document.querySelector<HTMLInputElement>(
        'input[name="cf-turnstile-response"]',
      );
      return !!el && el.value.trim().length > 0;
    },
    undefined,
    { timeout: 15_000 },
  );
}
