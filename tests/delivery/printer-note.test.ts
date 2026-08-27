import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Proves that what the Hinweistext TELLS THE PRINTER matches the file the printer GETS.
 *
 * WARUM ES DIESE PRUEFUNG GIBT. Am 2026-08-27 fragte der Betreiber, ob er den
 * Hinweistexten trauen kann. Die Antwort war unangenehm: beim Vereinfachen der vier Texte
 * stand in der Postkarte "154 x 120 mm" statt "154 x 111 mm" — ein Zahlendreher in einer
 * Anweisung an eine Druckerei, frisch geschrieben, im selben Durchgang. Gefangen hat ihn
 * ein zweiter Blick, kein Mechanismus. Genau dieser Blick steht hier jetzt als Zusicherung.
 *
 * Zwei weitere Behauptungen derselben Texte waren an eine Quelle geknuepft, die sie nicht
 * hergibt: ein benanntes ICC-Profil und ein maximaler Farbauftrag von 300 %. Keines von
 * beiden steht in irgendeinem der vier Datenblaetter der Druckerei (nachgezaehlt: null
 * Treffer). Sie sind aus den Texten entfernt. Diese Datei prueft die Behauptungen, die
 * MASCHINELL pruefbar sind — Format und Seitenzahl. Eine Aussage ueber Farbe ist es nicht,
 * und das ist der Grund, warum die Texte jetzt nur noch wenige, standardnahe Wuensche
 * enthalten statt Zielwerte, die niemand nachrechnen kann.
 *
 * Gelesen wird das AUSGELIEFERTE PDF unter public/assets/print — dieselbe Wahl wie in
 * print-assets.test.ts, aus demselben Grund: eine Pruefung, die auf den Bau statt auf die
 * Auslieferung zeigt, hat hier schon einmal zwoelf Stunden das Falsche gemeldet.
 *
 * Ohne poppler und ohne Abhaengigkeit: MediaBox und Seitenzahl werden direkt aus den
 * PDF-Bytes gelesen.
 */

let pass = 0,
  fail = 0;
function check(label: string, fn: () => void) {
  try {
    fn();
    pass++;
  } catch (e) {
    fail++;
    console.error(`  ✗ ${label}\n    ${(e as Error).message.split("\n")[0]}`);
  }
}

const root = process.cwd();

const STUECKE = [
  { stueck: "postkarte", pdf: "goldoni-postkarte-a6-druckdaten.pdf" },
  { stueck: "bierdeckel", pdf: "goldoni-bierdeckel-druckdaten.pdf" },
  { stueck: "pizzakarton", pdf: "goldoni-pizzakarton-deckel-druckdaten.pdf" },
  { stueck: "briefumschlag", pdf: "goldoni-briefumschlag-druckdaten.pdf" },
];

const ZAHLWORT: Record<string, number> = { Eine: 1, Zwei: 2, Drei: 3, Vier: 4 };

/** Der Hinweistext einer Asset-Seite, egal ob inline oder als Konstante gesetzt. */
function hinweistext(stueck: string): string {
  const src = readFileSync(join(root, `src/app/assets/${stueck}/page.tsx`), "utf8");
  const m =
    src.match(/printerNote=\{`([\s\S]*?)`\}/) ?? src.match(/const PRINTER_NOTE = `([\s\S]*?)`;/);
  assert.ok(m, `keine printerNote in src/app/assets/${stueck}/page.tsx`);
  return m[1];
}

/** MediaBox der ersten Seite in Millimetern, direkt aus den Bytes. */
function massIn(pdfPfad: string): { b: number; h: number; seiten: number } {
  const bytes = readFileSync(join(root, pdfPfad));
  const text = bytes.toString("latin1");
  const box = text.match(/\/MediaBox\s*\[\s*([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s*\]/);
  assert.ok(box, `keine MediaBox in ${pdfPfad}`);
  const mm = (pt: string) => Math.round((parseFloat(pt) * 25.4) / 72);
  const seiten = (text.match(/\/Type\s*\/Page[^s]/g) || []).length;
  assert.ok(seiten > 0, `keine Seiten in ${pdfPfad} gefunden`);
  return { b: mm(box[3]), h: mm(box[4]), seiten };
}

check("es gibt ueberhaupt Stuecke zu pruefen", () => {
  // Nicht-Leerlauf. Eine leere Liste liesse jede Zusicherung unten wahr werden,
  // ohne irgendetwas zu pruefen.
  assert.ok(STUECKE.length === 4, `erwartet 4 Drucksachen, gefunden ${STUECKE.length}`);
});

for (const { stueck, pdf } of STUECKE) {
  const text = hinweistext(stueck);
  const datei = massIn(join("public/assets/print", pdf));

  check(`${stueck}: der Hinweistext nennt ueberhaupt ein Datenformat`, () => {
    assert.match(
      text,
      /\d+ x \d+ mm Datenformat/,
      "ohne Formatangabe kann die Druckerei nicht gegenpruefen, was sie bekommen hat",
    );
  });

  check(`${stueck}: Datenformat im Text = MediaBox der Datei`, () => {
    const m = text.match(/(\d+) x (\d+) mm Datenformat/);
    assert.ok(m);
    assert.deepEqual(
      { b: Number(m[1]), h: Number(m[2]) },
      { b: datei.b, h: datei.h },
      `Text sagt ${m[1]} x ${m[2]} mm, die Datei misst ${datei.b} x ${datei.h} mm`,
    );
  });

  check(`${stueck}: Seitenzahl im Text = Seitenzahl der Datei`, () => {
    const m = text.match(/^(Eine|Zwei|Drei|Vier) Seiten?/m);
    assert.ok(m, "der Text nennt keine Seitenzahl");
    assert.equal(
      ZAHLWORT[m[1]],
      datei.seiten,
      `Text sagt ${m[1]} (${ZAHLWORT[m[1]]}), die Datei hat ${datei.seiten}`,
    );
  });

  check(`${stueck}: keine unbelegte Profil- oder Farbauftragszusage`, () => {
    // Kein Datenblatt der Druckerei nennt ein ICC-Profil oder eine Obergrenze fuer den
    // Farbauftrag — nachgezaehlt am 2026-08-27, null Treffer in allen vier. Eine solche
    // Angabe im Hinweistext waere eine Behauptung ueber eine fremde Quelle, die diese
    // Quelle nicht hergibt.
    assert.doesNotMatch(
      text,
      /FOGRA|ISO Coated|PSO Coated|maximaler Farbauftrag|Gesamtfarbauftrag von \d/i,
      "nennt ein Profil oder einen Zahlenwert fuer den Farbauftrag, den kein Datenblatt hergibt",
    );
  });
}

console.log(`\nHinweistexte (Text = ausgelieferte Datei): ${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
