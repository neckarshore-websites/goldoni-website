import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for Goldoni inquiry-form E2E tests.
 *
 * Tests run against `next dev` on port 3002. Without SMTP env-vars the
 * `sendInquiry` server action falls into its dry-run path (logs and
 * returns success) — so the tests can assert the success/error UI
 * without actually sending mail. Real-mail delivery is verified
 * manually in the Vercel Production environment, not here.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : "list",

  use: {
    baseURL: "http://localhost:3002",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /**
   * Auto-start `next dev` on port 3002 if no server is already running.
   * `reuseExistingServer` keeps local iteration fast — first `npm run
   * test:e2e` boots the server, subsequent runs reuse it.
   *
   * Force NODE_ENV=development + clear SMTP_* so the action stays in
   * dry-run mode even if the developer has values in their .env.local.
   * That way these tests never accidentally send real mail.
   */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3002",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NODE_ENV: "development",
      SMTP_HOST: "",
      SMTP_PORT: "",
      SMTP_USER: "",
      SMTP_PASS: "",
      SMTP_FROM: "",
      INQUIRY_EMAIL_TO: "",
    },
  },
});
