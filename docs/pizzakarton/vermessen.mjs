/**
 * Misst die Deckelflaeche AUS der Stanzvorlage der Druckerei.
 *
 *   node docs/pizzakarton/vermessen.mjs        # nur berichten
 *
 * WARUM DAS EIN EIGENES BAUTEIL IST UND KEIN KOMMENTAR.
 *
 * Bis zum 26.08.2026 stand die Deckelhoehe als Zahl im Motiv, abgeleitet aus
 * der Baenderfolge des Datenblatts. Die Ableitung war falsch — sie nahm an,
 * der Deckel sei das ERSTE grosse Band und damit 327 mm hoch. Die Vorlage
 * zeichnet das erste grosse Band mit 322,7 mm und beschriftet das zweite,
 * 327 mm hohe, mit BODEN. Der Fehler betrug 4,3 mm auf einer Stanzvorlage.
 *
 * Eine Zahl, die man abschreibt, veraltet still. Eine Zahl, die man misst,
 * kann nur veralten, wenn sich die Vorlage aendert — und dann sagt sie es.
 * Deshalb liest dieses Bauteil die Vorlage und liefert die Flaeche; build.mjs
 * setzt sie in die Druckdaten ein. Das Motiv kann so nicht mehr an einer
 * anderen Stelle liegen als die Falzlinien, die es meint.
 *
 * DREI UNABHAENGIGE QUELLEN MUESSEN SICH EINIG SEIN, sonst haelt der Lauf an:
 *   1. die Falzlinien (cyan) im 300-dpi-Rasterbild der Vorlage,
 *   2. die Panel-Beschriftung "DECKEL" aus der Textebene derselben Datei,
 *   3. die hier hinterlegte Erwartung samt benannter Toleranz.
 * Zwei davon koennen sich nicht zufaellig gemeinsam irren.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");

export const VORLAGE = join(root, "public/assets/print/wmd-pizzakarton-vorlage.pdf");

const DPI = 300;
const MM_JE_PX = 25.4 / DPI;
const PT_JE_MM = 72 / 25.4;

/**
 * ERWARTUNG UND TOLERANZ, und beides steht bewusst als Zahl da.
 *
 * Gemessen am 2026-08-27 an der 32-cm-Vorlage. Die Toleranz ist so gewaehlt,
 * dass Rasterung und Linienbreite hineinpassen (rund 0,3 mm) und ein echter
 * Vorlagenwechsel nicht. Wer eine neue Vorlage einspielt und hier anlaeuft,
 * hat kein Problem mit diesem Werkzeug — er hat ein anderes Produkt.
 */
const ERWARTET = { x: 45.8, y: 42.0, b: 321.5, h: 322.7 };
const TOLERANZ_MM = 1.5;

/** Falzlinien-Cyan der Vorlage: rgb(0,168,232). Grosszuegig gefasst, aber
 *  eindeutig gegen das Blau des Sicherheitsabstands (56,112,192) und das
 *  Magenta des Endformats (232,0,136) abgegrenzt. */
const istCyan = (r, g, b) => r < 90 && g > 120 && g < 215 && b > 195 && b - g > 25;

/** Zusammenhaengende Treffer zu einer Linie mitteln — eine Falzlinie ist im
 *  Rasterbild mehrere Pixel breit. */
function linien(zaehler, laenge, schwelle) {
  const out = [];
  let start = -1;
  for (let i = 0; i < zaehler.length; i++) {
    const treffer = zaehler[i] >= laenge * schwelle;
    if (treffer && start < 0) start = i;
    if (!treffer && start >= 0) {
      out.push((start + i - 1) / 2);
      start = -1;
    }
  }
  if (start >= 0) out.push((start + zaehler.length - 1) / 2);
  return out;
}

export async function vermessen({ still = false } = {}) {
  const sharp = (await import("sharp")).default;
  const sagen = (...a) => still || console.log(...a);

  // 1. Bogenmass aus der Datei, nicht aus dem Datenblatt.
  const info = execFileSync("pdfinfo", [VORLAGE], { encoding: "utf8" });
  const mPt = info.match(/Page size:\s+([\d.]+) x ([\d.]+)/);
  if (!mPt) throw new Error("pdfinfo liefert kein Seitenmass fuer die Vorlage");
  const bogen = {
    b: +(parseFloat(mPt[1]) / PT_JE_MM).toFixed(2),
    h: +(parseFloat(mPt[2]) / PT_JE_MM).toFixed(2),
  };

  // 2. Die Vorlage rastern und die Falzlinien zaehlen.
  const dir = mkdtempSync(join(tmpdir(), "karton-mass-"));
  try {
    const stem = join(dir, "vorlage");
    execFileSync("pdftoppm", ["-r", String(DPI), "-png", "-singlefile", VORLAGE, stem]);
    const { data, info: bild } = await sharp(`${stem}.png`)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { width: W, height: H, channels: C } = bild;

    const zeile = new Int32Array(H);
    for (let y = 0; y < H; y++) {
      const off = y * W * C;
      for (let x = 0; x < W; x++) {
        const i = off + x * C;
        if (data[i + 3] > 128 && istCyan(data[i], data[i + 1], data[i + 2])) zeile[y]++;
      }
    }
    // 45 Prozent der Bogenbreite: trennt eine durchlaufende Falzlinie sicher
    // von Bemassungspfeilen, Beschriftungen und dem Legendenkasten.
    const yFalz = linien(zeile, W, 0.45).map((p) => p * MM_JE_PX);
    if (yFalz.length < 2) throw new Error(`nur ${yFalz.length} waagerechte Falzlinien gefunden`);

    // 3. Welches Band ist der Deckel? Die Vorlage sagt es selbst.
    const bbox = execFileSync("pdftotext", ["-bbox", VORLAGE, "-"], { encoding: "utf8" });
    const wort = bbox.match(
      /<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">DECKEL<\/word>/i,
    );
    if (!wort) throw new Error('die Vorlage traegt keine Beschriftung "DECKEL"');
    const labelY = ((parseFloat(wort[2]) + parseFloat(wort[4])) / 2) / PT_JE_MM;

    const oben = [...yFalz].reverse().find((v) => v < labelY);
    const unten = yFalz.find((v) => v > labelY);
    if (oben === undefined || unten === undefined)
      throw new Error(`die Beschriftung DECKEL bei ${labelY.toFixed(1)} mm liegt in keinem Falzband`);

    // 4. Senkrechte Falze NUR innerhalb des Deckelbands — die Seitenlaschen-
    //    Falze laufen nicht ueber den ganzen Bogen und verschwinden in einer
    //    Zaehlung ueber die volle Hoehe.
    const y0 = Math.round(oben / MM_JE_PX) + 20;
    const y1 = Math.round(unten / MM_JE_PX) - 20;
    const spalte = new Int32Array(W);
    for (let y = y0; y < y1; y++) {
      const off = y * W * C;
      for (let x = 0; x < W; x++) {
        const i = off + x * C;
        if (data[i + 3] > 128 && istCyan(data[i], data[i + 1], data[i + 2])) spalte[x]++;
      }
    }
    const xFalz = linien(spalte, y1 - y0, 0.8).map((p) => p * MM_JE_PX);
    if (xFalz.length !== 2)
      throw new Error(`erwartet 2 senkrechte Falzlinien im Deckelband, gefunden ${xFalz.length}`);

    const flaeche = {
      x: +xFalz[0].toFixed(1),
      y: +oben.toFixed(1),
      b: +(xFalz[1] - xFalz[0]).toFixed(1),
      h: +(unten - oben).toFixed(1),
    };

    sagen(`Bogen        ${bogen.b} x ${bogen.h} mm  (aus der Vorlage, nicht aus dem Datenblatt)`);
    sagen(`Beschriftung "DECKEL" bei y = ${labelY.toFixed(1)} mm`);
    sagen(`Deckelflaeche ${flaeche.b} x ${flaeche.h} mm  bei ${flaeche.x} / ${flaeche.y} mm`);

    // 5. Gegen die Erwartung halten. Ein Vorlagenwechsel soll anhalten, nicht
    //    still ein anderes Motiv erzeugen.
    const ab = Object.entries(ERWARTET)
      .map(([k, v]) => [k, Math.abs(flaeche[k] - v)])
      .filter(([, d]) => d > TOLERANZ_MM);
    if (ab.length) {
      console.error(
        `\nDie Vorlage weicht von der Erwartung ab: ` +
          ab.map(([k, d]) => `${k} um ${d.toFixed(1)} mm`).join(", ") +
          `\nErwartet ${JSON.stringify(ERWARTET)}, gemessen ${JSON.stringify(flaeche)}.` +
          `\nDas ist keine Rasterung mehr. Entweder ist eine neue Vorlage im Repo — dann` +
          `\nERWARTET hier nachziehen und das Motiv neu abnehmen lassen — oder es wurde die` +
          `\nfalsche Datei gemessen. NICHT drucken, bevor das geklaert ist.`,
      );
      process.exit(1);
    }

    return { bogen, flaeche, labelY };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (import.meta.url === `file://${process.argv[1]}`) await vermessen();
