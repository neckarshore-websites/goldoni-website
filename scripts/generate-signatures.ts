/**
 * Schreibt die E-Mail-Signaturen als eigenständige HTML-Dateien nach
 * public/signaturen/.
 *
 *   npm run signaturen
 *
 * WARUM ÜBERHAUPT DATEIEN, wo die Vorschauseite sie doch schon rendert:
 * Signaturen werden nicht angeschaut, sondern EINGEBAUT. Der übliche Weg ist,
 * die fertige Signatur im Browser zu öffnen, alles zu markieren und in Outlook
 * oder Apple Mail einzufügen — dabei übernimmt das Mailprogramm die Formatierung
 * mitsamt Bild. Dafür braucht es eine Seite, die NUR die Signatur enthält.
 *
 * Beide — Vorschauseite und Datei — bauen aus derselben Konstante in
 * src/lib/email-signatures.ts. Zwei Kopien desselben Markups würden
 * auseinanderlaufen, und die falsche Kopie wäre die, die tausendfach
 * verschickt wird.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SIGNATURES, signatureDocument } from "../src/lib/email-signatures";

const root = process.cwd();
const outDir = join(root, "public/signaturen");
mkdirSync(outDir, { recursive: true });

for (const s of SIGNATURES) {
  const file = join(outDir, `goldoni-signatur-${s.id}.html`);
  writeFileSync(file, signatureDocument(s.html, s.titel), "utf8");
  console.log(`  public/signaturen/goldoni-signatur-${s.id}.html  (${s.titel})`);
}

console.log(`\n${SIGNATURES.length} Signaturen geschrieben.`);
