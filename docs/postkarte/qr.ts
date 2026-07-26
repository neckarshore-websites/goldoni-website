/**
 * Styled QR code for the postcard drafts — rounded modules, custom finder eyes,
 * centre emblem. Reads its URL from `STOREFRONT_PARTNER.url`, the same constant
 * the website's order button links to.
 *
 *   npx tsx docs/postkarte/qr.ts
 *
 * DELIBERATELY OUTSIDE THE PRODUCTION PATH. The shipped assets in
 * `public/images/storefront-qr.*` stay plain squares and stay owned by
 * `scripts/generate-storefront-qr.ts`. Nothing here is served, nothing here is
 * built. Once a postcard variant is chosen, the decode check below is what
 * moves into `tests/delivery/` — not this file.
 *
 * WHY THE DECODE CHECK IS NOT OPTIONAL
 *
 * Styling a QR code means damaging it on purpose: rounding the modules, redrawing
 * the eyes, punching a hole in the middle for the emblem. Error correction level H
 * recovers roughly 30 %, which is plenty of headroom — but "plenty" is a guess
 * until something reads the pixels back. A styled code that does not scan is a
 * printed dead end, and looking at it on screen tells you nothing.
 *
 * So this script rasterises the exact geometry it emits and hands it to jsQR.
 * The emblem is rasterised as solid black, the harshest thing that could sit
 * there. If it survives that, marinara is not going to trouble it.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import QRCode from "qrcode";
import { PNG } from "pngjs";
import jsQR from "jsqr";
import { STOREFRONT_PARTNER } from "../../src/lib/site";

const url = STOREFRONT_PARTNER.url;
const qr = QRCode.create(url, { errorCorrectionLevel: "H" });
const N: number = qr.modules.size;
const DATA: Uint8Array = qr.modules.data as unknown as Uint8Array;

/** Quiet zone. Four modules is the spec minimum — scanners need it to find the
 *  symbol at all. Stated rather than defaulted so nobody trims it for layout. */
const QUIET = 4;
const TOTAL = N + QUIET * 2;

/** Emblem side in modules. Odd, so it centres on a module boundary. */
const EMB = 7;
const eLo = Math.floor((N - EMB) / 2);
const eHi = eLo + EMB - 1;

const dark = (x: number, y: number) =>
  x >= 0 && y >= 0 && x < N && y < N && Boolean(DATA[y * N + x]);

const inFinder = (x: number, y: number) =>
  (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);

const inEmblem = (x: number, y: number) =>
  x >= eLo && x <= eHi && y >= eLo && y <= eHi;

/** Dark modules that are drawn as dots: everything except eyes and emblem. */
function bodyModules(): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++)
      if (dark(x, y) && !inFinder(x, y) && !inEmblem(x, y)) out.push([x, y]);
  return out;
}

const FINDERS: Array<[number, number]> = [
  [0, 0],
  [N - 7, 0],
  [0, N - 7],
];

export type QrStyle = {
  name: string;
  /** Ground. Must stay light — inverted codes lose too many native scanners. */
  bg: string;
  /** Modules. In print this should be K only; mixed blacks blur at module edges. */
  module: string;
  eye: string;
  emblemBg: string;
  emblemFg: string;
};

export function toSvg(s: QrStyle): string {
  const px = (n: number) => Number(n.toFixed(3));
  const parts: string[] = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TOTAL} ${TOTAL}" width="100%" height="100%" shape-rendering="geometricPrecision" role="img" aria-label="QR-Code zur Bestellseite von Ristorante Goldoni">`,
    `<rect width="${TOTAL}" height="${TOTAL}" fill="${s.bg}"/>`,
    `<g transform="translate(${QUIET} ${QUIET})">`,
  );

  const dots = bodyModules()
    .map(([x, y]) => `M${px(x + 0.5)} ${px(y)}a.5.5 0 1 1 0 1 .5.5 0 1 1 0-1z`)
    .join("");
  parts.push(`<path fill="${s.module}" d="${dots}"/>`);

  for (const [fx, fy] of FINDERS) {
    parts.push(
      `<rect x="${fx}" y="${fy}" width="7" height="7" rx="2.1" ry="2.1" fill="none" stroke="${s.eye}" stroke-width="1"/>`,
      `<rect x="${fx + 2}" y="${fy + 2}" width="3" height="3" rx="1" ry="1" fill="${s.eye}"/>`,
    );
  }

  // The G must be converted to outlines before any print handoff. A live font
  // reference in print data is a missing-glyph box waiting to happen.
  parts.push(
    `<rect x="${eLo - 0.4}" y="${eLo - 0.4}" width="${EMB + 0.8}" height="${EMB + 0.8}" rx="1.6" ry="1.6" fill="${s.bg}"/>`,
    `<rect x="${eLo + 0.35}" y="${eLo + 0.35}" width="${EMB - 0.7}" height="${EMB - 0.7}" rx="1.3" ry="1.3" fill="${s.emblemBg}"/>`,
    `<text x="${eLo + EMB / 2}" y="${eLo + EMB / 2}" fill="${s.emblemFg}" font-family="Georgia, 'Times New Roman', serif" font-size="4.6" font-style="italic" text-anchor="middle" dominant-baseline="central">G</text>`,
    `</g></svg>`,
  );

  return parts.join("");
}

/* ── Rasteriser: the same geometry as pixels, so jsQR can read it back ───── */

const SCALE = 14;

function raster(): PNG {
  const size = TOTAL * SCALE;
  const png = new PNG({ width: size, height: size });
  png.data.fill(255);

  const set = (px: number, py: number) => {
    if (px < 0 || py < 0 || px >= size || py >= size) return;
    const i = (py * size + px) << 2;
    png.data[i] = 0;
    png.data[i + 1] = 0;
    png.data[i + 2] = 0;
    png.data[i + 3] = 255;
  };

  const off = QUIET * SCALE;
  const disc = (cx: number, cy: number, r: number) => {
    const r2 = r * r;
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
      for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
        const dx = x + 0.5 - cx;
        const dy = y + 0.5 - cy;
        if (dx * dx + dy * dy <= r2) set(x, y);
      }
  };
  const box = (x0: number, y0: number, w: number, h: number) => {
    for (let y = Math.round(y0); y < Math.round(y0 + h); y++)
      for (let x = Math.round(x0); x < Math.round(x0 + w); x++) set(x, y);
  };

  for (const [x, y] of bodyModules())
    disc(off + (x + 0.5) * SCALE, off + (y + 0.5) * SCALE, SCALE / 2);

  for (const [fx, fy] of FINDERS) {
    box(off + fx * SCALE, off + fy * SCALE, 7 * SCALE, SCALE);
    box(off + fx * SCALE, off + (fy + 6) * SCALE, 7 * SCALE, SCALE);
    box(off + fx * SCALE, off + fy * SCALE, SCALE, 7 * SCALE);
    box(off + (fx + 6) * SCALE, off + fy * SCALE, SCALE, 7 * SCALE);
    box(off + (fx + 2) * SCALE, off + (fy + 2) * SCALE, 3 * SCALE, 3 * SCALE);
  }

  // Worst case on purpose.
  box(off + eLo * SCALE, off + eLo * SCALE, EMB * SCALE, EMB * SCALE);

  return png;
}

export const STYLES: QrStyle[] = [
  // Variante A — monochrome, for the olive back.
  {
    name: "A",
    bg: "#FAFAFA",
    module: "#000000",
    eye: "#000000",
    emblemBg: "#1A1612",
    emblemFg: "#FEF1A5",
  },
  // Variante B — marinara eyes and emblem, for the marinara back.
  {
    name: "B",
    bg: "#FFFFFF",
    module: "#000000",
    eye: "#8E2800",
    emblemBg: "#8E2800",
    emblemFg: "#FEF1A5",
  },
];

function main() {
  const out = join(process.cwd(), "docs/postkarte");
  for (const s of STYLES) {
    writeFileSync(join(out, `qr-${s.name}.svg`), toSvg(s), "utf8");
  }

  const png = raster();
  const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);

  console.log(`URL      : ${url}`);
  console.log(`Matrix   : ${N} x ${N} Module, Fehlerkorrektur H`);
  console.log(
    `Emblem   : ${EMB} x ${EMB} Module = ${((EMB / N) ** 2 * 100).toFixed(1)} % der Codefläche`,
  );

  if (!decoded) {
    console.error("FEHLER: der gestylte Code ist nicht lesbar.");
    process.exit(1);
  }
  if (decoded.data !== url) {
    console.error(`FEHLER: dekodiert zu ${decoded.data}, erwartet ${url}`);
    process.exit(1);
  }
  console.log("Dekodiert: identisch mit der URL des Bestell-Buttons.");
}

main();
