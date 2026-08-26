import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  ZEILEN,
  AUSSERHALB,
  NICHT_INHALT,
  REGISTER_DATEIEN,
  istBelegt,
} from "../../src/lib/bild-herkunft";

/**
 * Hält das Bild-Herkunfts-Register gegen die Wirklichkeit im Quelltext.
 *
 * WARUM ES DIESES TOR GIBT: die Inventur vom 25.08.2026 war eine von Hand
 * gepflegte Momentaufnahme. Ein neues Hero-Bild auf einer Seite hätte sie
 * still veralten lassen, und der Befund, den sie festhält — fünf Bilder ohne
 * dokumentierte Herkunft — wäre unbemerkt zu sechs geworden. Für ein Register,
 * das als Tatsachengrundlage einer rechtlichen Bewertung dient, ist stilles
 * Veralten der teuerste Fehlerfall.
 *
 * WAS ES LIEST UND WAS NICHT: die tatsächlichen Bildreferenzen in `src/`,
 * nicht `public/images/*.webp`. Das ist kein Detail. Im Verzeichnis liegt
 * `hero-feiern-essen.webp`, das auf keiner Inhaltsseite erscheint und nur auf
 * `/assets` aufgezählt wird. Ein Tor über das Verzeichnis würde diese Datei
 * fälschlich einfordern und damit eine ANDERE Menge messen als die, über die
 * das Register eine Aussage macht — genau die Klasse Fehler, an der in diesem
 * Repo schon drei Tore gescheitert sind, weil sie am ausgelieferten Ding
 * vorbeisahen.
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

const SRC = path.join(process.cwd(), "src");

function dateienUnter(dir: string): string[] {
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...dateienUnter(p));
    else if (/\.(tsx?|mdx?)$/.test(e.name)) out.push(p);
  }
  return out;
}

/**
 * Entfernt Kommentare, bevor gesucht wird. Ohne das zählt jeder Doku-Beispiel-
 * pfad als Bildreferenz — `AssetCard.tsx` erklärt seine Umwandlung an
 * "public/images/foo.png", und das Tor forderte beim ersten Lauf prompt eine
 * Registerzeile dafür.
 *
 * Bewusst KONSERVATIV: Blockkommentare vollständig, Zeilenkommentare nur, wenn
 * die Zeile mit `//` oder `*` beginnt. Ein globales `//`-Stripping würde in
 * `https://…/images/x.webp` hineinschneiden und eine ECHTE Referenz
 * verschwinden lassen — der Fehler ginge dann in die stille Richtung.
 */
function ohneKommentare(quelle: string): string {
  return quelle
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .filter((z) => !/^\s*(\/\/|\*)/.test(z))
    .join("\n");
}

/** Alle Bildreferenzen in src/, ohne die Seiten, die ÜBER Bilder reden. */
function referenzen(): Map<string, string[]> {
  const treffer = new Map<string, string[]>();
  for (const datei of dateienUnter(SRC)) {
    const rel = path.relative(process.cwd(), datei);
    if (AUSSERHALB.some((a) => rel.startsWith(a))) continue;
    if (REGISTER_DATEIEN.includes(rel)) continue;
    const inhalt = ohneKommentare(fs.readFileSync(datei, "utf-8"));
    for (const m of inhalt.matchAll(/\/images\/([a-z0-9-]+\.(?:webp|jpg|jpeg|png|avif))/g)) {
      const name = m[1];
      if (name in NICHT_INHALT) continue;
      treffer.set(name, [...(treffer.get(name) ?? []), rel]);
    }
  }
  return treffer;
}

const gefunden = referenzen();
const registriert = new Set(ZEILEN.map((z) => z.datei));

// NICHT-LEERHEIT ZUERST. Jede Prüfung unten läuft über eine dieser beiden
// Mengen. Wären sie leer, würden alle bestehen und nichts beweisen — ein
// kaputter Scanner (falscher Pfad, falscher Ausdruck) sähe dann aus wie ein
// sauberes Register.
check("der Scanner findet überhaupt Bildreferenzen im Quelltext", () => {
  assert.ok(gefunden.size >= 10, `nur ${gefunden.size} Referenzen gefunden — Scanner prüfen`);
});

check("das Register ist nicht leer", () => {
  assert.ok(ZEILEN.length >= 10, `nur ${ZEILEN.length} Zeilen`);
});

// RICHTUNG 1: kein Bild auf einer Inhaltsseite ohne Registerzeile.
check("jedes im Quelltext verwendete Bild steht im Register", () => {
  const fehlend = [...gefunden.keys()].filter((d) => !registriert.has(d)).sort();
  assert.deepEqual(
    fehlend,
    [],
    `nicht registriert: ${fehlend.map((d) => `${d} (${gefunden.get(d)!.join(", ")})`).join(" | ")}`,
  );
});

// RICHTUNG 2: keine Registerzeile ohne Verwendung. Ohne diese Hälfte bliebe
// eine Zeile stehen, deren Bild längst von der Seite verschwunden ist, und das
// Register behauptete eine Herkunft für etwas, das niemand mehr sieht.
check("jede Registerzeile wird im Quelltext auch verwendet", () => {
  const verwaist = ZEILEN.map((z) => z.datei).filter((d) => !gefunden.has(d)).sort();
  assert.deepEqual(verwaist, [], `im Register, aber nirgends verwendet: ${verwaist.join(", ")}`);
});

check("jede Registerzeile hat eine Bilddatei im Verzeichnis", () => {
  const fehlt = ZEILEN.map((z) => z.datei).filter(
    (d) => !fs.existsSync(path.join(process.cwd(), "public", "images", d)),
  );
  assert.deepEqual(fehlt, [], `Datei fehlt: ${fehlt.join(", ")}`);
});

// FORM DES NACHWEISES. Die beiden Prüfungen unten sind der Grund, warum das
// Gerüst überhaupt Felder hat: ein Platzhalter, der wie eine Angabe aussieht,
// ist schlechter als eine offene Zeile.
check("eine offene Zeile trägt keinen Nachweis", () => {
  const widerspruch = ZEILEN.filter((z) => z.herkunft === "offen" && z.nachweis !== undefined).map(
    (z) => z.datei,
  );
  assert.deepEqual(
    widerspruch,
    [],
    `als "offen" geführt, trägt aber einen Nachweis: ${widerspruch.join(", ")}`,
  );
});

check("ein vorhandener Nachweis ist nicht leer", () => {
  const leer = ZEILEN.filter((z) => z.nachweis !== undefined && !istBelegt(z.nachweis)).map(
    (z) => z.datei,
  );
  assert.deepEqual(leer, [], `Nachweis vorhanden, aber alle Felder leer: ${leer.join(", ")}`);
});

check("keine doppelte Registerzeile", () => {
  assert.equal(registriert.size, ZEILEN.length, "eine Datei steht mehrfach im Register");
});

check("das Register ist alphabetisch sortiert", () => {
  const ist = ZEILEN.map((z) => z.datei);
  assert.deepEqual(ist, [...ist].sort(), "Register nicht A→Z sortiert");
});

// SICHTBARER STAND, KEINE ZUSICHERUNG. Die Zahl der offenen Zeilen ist der
// Fund, nicht der Fehler — sie darf sinken, ohne dass hier jemand nachzieht.
const offen = ZEILEN.filter((z) => z.herkunft === "offen");
console.log(
  `bild-herkunft: ${pass} passed, ${fail} failed (${ZEILEN.length} Bilder, ${offen.length} ohne dokumentierte Herkunft)`,
);
if (offen.length > 0) {
  console.log(`  noch offen: ${offen.map((z) => z.datei).join(", ")}`);
}
if (fail > 0) process.exit(1);
