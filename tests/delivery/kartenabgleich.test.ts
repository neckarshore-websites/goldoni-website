/**
 * Selbsttest fuer scripts/kartenabgleich.ts.
 *
 * Geprueft wird das, was das Skript SELBST entscheidet — Abschrift zerlegen und
 * zwei Legenden vergleichen. Die Regeln und die Code-Aufloesung gehoeren den
 * beiden anderen Toren; die werden hier bewusst nicht nachgebaut.
 *
 * Der Testfall ist der echte Vorfall vom 2026-09-17: auf der Karte heisst N
 * "Weichtiere", im Repo stand damals "Sesam". Genau diese Abweichung muss das
 * Skript benennen, sonst haette es den Fehler nicht gefunden.
 */

import assert from "node:assert/strict";
import { parseAbschrift, vergleiche } from "../../scripts/kartenabgleich";

let checks = 0;
function check(name: string, fn: () => void): void {
  fn();
  checks++;
  console.log(`ok - ${name}`);
}

check("Abschrift: Buchstaben und Zahlen, Trenner egal", () => {
  const m = parseAbschrift("A  Glutenhaltig\nB) Krebstiere\n10. Chininhaltig\n\n# Kommentar\nMuell");
  assert.equal(m.get("A"), "Glutenhaltig");
  assert.equal(m.get("B"), "Krebstiere");
  assert.equal(m.get("10"), "Chininhaltig");
  assert.equal(m.size, 3);
});

check("der Vorfall vom 2026-09-17 wird benannt", () => {
  const druck = parseAbschrift("N Weichtiere");
  const ab = vergleiche(druck, [{ code: "N", name: "Sesam" }]);
  assert.equal(ab.length, 1);
  assert.equal(ab[0].art, "andere-bedeutung");
  assert.equal(ab[0].druck, "Weichtiere");
  assert.equal(ab[0].repo, "Sesam");
});

check("Code nur auf der Karte, Code nur im Repo", () => {
  const ab = vergleiche(parseAbschrift("K Sesamsamen"), [{ code: "P", name: "Lupinen" }]);
  assert.deepEqual(
    ab.map((a) => a.art).sort(),
    ["nur-druck", "nur-repo"],
  );
});

check("gleiche Bedeutung, andere Schreibweise ist keine Abweichung", () => {
  const ab = vergleiche(parseAbschrift("A  glutenhaltig"), [{ code: "A", name: "Glutenhaltig" }]);
  assert.equal(ab.length, 0);
});

check("identische Legenden ergeben keine Abweichung", () => {
  const codes = [
    { code: "A", name: "Glutenhaltig" },
    { code: "9", name: "Koffeinhaltig" },
  ];
  const ab = vergleiche(parseAbschrift("A Glutenhaltig\n9 Koffeinhaltig"), codes);
  assert.equal(ab.length, 0);
});

// Kanonische Zeile fuer den Estate-Zaehler, siehe menu-codes.test.ts (#145).
console.log(`\n${checks} checks passed`);
console.log(`${checks} passed, 0 failed`);
