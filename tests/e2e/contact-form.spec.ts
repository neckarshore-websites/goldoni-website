import { test, expect, type Page } from "@playwright/test";

/**
 * /kontakt — ContactForm
 *
 * The Server Action runs in dry-run mode here (no SMTP env vars set in
 * playwright.config.ts → the action logs and returns success without
 * touching nodemailer). Tests assert the UI states the action returns:
 * success → "Grazie!" panel; error → field-level + form-level alert
 * messages.
 *
 * Real-mail delivery is verified manually in Production — these tests
 * only guard the UX/validation contract.
 *
 * Field selectors use `[name="..."]` rather than `getByLabel` because
 * the page wraps the form in a `<section aria-labelledby="...">`,
 * which makes `getByLabel` match both the section and the input.
 */

const fields = (page: Page) => ({
  name: page.locator('input[name="name"]'),
  email: page.locator('input[name="email"]'),
  phone: page.locator('input[name="phone"]'),
  message: page.locator('textarea[name="message"]'),
  honeypot: page.locator('input[name="website"]'),
  submit: page.getByRole("button", { name: /nachricht senden/i }),
});

test.describe("/kontakt — ContactForm", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/kontakt");
    await expect(fields(page).submit).toBeVisible();
  });

  test("submits valid input and shows the Grazie panel", async ({ page }) => {
    const f = fields(page);
    await f.name.fill("Linus Test");
    await f.email.fill("linus@example.com");
    await f.phone.fill("+49 711 123456");
    await f.message.fill(
      "Playwright happy-path test — diese Nachricht erreicht den Inhaber nicht (dry-run).",
    );

    await f.submit.click();

    await expect(
      page.getByRole("heading", { name: "Grazie!" }),
    ).toBeVisible();
    await expect(
      page.getByText("Wir haben Ihre Nachricht erhalten"),
    ).toBeVisible();
  });

  test("rejects empty submission with field-level errors", async ({
    page,
  }) => {
    await fields(page).submit.click();

    await expect(
      page.getByRole("heading", { name: "Grazie!" }),
    ).toHaveCount(0);

    // Three required fields → three messages.
    await expect(page.getByText("Bitte Namen angeben.")).toBeVisible();
    await expect(page.getByText("Bitte E-Mail angeben.")).toBeVisible();
    await expect(page.getByText("Bitte Nachricht angeben.")).toBeVisible();

    // Form-level summary message also surfaces.
    await expect(page.getByText("Bitte Eingaben pruefen.")).toBeVisible();
  });

  test("rejects invalid email format", async ({ page }) => {
    const f = fields(page);
    await f.name.fill("Linus Test");
    await f.email.fill("not-an-email");
    await f.message.fill("Email-Validation-Test.");

    await f.submit.click();

    await expect(
      page.getByRole("heading", { name: "Grazie!" }),
    ).toHaveCount(0);
    await expect(
      page.getByText("Bitte gueltige E-Mail-Adresse angeben."),
    ).toBeVisible();
  });

  test("preserves user input across validation errors", async ({ page }) => {
    // Regression for the worst form UX: validation error wipes the
    // whole form. The action echoes values back; the form reads them
    // via defaultValue so the error round-trip keeps the input.
    const f = fields(page);
    await f.name.fill("Linus Test");
    await f.phone.fill("+49 711 123456");
    await f.message.fill(
      "Frage zu Allergenen — Glutenfrei moeglich am Sonntag?",
    );
    // Email deliberately invalid so the action returns status=error
    // with all other fields echoed back.
    await f.email.fill("not-an-email");

    await f.submit.click();

    await expect(
      page.getByText("Bitte gueltige E-Mail-Adresse angeben."),
    ).toBeVisible();

    await expect(f.name).toHaveValue("Linus Test");
    await expect(f.email).toHaveValue("not-an-email");
    await expect(f.phone).toHaveValue("+49 711 123456");
    await expect(f.message).toHaveValue(
      "Frage zu Allergenen — Glutenfrei moeglich am Sonntag?",
    );
  });

  test("trims and length-caps oversized fields without crashing", async ({
    page,
  }) => {
    // The action enforces MAX_FIELD_LEN=200 and MAX_MESSAGE_LEN=4000;
    // an over-sized name should not 500 — just gets sliced server-side
    // and the submission still succeeds.
    const f = fields(page);
    await f.name.fill("a".repeat(500));
    await f.email.fill("linus@example.com");
    await f.message.fill("length-cap test");

    await f.submit.click();

    await expect(
      page.getByRole("heading", { name: "Grazie!" }),
    ).toBeVisible();
  });

  test("honeypot submission silently returns success without leaking", async ({
    page,
  }) => {
    // Bots fill every input including hidden ones. We mimic that by
    // populating the off-screen `website` input and submitting an
    // otherwise complete form. The action returns success without
    // actually queuing mail — UX-wise indistinguishable from a real
    // success so the bot doesn't retry differently.
    const f = fields(page);
    await f.name.fill("Bot Test");
    await f.email.fill("bot@example.com");
    await f.message.fill("Honeypot trip.");
    await f.honeypot.fill("http://spam.example");

    await f.submit.click();

    await expect(
      page.getByRole("heading", { name: "Grazie!" }),
    ).toBeVisible();
  });
});
