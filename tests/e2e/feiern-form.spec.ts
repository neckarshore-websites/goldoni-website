import { test, expect, type Page } from "@playwright/test";

/**
 * /feiern — FeiernForm
 *
 * Same dry-run setup as the contact-form spec — the inquiry server
 * action returns success without sending mail because no SMTP env
 * vars are exposed to `next dev` (see playwright.config.ts).
 *
 * The Feiern form has more required fields than Kontakt: phone is
 * additionally required, plus occasion/date/guestCount.
 */

const futureDate = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
})();

const fields = (page: Page) => ({
  name: page.locator('input[name="name"]'),
  email: page.locator('input[name="email"]'),
  phone: page.locator('input[name="phone"]'),
  occasion: page.locator('select[name="occasion"]'),
  guestCount: page.locator('input[name="guestCount"]'),
  date: page.locator('input[name="date"]'),
  preferredTime: page.locator('input[name="preferredTime"]'),
  message: page.locator('textarea[name="message"]'),
  submit: page.getByRole("button", { name: /anfrage senden/i }),
});

test.describe("/feiern — FeiernForm", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/feiern");
    await expect(fields(page).submit).toBeVisible();
  });

  test("submits a fully valid celebration request and shows Grazie panel", async ({
    page,
  }) => {
    const f = fields(page);
    await f.name.fill("Linus Test");
    await f.email.fill("linus@example.com");
    await f.phone.fill("+49 711 123456");
    await f.occasion.selectOption("geburtstag");
    await f.guestCount.fill("12");
    await f.date.fill(futureDate);
    await f.preferredTime.fill("ab 19:00");
    await f.message.fill("Playwright happy-path Feiern.");

    await f.submit.click();

    await expect(
      page.getByRole("heading", { name: "Grazie!" }),
    ).toBeVisible();
    await expect(
      page.getByText("Ihre Feieranfrage ist bei uns eingegangen"),
    ).toBeVisible();
  });

  test("rejects empty submission with errors on all required fields", async ({
    page,
  }) => {
    await fields(page).submit.click();

    await expect(
      page.getByRole("heading", { name: "Grazie!" }),
    ).toHaveCount(0);

    // Common required (name + email) — same as Kontakt.
    await expect(page.getByText("Bitte Namen angeben.")).toBeVisible();
    await expect(page.getByText("Bitte E-Mail angeben.")).toBeVisible();

    // Feiern-specific required fields.
    await expect(
      page.getByText("Bei Feiern bitte Telefonnummer angeben."),
    ).toBeVisible();
    await expect(page.getByText("Bitte Anlass auswaehlen.")).toBeVisible();
    await expect(page.getByText("Bitte Wunschdatum angeben.")).toBeVisible();
    await expect(
      page.getByText("Bitte Gaesteanzahl (mind. 1) angeben."),
    ).toBeVisible();

    // Form-level summary.
    await expect(page.getByText("Bitte Eingaben pruefen.")).toBeVisible();
  });

  test("rejects when phone is missing (required for Feiern)", async ({
    page,
  }) => {
    const f = fields(page);
    await f.name.fill("Linus Test");
    await f.email.fill("linus@example.com");
    await f.occasion.selectOption("hochzeit");
    await f.guestCount.fill("40");
    await f.date.fill(futureDate);

    await f.submit.click();

    await expect(
      page.getByRole("heading", { name: "Grazie!" }),
    ).toHaveCount(0);
    await expect(
      page.getByText("Bei Feiern bitte Telefonnummer angeben."),
    ).toBeVisible();
  });

  test("preserves user input across validation errors", async ({ page }) => {
    // Regression for the worst form UX: user fills 5 of 6 fields,
    // submits, validation flags the missing field, and the entire
    // form is wiped to blank. They have to re-type everything.
    // The action echoes values back; the form reads them via
    // defaultValue so the error round-trip keeps the input.
    const f = fields(page);
    await f.name.fill("Linus Test");
    await f.email.fill("linus@example.com");
    await f.occasion.selectOption("geburtstag");
    await f.guestCount.fill("12");
    await f.date.fill(futureDate);
    await f.preferredTime.fill("ab 19:00");
    await f.message.fill("Etwas Italienisches, gerne ohne Fisch.");
    // Phone deliberately empty — Feiern requires it, so the action
    // returns status=error with the other fields echoed back.

    await f.submit.click();

    await expect(
      page.getByText("Bei Feiern bitte Telefonnummer angeben."),
    ).toBeVisible();

    // Now the values must still be in place.
    await expect(f.name).toHaveValue("Linus Test");
    await expect(f.email).toHaveValue("linus@example.com");
    await expect(f.occasion).toHaveValue("geburtstag");
    await expect(f.guestCount).toHaveValue("12");
    await expect(f.date).toHaveValue(futureDate);
    await expect(f.preferredTime).toHaveValue("ab 19:00");
    await expect(f.message).toHaveValue(
      "Etwas Italienisches, gerne ohne Fisch.",
    );
  });

  test("rejects when guestCount is zero", async ({ page }) => {
    const f = fields(page);
    await f.name.fill("Linus Test");
    await f.email.fill("linus@example.com");
    await f.phone.fill("+49 711 123456");
    await f.occasion.selectOption("geburtstag");
    await f.guestCount.fill("0");
    await f.date.fill(futureDate);

    await f.submit.click();

    await expect(
      page.getByRole("heading", { name: "Grazie!" }),
    ).toHaveCount(0);
    await expect(
      page.getByText("Bitte Gaesteanzahl (mind. 1) angeben."),
    ).toBeVisible();
  });

  test("rejects when guestCount is non-numeric", async ({ page }) => {
    const f = fields(page);
    await f.name.fill("Linus Test");
    await f.email.fill("linus@example.com");
    await f.phone.fill("+49 711 123456");
    await f.occasion.selectOption("geburtstag");
    await f.guestCount.fill("viele");
    await f.date.fill(futureDate);

    await f.submit.click();

    await expect(
      page.getByRole("heading", { name: "Grazie!" }),
    ).toHaveCount(0);
    await expect(
      page.getByText("Bitte Gaesteanzahl (mind. 1) angeben."),
    ).toBeVisible();
  });
});
