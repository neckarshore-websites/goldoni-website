import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { CAPTCHA_AKTIV, KONTAKT, TURNSTILE_SITEKEY } from "../../src/lib/kontakt-config";
import { captchaSitekey, verifyCaptchaToken } from "../../src/lib/captcha/verify";

/**
 * Guards for src/lib/kontakt-config.ts, the readable contact settings (planning #2879).
 *
 * 1. No secret in the file that is readable on purpose.
 * 2. No code reads the old variables, or the unreadable Vercel values keep winning.
 * 3. The captcha widget appears only where its secret exists.
 * 4. Production fails closed without the captcha secret, a preview does not.
 *
 * WHAT THIS CANNOT DO: prove the production values are right. Only a live submit
 * through the form, arriving in the owner's mailbox, does that.
 */

let checks = 0;
async function check(name: string, fn: () => void | Promise<void>): Promise<void> {
  await fn();
  checks++;
  console.log(`ok - ${name}`);
}

const QUELLE = readFileSync(join(process.cwd(), "src/lib/kontakt-config.ts"), "utf8");

function quellen(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const pfad = join(dir, name);
    if (statSync(pfad).isDirectory()) return quellen(pfad);
    return /\.(ts|tsx|mjs|js)$/.test(name) ? [pfad] : [];
  });
}

async function mitUmgebung<T>(
  werte: Record<string, string | undefined>,
  fn: () => Promise<T>,
): Promise<T> {
  const umgebung = process.env as Record<string, string | undefined>;
  const vorher = Object.fromEntries(Object.keys(werte).map((k) => [k, umgebung[k]]));
  const setze = (paare: Record<string, string | undefined>) => {
    for (const [k, v] of Object.entries(paare)) {
      if (v === undefined) delete umgebung[k];
      else umgebung[k] = v;
    }
  };
  setze(werte);
  try {
    return await fn();
  } finally {
    setze(vorher);
  }
}

async function main(): Promise<void> {
  await check("kontakt-config.ts names no secret variable or field", () => {
    const variable = QUELLE.match(/\b[A-Z0-9_]*(PASS|SECRET|TOKEN|PASSWORD|PASSWORT)[A-Z0-9_]*\b/g);
    assert.equal(variable, null, `secret variable name in kontakt-config.ts: ${variable}`);
    const feld = QUELLE.match(/\b\w*(pass|passwort|password|secret|geheim|token)\w*\s*:/gi);
    assert.equal(feld, null, `secret field in kontakt-config.ts: ${feld}`);
  });

  await check("values are complete and the addresses have the measured shape", () => {
    assert.equal(KONTAKT.smtpUser, "goldoni@rauhut.com");
    assert.ok(KONTAKT.absender.includes(`<${KONTAKT.smtpUser}>`), "IONOS refuses a foreign sender");
    assert.match(KONTAKT.empfaenger, /^[a-z0-9._-]+@ristorante-goldoni\.de$/);
    assert.ok(KONTAKT.smtpPort > 0 && KONTAKT.smtpPort < 65536);
    assert.match(TURNSTILE_SITEKEY, /^0x4[A-Za-z0-9_-]+$/, "not a production site key");
  });

  await check("no source file reads the old non-secret variables", () => {
    const ALT = [
      "SMTP_HOST",
      "SMTP_PORT",
      "SMTP_USER",
      "SMTP_FROM",
      "INQUIRY_EMAIL_TO",
      "INQUIRY_EMAIL_CC",
      "NEXT_PUBLIC_TURNSTILE_SITEKEY",
      "CAPTCHA_ENABLED",
      "NEXT_PUBLIC_CAPTCHA_ENABLED",
    ];
    for (const datei of quellen(join(process.cwd(), "src"))) {
      const text = readFileSync(datei, "utf8");
      for (const name of ALT) {
        assert.ok(!text.includes(`process.env.${name}`), `${datei} still reads ${name}`);
      }
    }
  });

  await check("captcha widget appears only where its secret exists", () => {
    assert.equal(CAPTCHA_AKTIV, true);
    assert.equal(captchaSitekey({}), null);
    assert.equal(captchaSitekey({ TURNSTILE_SECRET_KEY: "" }), null);
    assert.equal(captchaSitekey({ TURNSTILE_SECRET_KEY: "x" }), TURNSTILE_SITEKEY);
  });

  await check("production fails closed without the captcha secret, a preview does not", async () => {
    const leise = console.error;
    const leise2 = console.warn;
    console.error = () => {};
    console.warn = () => {};
    try {
      const prod = await mitUmgebung(
        { NODE_ENV: "production", VERCEL_ENV: "production", TURNSTILE_SECRET_KEY: undefined },
        () => verifyCaptchaToken("x"),
      );
      assert.equal(prod.ok, false);
      const ausserhalb = await mitUmgebung(
        { NODE_ENV: "production", VERCEL_ENV: undefined, TURNSTILE_SECRET_KEY: undefined },
        () => verifyCaptchaToken("x"),
      );
      assert.equal(ausserhalb.ok, false, "a production build outside Vercel must fail closed");
      const vorschau = await mitUmgebung(
        { NODE_ENV: "production", VERCEL_ENV: "preview", TURNSTILE_SECRET_KEY: undefined },
        () => verifyCaptchaToken("x"),
      );
      assert.equal(vorschau.ok, true);
    } finally {
      console.error = leise;
      console.warn = leise2;
    }
  });

  console.log(`${checks} checks passed`);
}

main().catch((fehler) => {
  console.error(fehler);
  process.exit(1);
});
