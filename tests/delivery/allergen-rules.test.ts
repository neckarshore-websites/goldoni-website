import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ALLERGENS } from "../../src/lib/codes";

/**
 * Prueft das Offensichtliche: Wenn der Name eines Gerichts eine Zutat nennt, die ein
 * kennzeichnungspflichtiges Allergen IST, muss der zugehoerige Code am Gericht stehen.
 *
 * WAS DIESE PRUEFUNG NICHT IST. Sie sagt nicht, ob ein Gericht LMIV-konform gekennzeichnet
 * ist. Was in der Kueche in den Topf kommt, steht in keinem Gerichtsnamen — Sellerie in der
 * Marinade, Senf im Dressing, Weizen im Bindemittel sieht hier niemand. Das bleibt Aufgabe
 * des Inhabers. Geprueft wird nur, was aus dem Namen selbst mit Sicherheit folgt:
 * wo Mozzarella drauf steht, muss G stehen.
 *
 * REGELQUELLE. Die Zuordnung Zutat -> Code folgt LMIV Anhang II (Verordnung (EU) 1169/2011).
 * Nr. 8 "Schalenfruechte" ist dort eine ABSCHLIESSENDE Liste: Mandeln, Haselnuesse, Walnuesse,
 * Kaschunuesse, Pecannuesse, Paranuesse, Pistazien, Macadamia. Pinienkerne stehen NICHT darin,
 * deshalb gibt es hier keine Regel "pinoli -> H" — eine solche Regel wuerde eine Pflicht
 * behaupten, die die Verordnung nicht kennt.
 *
 * ZWEI LISTEN, UND DER UNTERSCHIED IST WICHTIG.
 *   AUSNAHMEN — geklaert, trifft nicht zu, mit Begruendung. Wird uebersprungen.
 *   OFFEN     — Frage an die Kueche, noch unbeantwortet, mit Datum. Wird GEZAEHLT und
 *               ausgegeben, laesst die Pruefung aber nicht fehlschlagen.
 * Ein Eintrag in OFFEN ist eine offene Frage, keine Erledigung. Die Zahl soll sinken.
 * Ein Fund, der in KEINER der beiden Listen steht, laesst die Pruefung fehlschlagen —
 * so kann keine neue Luecke unbemerkt in die Karte wandern.
 */

type Rule = { code: string; words: string[]; why: string };

/** Zutat im Namen -> Pflicht-Code. Nur Faelle, die aus dem Namen sicher folgen. */
const RULES: Rule[] = [
  { code: "A", why: "LMIV Anhang II Nr. 1 — glutenhaltiges Getreide",
    words: ["pizza", "pasta", "tagliatelle", "ravioli", "lasagna", "tortellacci", "pappardelle", "sombreri", "gnocchi", "weizen", "brot"] },
  { code: "B", why: "Nr. 2 — Krebstiere",
    words: ["gamberoni", "gamberi", "scampi", "aragosta", "granchio", "garnele", "garnelen"] },
  { code: "C", why: "Nr. 3 — Eier",
    words: ["uova", "frittata", "zabaione", "soufflé", "tiramisù", "tiramisu"] },
  { code: "D", why: "Nr. 4 — Fische",
    words: ["salmone", "tonno", "tonnata", "tonnato", "acciughe", "rombo", "branzino", "baccalà", "orata", "pescatrice", "lachs", "thunfisch", "seeteufel", "goldbrassefilets"] },
  { code: "E", why: "Nr. 5 — Erdnuesse", words: ["arachidi", "erdnuss", "erdnüsse"] },
  { code: "F", why: "Nr. 6 — Sojabohnen", words: ["soia", "soja"] },
  { code: "G", why: "Nr. 7 — Milch",
    words: ["mozzarella", "bufala", "burrata", "ricotta", "scamorza", "gorgonzola", "grana", "parmigiano", "caprino", "mascarpone", "panna", "burro", "formaggio", "latte", "cappuccino", "käse", "sahne"] },
  { code: "H", why: "Nr. 8 — Schalenfruechte, abschliessende Liste der Verordnung",
    words: ["mandorle", "mandeln", "nocciole", "haselnuss", "noci", "walnuss", "anacardi", "cashew", "pecan", "paranuss", "pistacchio", "pistazien", "pistazieneis", "macadamia"] },
  { code: "I", why: "Nr. 9 — Sellerie", words: ["sedano", "sellerie"] },
  { code: "J", why: "Nr. 10 — Senf", words: ["senape", "senf"] },
  { code: "K", why: "Nr. 11 — Sesamsamen", words: ["sesamo", "sesam"] },
  { code: "M", why: "Nr. 13 — Lupinen", words: ["lupini", "lupinen"] },
  { code: "N", why: "Nr. 14 — Weichtiere",
    words: ["vongole", "cozze", "capesante", "polpo", "seppia", "muscheln", "jakobsmuscheln", "tintenfisch"] },
];

/** Geklaert: Regel trifft hier nicht zu. */
const AUSNAHMEN: { item: string; code: string; grund: string }[] = [];

/** Offene Frage an die Kueche. Datum = seit wann sie offen ist. */
const OFFEN: { item: string; code: string; seit: string; frage: string }[] = [
  { item: "Tiramisù", code: "C", seit: "2026-09-17",
    frage: "Klassisch mit rohem Ei zubereitet? Dann fehlt C." },
];

/** Benannte Pruefungen, damit die Suite zaehlbar ist (#145) und Fehlschlaege einen Namen tragen. */
let checks = 0;
function check(name: string, fn: () => void): void {
  fn();
  checks++;
  console.log(`ok - ${name}`);
}

const known = new Set(ALLERGENS.map((c) => c.code));
check("jede Regel nutzt einen Code, den die Legende kennt", () => {
  for (const r of RULES) assert.ok(known.has(r.code), `Regel nutzt unbekannten Code ${r.code}`);
});

type Found = { item: string; code: string; word: string; why: string; file: string };
const items: { name: string; codes: string[]; file: string }[] = [];
const collect = (node: unknown, file: string) => {
  if (Array.isArray(node)) return node.forEach((n) => collect(n, file));
  if (!node || typeof node !== "object") return;
  const o = node as Record<string, unknown>;
  if (typeof o.name === "string" && Array.isArray(o.allergens)) {
    items.push({ name: o.name, codes: o.allergens.map(String), file });
  }
  for (const v of Object.values(o)) collect(v, file);
};
for (const f of ["speisekarte.json", "empfehlungskarte.json"]) {
  collect(JSON.parse(readFileSync(join(process.cwd(), "src/data", f), "utf8")), f);
}

const hits: Found[] = [];
let erfuellt = 0;
for (const it of items) {
  const name = it.name.toLowerCase();
  for (const rule of RULES) {
    const match = rule.words.some((w) => new RegExp(`(^|[^\\p{L}])${w}([^\\p{L}]|$)`, "u").test(name));
    if (match && it.codes.includes(rule.code)) erfuellt++;
    if (it.codes.includes(rule.code)) continue;
    const word = rule.words.find((w) => new RegExp(`(^|[^\\p{L}])${w}([^\\p{L}]|$)`, "u").test(name));
    if (word) hits.push({ item: it.name, code: rule.code, word, why: rule.why, file: it.file });
  }
}

const key = (h: { item: string; code: string }) => `${h.item}|${h.code}`;
const excused = new Set(AUSNAHMEN.map(key));
const open = new Set(OFFEN.map(key));
const neu = hits.filter((h) => !excused.has(key(h)) && !open.has(key(h)));

console.log(`geprueft: ${items.length} Gerichte, ${RULES.length} Regeln, ${erfuellt} Treffer bereits korrekt gekennzeichnet`);
for (const o of OFFEN) console.log(`offen  - ${o.item}: Code ${o.code} fehlt (seit ${o.seit}) — ${o.frage}`);
console.log(`offene Fragen an die Kueche: ${OFFEN.length}`);

const stale = OFFEN.filter((o) => !hits.some((h) => key(h) === key(o)));
check("kein OFFEN-Eintrag ohne Fund (erledigte gehoeren aus der Liste)", () => {
  assert.deepEqual(
    stale.map(key), [],
    `OFFEN-Eintraege ohne Fund — erledigt, bitte aus der Liste nehmen:\n${stale.map(key).join("\n")}`,
  );
});
check("genug Gerichte gelesen (Datenformat unveraendert)", () => {
  assert.ok(items.length > 40, "zu wenige Gerichte gelesen — Datenformat geaendert?");
});
check("die Regeln greifen ueberhaupt", () => {
  assert.ok(erfuellt > 30, "Regeln greifen kaum — Wortlisten oder Datenformat pruefen");
});
check("keine neue Kennzeichnungsluecke", () => {
  assert.deepEqual(
    neu.map((h) => `${h.file}: ${h.item} -> Code ${h.code} fehlt (Wort "${h.word}", ${h.why})`),
    [],
    "neue Kennzeichnungsluecke gefunden",
  );
});

console.log(`\n${checks} checks passed`);
console.log(`${checks} passed, 0 failed`);
