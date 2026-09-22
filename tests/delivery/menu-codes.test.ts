import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ALLERGENS, ADDITIVES } from "../../src/lib/codes";

/**
 * Proves that every allergen/additive code shown next to a dish is explained in the legend.
 *
 * WARUM ES DIESE PRUEFUNG GIBT. Am 2026-09-17 zeigte ein Foto der gedruckten Legende, dass
 * die Website-Legende ein anderes Schema verwendete als die Codes an den Gerichten: Espresso
 * trug 9 (Karte: koffeinhaltig), die Website erklaerte 9 als Suessungsmittel; Calamari trugen
 * N (Weichtiere), die Website sagte Sesam. 21 Stellen, niemand hat es bemerkt, weil kein
 * Mechanismus Gerichte und Legende gegeneinander hielt.
 *
 * Diese Pruefung faengt einen Code ohne Legenden-Eintrag und doppelte Codes. Eine FALSCHE
 * Bedeutung faengt sie nicht — das kann nur der Abgleich mit der gedruckten Karte. Deshalb
 * sichert sie zusaetzlich die Anker, an denen der Fehler entdeckt wurde.
 */

let pass = 0;
const check = (name: string, fn: () => void) => {
  fn();
  pass++;
  console.log(`ok - ${name}`);
};

const legend = new Map([...ALLERGENS, ...ADDITIVES].map((c) => [c.code, c.name]));

check("legend has no duplicate codes", () => {
  assert.equal(legend.size, ALLERGENS.length + ADDITIVES.length);
});

check("legend matches the printed card: 15 allergens, 15 additives", () => {
  assert.deepEqual(
    ALLERGENS.map((c) => c.code),
    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "S"],
  );
  assert.deepEqual(
    ADDITIVES.map((c) => c.code),
    Array.from({ length: 15 }, (_, i) => String(i + 1)),
  );
});

check("anchors from the 2026-09-17 discovery", () => {
  assert.equal(legend.get("N"), "Weichtiere");
  assert.equal(legend.get("9"), "Koffeinhaltig");
  assert.equal(legend.get("10"), "Chininhaltig");
  assert.equal(legend.get("S"), "Sulfite");
});

const files = ["speisekarte.json", "empfehlungskarte.json", "weinempfehlungen.json"];
const unresolved: string[] = [];
let refs = 0;
const walk = (node: unknown, file: string, label: string) => {
  if (Array.isArray(node)) return node.forEach((n) => walk(n, file, label));
  if (!node || typeof node !== "object") return;
  const obj = node as Record<string, unknown>;
  const name = typeof obj.name === "string" ? obj.name : label;
  if (Array.isArray(obj.allergens)) {
    for (const code of obj.allergens) {
      refs++;
      if (!legend.has(String(code))) unresolved.push(`${file}: ${name} -> ${code}`);
    }
  }
  for (const [k, v] of Object.entries(obj)) if (k !== "allergens") walk(v, file, name);
};
for (const f of files) {
  walk(JSON.parse(readFileSync(join(process.cwd(), "src/data", f), "utf8")), f, "?");
}

check(`every code on a dish resolves in the legend (${refs} references)`, () => {
  assert.ok(refs > 0, "no allergen references found — data shape changed?");
  assert.deepEqual(unresolved, [], `unresolved codes:\n${unresolved.join("\n")}`);
});

// Zwei Zeilen: die lesbare fuer Menschen, die kanonische fuer den Estate-Zaehler.
// Der tsx-Handler von test-stats-action liest ausschliesslich "<N> passed, <M> failed";
// "N checks passed" erkennt er nicht, die Suite floss damit still mit 0 ein (#145).
console.log(`\n${pass} checks passed`);
console.log(`${pass} passed, 0 failed`);
