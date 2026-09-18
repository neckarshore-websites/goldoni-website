/**
 * Goldoni — Kartenabgleich.
 *
 * Vergleicht die Legende einer GEDRUCKTEN Karte mit der Legende im Repo
 * (src/lib/codes.ts) und stellt die Fragen zusammen, die dem Inhaber vorgelegt
 * werden muessen.
 *
 * WAS DIESES SKRIPT NICHT TUT, und das ist keine Bescheidenheitsformel:
 * Es prueft NICHT auf Konformitaet mit der LMIV. Es schreibt NICHTS in die
 * Datenquellen. Es entscheidet NICHTS. Es liest zwei Listen, nennt die
 * Unterschiede und gibt sie als Fragen aus. Ob eine Angabe richtig ist, weiss
 * nur die Kueche.
 *
 * Die Regeln stehen NICHT hier. Der Abgleich Gericht-gegen-Regel liegt in
 * tests/delivery/allergen-rules.test.ts, die Code-Aufloesung in
 * tests/delivery/menu-codes.test.ts. Dieses Skript RUFT beide auf und formatiert
 * ihre Ausgabe. Eine zweite Kopie der Regeln waere genau der Fehler vom
 * 2026-09-17: ein Skill, der eine veraltete Zuordnung mit sich trug.
 *
 * Aufruf:
 *   npx tsx scripts/kartenabgleich.ts <abschrift.txt>
 *
 * Format der Abschrift (eine Zeile je Code, so wie er GEDRUCKT dasteht):
 *   A  Glutenhaltig
 *   1  Farbstoff
 * Leerzeilen und Zeilen, die mit # beginnen, werden ignoriert.
 */

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { ALLERGENS, ADDITIVES, type Code } from "../src/lib/codes";

export interface Abweichung {
  art: "nur-druck" | "nur-repo" | "andere-bedeutung";
  code: string;
  druck?: string;
  repo?: string;
}

/** Zerlegt eine Abschrift in Code -> Bedeutung. Exportiert fuer den Selbsttest. */
export function parseAbschrift(text: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^([A-Za-z]|\d{1,2})[).\s]+(.+)$/);
    if (!m) continue;
    out.set(m[1].toUpperCase(), m[2].trim());
  }
  return out;
}

/** Vergleicht zwei Legenden. Gross-/Kleinschreibung der Bedeutung zaehlt nicht. */
export function vergleiche(druck: Map<string, string>, repo: Code[]): Abweichung[] {
  const repoMap = new Map(repo.map((c) => [c.code.toUpperCase(), c.name]));
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
  const ab: Abweichung[] = [];
  for (const [code, name] of druck) {
    const r = repoMap.get(code);
    if (r === undefined) ab.push({ art: "nur-druck", code, druck: name });
    else if (norm(r) !== norm(name)) ab.push({ art: "andere-bedeutung", code, druck: name, repo: r });
  }
  for (const [code, name] of repoMap) {
    if (!druck.has(code)) ab.push({ art: "nur-repo", code, repo: name });
  }
  return ab;
}

function tor(script: string): string {
  try {
    return execFileSync("npm", ["run", "--silent", script], { encoding: "utf8" }).trim();
  } catch (e) {
    const err = e as { stdout?: string; stderr?: string };
    return `TOR ROT:\n${(err.stdout ?? "") + (err.stderr ?? "")}`.trim();
  }
}

function main(): void {
  const pfad = process.argv[2];
  if (!pfad) {
    console.error("Aufruf: npx tsx scripts/kartenabgleich.ts <abschrift.txt>");
    process.exit(2);
  }
  const druck = parseAbschrift(readFileSync(pfad, "utf8"));
  const ab = vergleiche(druck, [...ALLERGENS, ...ADDITIVES]);

  const zeilen: string[] = [];
  zeilen.push(`# Kartenabgleich — ${new Date().toISOString().slice(0, 10)}`);
  zeilen.push("");
  zeilen.push(
    "Dies ist **keine** Konformitaetspruefung. Das Skript vergleicht die Abschrift der " +
      "gedruckten Karte mit der Legende im Repo und listet auf, was zu klaeren ist. " +
      "Beantwortet wird das in der Kueche, nicht hier.",
  );
  zeilen.push("");
  zeilen.push(`## 1. Abschrift gegenlesen (${druck.size} Codes eingelesen)`);
  zeilen.push("");
  zeilen.push("Bevor irgendetwas hiervon gilt: diese Liste gegen das Foto halten. Was hier falsch");
  zeilen.push("eingelesen wurde, ist ab Abschnitt 2 falsch weitergerechnet.");
  zeilen.push("");
  for (const [code, name] of druck) zeilen.push(`- \`${code}\` — ${name}`);
  zeilen.push("");
  zeilen.push("## 2. Unterschiede zur Legende im Repo");
  zeilen.push("");
  if (ab.length === 0) {
    zeilen.push("Keine. Druck und Repo sagen bei jedem Code dasselbe.");
  } else {
    zeilen.push("| Code | auf der Karte | im Repo | Frage |");
    zeilen.push("|---|---|---|---|");
    for (const a of ab) {
      if (a.art === "andere-bedeutung")
        zeilen.push(`| \`${a.code}\` | ${a.druck} | ${a.repo} | Welche Bedeutung gilt? |`);
      if (a.art === "nur-druck")
        zeilen.push(`| \`${a.code}\` | ${a.druck} | — | Fehlt im Repo. Aufnehmen? |`);
      if (a.art === "nur-repo")
        zeilen.push(`| \`${a.code}\` | — | ${a.repo} | Steht nicht mehr auf der Karte. Entfallen? |`);
    }
  }
  zeilen.push("");
  zeilen.push("## 3. Codes auf den Gerichten (tests/delivery/menu-codes.test.ts)");
  zeilen.push("");
  zeilen.push("```");
  zeilen.push(tor("test:codes:unit"));
  zeilen.push("```");
  zeilen.push("");
  zeilen.push("## 4. Zutat im Namen ohne Code (tests/delivery/allergen-rules.test.ts)");
  zeilen.push("");
  zeilen.push("```");
  const regelTor = tor("test:allergene:unit");
  zeilen.push(regelTor);
  zeilen.push("```");
  zeilen.push("");
  zeilen.push("## 5. Was der Inhaber entscheidet");
  zeilen.push("");
  const fragen = ab.length + (regelTor.match(/^offen  -/gm)?.length ?? 0);
  zeilen.push(`Offene Punkte aus 2. und 4.: **${fragen}**. Jeder davon ist eine Frage an die`);
  zeilen.push("Kueche, keine Feststellung. Erst die Antwort aendert eine Datenquelle.");
  console.log(zeilen.join("\n"));
}

if (process.argv[1]?.endsWith("kartenabgleich.ts")) main();
