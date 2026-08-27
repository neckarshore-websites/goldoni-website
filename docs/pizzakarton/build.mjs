/**
 * Baut die Druckdaten fuer den Pizzakarton-Deckel.
 *
 *   node docs/pizzakarton/build.mjs           # nur druck.html
 *   node docs/pizzakarton/build.mjs --pdf     # + PDF
 *   node docs/pizzakarton/build.mjs --pdf --pruefen   # + Ueberlagerungsbild
 *
 * Schriften und QR-Code werden eingebettet, damit die Datei allein weitergegeben
 * werden kann. Der QR kommt aus docs/postkarte/qr-A.svg — DERSELBE Code wie auf
 * Postkarte und Bierdeckel. Fehlt er: npx tsx docs/postkarte/qr.ts
 *
 * WAS `--pruefen` MACHT, UND WARUM ES MEHR IST ALS EINE NETTIGKEIT.
 *
 * Die Deckelflaeche ist an den Falzlinien der Stanzvorlage ausgemessen und das
 * Motiv um 180 Grad gedreht, weil die Vorlage ihre Deckelflaeche kopfstehend
 * beschriftet. Beides ist eine BEHAUPTUNG ueber eine fremde Datei, und beides
 * faellt erst an gelieferten Kartons auf, wenn es falsch ist. `--pruefen` legt
 * das erzeugte PDF deckungsgleich ueber die Stanzvorlage und schreibt das
 * Ergebnis als Bild — dann ist zu SEHEN, ob das Motiv in der Flaeche liegt, die
 * die Druckerei als Deckel ausweist, statt es zu glauben.
 *
 * Es ersetzt keinen Andruck. Es faengt die zwei Fehler, die eine Ueberlagerung
 * ueberhaupt fangen kann: falsche Position und falsche Drehung.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { vermessen, VORLAGE } from "./vermessen.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");

const need = (p) => {
  if (!existsSync(p)) {
    console.error(`fehlt: ${p}`);
    if (p.endsWith(".svg")) console.error("  -> zuerst: npx tsx docs/postkarte/qr.ts");
    process.exit(1);
  }
  return p;
};
const b64 = (p) => readFileSync(need(p)).toString("base64");
const text = (p) => readFileSync(need(p), "utf8");

/**
 * DIE GEOMETRIE WIRD GEMESSEN, NICHT GETIPPT.
 *
 * vermessen.mjs liest Bogenmass und Deckelflaeche aus der Stanzvorlage der
 * Druckerei und haelt an, wenn beides nicht zur hinterlegten Erwartung passt.
 * Damit KANN das Motiv nicht mehr an einer anderen Stelle liegen als die
 * Falzlinien, die es meint — das ist der Unterschied zu einer Zahl in der
 * Vorlage, die genau so lange stimmt, bis jemand die Vorlage tauscht.
 */
const { bogen, flaeche } = await vermessen();

const subs = {
  __FONT_PLAYFAIR__: b64(join(root, "src/fonts/PlayfairDisplay-Subset.woff2")),
  __FONT_INTER__: b64(join(root, "src/fonts/Inter-Variable-subset.woff2")),
  __QR__: text(join(root, "docs/postkarte/qr-A.svg")),
  __BOGEN_B__: String(bogen.b),
  __BOGEN_H__: String(bogen.h),
  __DECKEL_X__: String(flaeche.x),
  __DECKEL_Y__: String(flaeche.y),
  __DECKEL_B__: String(flaeche.b),
  __DECKEL_H__: String(flaeche.h),
};

let html = text(join(here, "druck.template.html"));
for (const [key, value] of Object.entries(subs)) html = html.replaceAll(key, value);

const left = html.match(/__[A-Z_]+__/g);
if (left) {
  console.error(`unaufgeloeste Platzhalter -> ${[...new Set(left)].join(", ")}`);
  process.exit(1);
}

const open = (html.match(/<div\b/g) || []).length;
const close = (html.match(/<\/div>/g) || []).length;
if (open !== close) {
  console.error(`div-Bilanz ${open}/${close} — Markup ist kaputt`);
  process.exit(1);
}

writeFileSync(join(here, "druck.html"), html);
console.log(`druck.html  (${(html.length / 1024).toFixed(0)} KB, divs ${open}/${close})`);

const pdfPfad = join(here, "goldoni-pizzakarton-deckel-druckdaten.pdf");

if (process.argv.includes("--pdf")) {
  const { chromium } = await import("@playwright/test");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file://${join(here, "druck.html")}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: pdfPfad, printBackground: true, preferCSSPageSize: true });
  console.log("goldoni-pizzakarton-deckel-druckdaten.pdf");
  await browser.close();
}

if (process.argv.includes("--pruefen")) {
  const { execFileSync } = await import("node:child_process");
  const sharp = (await import("sharp")).default;
  const { mkdtempSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");

  const vorlage = VORLAGE;
  need(vorlage);
  need(pdfPfad);

  const dir = mkdtempSync(join(tmpdir(), "karton-"));
  try {
    // 150 dpi reicht fuer die Lagepruefung und haelt das Bild ansehnlich gross.
    const rasterise = (pdf, stem) => {
      execFileSync("pdftoppm", ["-r", "150", "-png", "-singlefile", pdf, join(dir, stem)]);
      return join(dir, `${stem}.png`);
    };
    const a = rasterise(vorlage, "vorlage");
    const b = rasterise(pdfPfad, "motiv");

    // MASSVERGLEICH IN PUNKTEN, NICHT IN PIXELN, und mit einer benannten Toleranz.
    //
    // Chrome rastert die Seitengroesse beim PDF-Druck auf Vielfache von 0,24 pt
    // (1/300 Zoll). Aus 353 x 698 mm werden deshalb 1001,04 x 1979,04 pt statt
    // 1000,63 x 1978,58 — rund 0,18 mm zu gross. Das ist KEINE Eigenheit dieser
    // Datei: Postkarte, Bierdeckel und Briefumschlag zeigen denselben Versatz,
    // alle drei sind Vielfache von 0,24 pt. Bei 5 mm Beschnitt und 3 mm
    // Sicherheitsabstand ist das folgenlos, und die Druckerei schneidet ohnehin
    // aufs Endformat.
    //
    // Die Toleranz steht hier trotzdem als Zahl, nicht als Achselzucken: ein
    // Millimeter Abweichung waere ein Vorlagenwechsel und muss auffallen.
    const massIn = (pdf) => {
      const out = execFileSync("pdfinfo", [pdf], { encoding: "utf8" });
      const m = out.match(/Page size:\s+([\d.]+) x ([\d.]+)/);
      return { w: parseFloat(m[1]), h: parseFloat(m[2]) };
    };
    const va = massIn(vorlage);
    const vb = massIn(pdfPfad);
    const dw = Math.abs(va.w - vb.w), dh = Math.abs(va.h - vb.h);
    const TOLERANZ_PT = 0.75; // rund 0,26 mm — deckt die Chrome-Rasterung, nicht mehr
    const mm = (pt) => (pt * 25.4) / 72;
    console.log(
      `Bogen Vorlage ${va.w} x ${va.h} pt | Motiv ${vb.w} x ${vb.h} pt | ` +
        `Abweichung ${mm(dw).toFixed(2)} x ${mm(dh).toFixed(2)} mm`,
    );
    if (dw > TOLERANZ_PT || dh > TOLERANZ_PT) {
      console.error(
        "Datenformat weicht mehr ab als die bekannte Chrome-Rasterung erklaert — NICHT drucken.",
      );
      process.exit(1);
    }

    // DIE LAGEPRUEFUNG ALS ZAHL, NICHT NUR ALS BILD.
    //
    // Das Bild zeigt einem Menschen, ob das Motiv im Deckel liegt. Diese
    // Pruefung sagt es dem Rechner: die Farbflaeche des erzeugten PDF muss
    // deckungsgleich mit der gemessenen Deckelflaeche sein. Ein Bild wird
    // angesehen, wenn jemand daran denkt — eine Zusicherung haelt auch dann,
    // wenn niemand hinsieht. Beides zusammen faengt Lage UND Drehung.
    const tinte = await (async () => {
      const { data: d, info: bi } = await sharp(b)
        .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const { width: BW, height: BH, channels: BC } = bi;
      const je = 25.4 / 150; // das Motiv wurde mit 150 dpi gerastert
      let x0 = BW, y0 = BH, x1 = -1, y1 = -1;
      for (let y = 0; y < BH; y++) {
        const o = y * BW * BC;
        for (let x = 0; x < BW; x++) {
          const i = o + x * BC;
          if (d[i + 3] > 128 && !(d[i] > 240 && d[i + 1] > 240 && d[i + 2] > 240)) {
            if (x < x0) x0 = x; if (x > x1) x1 = x;
            if (y < y0) y0 = y; if (y > y1) y1 = y;
          }
        }
      }
      return { x: x0 * je, y: y0 * je, b: (x1 - x0 + 1) * je, h: (y1 - y0 + 1) * je };
    })();

    // 0,5 mm deckt Rasterung und Linienbreite bei 150 dpi (0,17 mm je Pixel).
    // Ein verrutschtes oder falsch gedrehtes Motiv liegt um Zentimeter daneben.
    const LAGE_TOLERANZ_MM = 0.5;
    const schief = Object.entries(flaeche)
      .map(([k, v]) => [k, Math.abs(tinte[k] - v)])
      .filter(([, d]) => d > LAGE_TOLERANZ_MM);
    console.log(
      `Farbflaeche ${tinte.b.toFixed(1)} x ${tinte.h.toFixed(1)} mm bei ` +
        `${tinte.x.toFixed(1)} / ${tinte.y.toFixed(1)} — Deckel ${flaeche.b} x ${flaeche.h} ` +
        `bei ${flaeche.x} / ${flaeche.y}`,
    );
    if (schief.length) {
      console.error(
        "Die Farbflaeche deckt sich nicht mit der Deckelflaeche: " +
          schief.map(([k, d]) => `${k} um ${d.toFixed(1)} mm`).join(", ") +
          "\nNICHT drucken.",
      );
      process.exit(1);
    }

    const ma = await sharp(a).metadata();
    const mb = await sharp(b).metadata();

    const ziel = join(here, "pruefbild-ueberlagerung.png");
    // Auf gemeinsame Pixelmasse bringen — die 0,18 mm Rasterung wuerden sonst
    // eine Ueberlagerung verhindern, die genau diese 0,18 mm nicht meint.
    const vorlageRaster = await sharp(a).resize(mb.width, mb.height, { fit: "fill" }).ensureAlpha().toBuffer();
    await sharp(b)
      .composite([{ input: vorlageRaster, blend: "multiply" }])
      .png()
      .toFile(ziel);
    console.log(`pruefbild-ueberlagerung.png  (${ma.width}x${ma.height} px, 150 dpi)`);
    console.log("  -> ansehen: liegt das Motiv in der Flaeche, die 'DECKEL' heisst,");
    console.log("     und steht die Wortmarke gegenueber der Beschriftung richtig herum?");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
