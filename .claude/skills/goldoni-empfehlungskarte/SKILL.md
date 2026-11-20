---
name: goldoni-empfehlungskarte
description: Arbeitet eine neue wöchentliche Empfehlungskarte des Ristorante Goldoni vom Inhaber-PDF in das Repo ein — splittet Speisen und Weine sauber in ihre jeweiligen Datenquellen (`empfehlungskarte.json` + `weinempfehlungen.json`), validiert Allergen-Codes gegen `src/lib/codes.ts`, baut + lintet + öffnet einen PR. Nutze diesen Skill IMMER wenn der Inhaber/User eine neue Empfehlungskarte als PDF, Foto oder Text liefert ("neue Empfehlungskarte", "Empfehlungskarte einarbeiten", "Empfehlungskarte aktualisieren", "neue Karte ist da", "ekarte", "neue Wochenkarte"), oder wenn Speisen UND Weine in einem Schwung getauscht werden sollen. Auch dann triggern, wenn der User nur das PDF anhängt ohne weiteren Kontext — ein PDF mit "ekarte" oder "Empfehlung" im Dateinamen ist Indikator genug. Verhindert den klassischen Anti-Pattern-Fehler "alle Items in eine JSON" — Speisen und Weine MÜSSEN in getrennten Dateien gepflegt werden, sonst werden Weine doppelt gerendert.
---

# Goldoni Empfehlungskarte einarbeiten

Wöchentlicher Workflow für das Update der Empfehlungskarte. Inhaber liefert PDF (oder Foto/Text), du übersetzt das in zwei separate JSON-Quellen + öffnest einen PR.

## Live first: PR 1 und PR 2

Die Karte geht live, wie der Inhaber sie liefert, Korrekturen folgen in einem zweiten PR (Founder 2026-11-04, geschärft 2026-11-20). Die Regel steht an **einer** Stelle, in Linus' Agentendatei: `~/.claude/agents/linus.md`, Abschnitt `GOLDONI WEEKLY CARD — LIVE FIRST` (Quelle: `neckarshore-ai/dev-environment`, `claude/agents/linus.md`). Dieser Skill kopiert sie nicht, er verweist nur darauf. Was sie für die Schritte unten bedeutet:

- **PR 1** enthält die Karte des Inhabers, auch mit seinen Fehlern. Der Titel beginnt mit `wochenkarte:`. Sobald die Pflicht-Checks grün sind, mergst du ihn selbst. Eine offene Frage hält ihn nicht auf.
- **PR 2** öffnest du direkt danach. Er enthält jede Korrektur und die Fragen an Silvio, und er wartet auf den Founder.
- Überall, wo dieser Skill unten „nicht raten“ oder „User fragen“ sagt, gilt: Die Frage gehört in PR 2, nicht vor PR 1. Welche Lesart PR 1 nimmt, regelt linus.md, Punkt 2.

## Working Directory

Jeder Bash-Call beginnt mit:

```bash
cd ~/Developer/projects/neckarshore-websites/goldoni-website && ...
```

Der Harness resettet `cwd` nach jedem Call. Ohne expliziten `cd` schreibst du in das falsche Repo.

## Die zwei Datenquellen — kritisch zu verstehen

Die `/empfehlungen`-Page rendert aus **zwei** Files. Beide werden auf einer Seite angezeigt, aber von unterschiedlichen Komponenten:

| Datei | Inhalt | Renderer | Layout |
|---|---|---|---|
| `src/data/empfehlungskarte.json` | **Nur Speisen** (Antipasti, Primi, Secondi, Dolci) | `MenuSection` (generic) | Kategorie-Liste mit Allergen-Pills, Quickjump-Anker |
| `src/data/weinempfehlungen.json` | **Nur Weine** (weiß + rot) | `WeinSection` (dediziert) | Diese-Woche-Header, Color-Dots, Bottle/Glass nebeneinander |

> **Anti-Pattern (heute schon einmal passiert, 2026-04-29):** Weine in `empfehlungskarte.json` als zusätzliche Kategorie einbauen. Effekt auf Live-Site: Weine werden DOPPELT gerendert (einmal alt via WeinSection, einmal neu via MenuSection), Format ist unsauber, User-Verwirrung. **Nicht machen.** Weine immer und ausschliesslich in `weinempfehlungen.json`.

Bevor du etwas schreibst, prüfe immer mit `grep -rln "<wein-name-aus-pdf>" src/` ob bereits eine andere Datenquelle für den Begriff existiert.

## Process

### 1. Quelle einlesen

Wenn der User ein PDF liefert: mit `Read` oder dem entsprechenden PDF-Reader-Tool öffnen. Wenn nur Text/Foto: Mehrdeutigkeiten halten die Karte nicht auf. PR 1 nimmt die Lesart nach linus.md, Punkt 2, und die Frage kommt in PR 2.

Pro Item zerlegen in:
- **Speise:** italienischer Name, deutsche Beschreibung, Preis, Allergen-Codes, optional `volume` (z.B. "ca. 1 kg / 2 Personen"), optional `diet` (vegetarian/vegan/spicy)
- **Wein:** Name, Producer, Classification (DOC/IGT/null), Year, Region, Grapes (Rebsorten als String), priceBottle (0,75 l), priceGlass (0,2 l)

#### Umlaut- und ß-Regel (NICHT verhandelbar)

Deutsche Beschreibungen MÜSSEN echte Umlaute und ß verwenden — niemals ASCII-Transliteration:

| Falsch (ASCII) | Richtig |
|---|---|
| `Kaese`, `Granakaese`, `Bueffelmozzarella` | `Käse`, `Granakäse`, `Büffelmozzarella` |
| `Tuermchen`, `Toertchen`, `Truffeleis` | `Türmchen`, `Törtchen`, `Trüffeleis` |
| `geraeuchert`, `geschaelt`, `gefuellt`, `duenn` | `geräuchert`, `geschält`, `gefüllt`, `dünn` |
| `Sosse`, `Heisses`, `weisses` | `Soße`, `Heißes`, `weißes` |
| `fuer`, `gruene`, `Suedtirol`, `Akazienblueten` | `für`, `grüne`, `Südtirol`, `Akazienblüten` |
| `Fruechten`, `Kaeche`, `Aenderungen`, `taeglich` | `Früchten`, `Küche`, `Änderungen`, `täglich` |
| `Olivenoel`, `Meeresfruechte`, `Kaeseteller` | `Olivenöl`, `Meeresfrüchte`, `Käseteller` |
| `Geschmacksverstaerker`, `Suessungsmittel` | `Geschmacksverstärker`, `Süßungsmittel` |

Französische Lehnwörter mit Diakritika sind beizubehalten: `Crème Fraîche` (nicht `Creme Fraiche`), `Café` (nicht `Cafe`), `Pâté` (nicht `Pate`).

Wenn das Inhaber-PDF selbst ASCII-transliteriert ist (alte Microsoft-Word-Vorlagen tun das gerne, oder OCR-Fehler): der Skill MUSS beim Einarbeiten konvertieren. Wir spiegeln das PDF nicht 1:1, wir produzieren publikationsreifen deutschen Text.

Italienische Speisenamen bleiben unverändert (Original-Sprache).

### 2. Allergen-Codes validieren

Lies `src/lib/codes.ts`. Jeder im PDF referenzierte Code (Buchstabe oder Zahl) muss in `ALLERGENS` oder `ADDITIVES` aufgelöst sein. Wenn nicht, gilt linus.md, Punkt 2c: Ein verstümmelter Code, der sich als bekannte Codes lesen lässt, bekommt die Lesart mit mehr Codes, nie die mit weniger. Was sich gar nicht lesen lässt, bleibt in PR 1 weg. Beides meldest du in PR 2 **ausdrücklich** als Frage. `npm run test:codes:unit` prüft das nach dem Eintragen mechanisch.

Codes übernimmst du **genau so, wie sie auf der Karte stehen** — nicht umschlüsseln. Die Legende folgt der gedruckten Karte (Stand 2026-09-17, vom Inhaber als offizielle Bezeichnungen bestätigt):

**Allergene** (Buchstaben): A Glutenhaltig · B Krebstiere · C Eier · D Fisch · E Erdnüsse · F Soja · G Milch · H Schalenfrüchte · I Sellerie · J Senf · K Sesamsamen · L Schwefeldioxid · M Lupinen · N Weichtiere · S Sulfite

**Zusatzstoffe** (Zahlen): 1 Farbstoff · 2 Konservierungsstoff · 3 Antioxidationsmittel · 4 Geschmacksverstärker · 5 Geschwefelt · 6 Geschwärzt · 7 Phosphat · 8 Milcheiweiß · 9 Koffeinhaltig · 10 Chininhaltig · 11 Süßungsmittel · 12 Phenylalaninquelle · 13 Gewachst · 14 Taurin · 15 Nitritpökelsalz

> **Achtung:** Bis 2026-09-17 stand hier ein anderes Schema (N Sesam, P Lupinen, R Weichtiere, „hauseigene Codes“ I/J/S, Zusatzstoffe 7–13 verschoben). Das war falsch. Die Codes an den Gerichten stimmten, die Legende nicht.

Wenn das PDF einen Code referenziert, der nicht in dieser Liste steht (z.B. "T" oder "16"), wird nicht geraten: In PR 1 bleibt der Code weg, und in PR 2 steht die Frage an Silvio.

Nennt der Gerichtsname eine Zutat, für die `tests/delivery/allergen-rules.test.ts` einen Code verlangt, und die Karte gibt ihn nicht an (Beispiel #254: Hummer ohne B), dann bleibt die Karte so, wie sie gedruckt ist. PR 1 trägt in dieser Datei einen datierten Eintrag in die Liste `OFFEN` ein. Die Korrektur kommt in PR 2 (linus.md, Punkt 2a).

### 3. Speisen → `empfehlungskarte.json`

Schema (`src/lib/menu.ts`):

```jsonc
{
  "title": "Empfehlungskarte",
  "intro": "<unverändert lassen — der allgemeine Intro-Text>",
  "updated": "YYYY-MM-DD",          // → heutiges Datum
  "categories": [                    // → IMMER nur diese 4 Speise-Kategorien:
    { "id": "antipasti",     "name": "Antipasti",     "subtitle": "Vorspeisen",     "items": [...] },
    { "id": "primi-pizze",   "name": "Primi & Pizze", "subtitle": "Pasta & Pizza",  "items": [...] },
    { "id": "secondi",       "name": "Secondi Piatti","subtitle": "Hauptgerichte",  "items": [...] },
    { "id": "dolci",         "name": "Dolci",         "subtitle": "Desserts",       "items": [...] }
  ],
  "footnote": "<unverändert lassen — Allergen-Hinweis + MwSt-Hinweis>"
}
```

Item-Schema:

```jsonc
{
  "name": "<italienischer Name vollständig>",
  "description": "<deutsche Übersetzung / Beschreibung>",
  "price": "15.00",                 // Decimal-String mit PUNKT (nicht Komma)
  "allergens": ["A", "G", "2", "3"], // optional, leer wenn keine
  "diet": ["vegetarian"],            // optional: "vegetarian"/"vegan"/"spicy"
  "volume": "ca. 1 kg / 2 Personen"  // optional, für Sharing-Plates wie Bistecca alla Fiorentina
}
```

**Edge-Cases:**
- Sharing-Plate mit zwei Preisen (z.B. "50,- gesamt / 25,- pro Person"): Hauptpreis in `price`, Per-Person-Hinweis in `description` mitführen. Schema kennt nur einen Preis.
- Keine Wein-Kategorie hinzufügen. Niemals.

### 4. Weine → `weinempfehlungen.json`

Schema (siehe `src/components/WeinSection.tsx`):

```jsonc
{
  "weiss": [
    {
      "name": "<Wein-Name z.B. 'Tasca d'Almerita'>",
      "producer": "<Erzeuger z.B. 'Velenosi'>",
      "classification": "DOC",       // oder "IGT", "DOCG", null wenn keine
      "year": 2024,                   // Number, kein String
      "region": "<Region z.B. 'Sizilien'>",
      "grapes": "<Rebsorten als String, z.B. 'Inzolia, Cataratto, Grecanico'>",
      "priceBottle": "30.00",         // Decimal-String mit PUNKT, wie bei den Speisen
      "priceGlass": "8.50"            // Decimal-String mit PUNKT
    }
  ],
  "rot": [ /* gleiches Schema */ ]
}
```

**Schreibweise-Konventionen:**
- **Preise sind überall Decimal-Strings mit Punkt und zwei Stellen** (`"30.00"`, `"8.50"`), für Speisen wie für Weine. Was der Gast liest (`30,00 €`), macht ausschließlich `formatPrice` in `src/lib/price.ts` (Founder-Entscheid 2026-09-23). Steht auf der Karte `30,–` oder `8,50`, wird daraus `"30.00"` und `"8.50"`. `tests/delivery/preise.test.ts` weist jede andere Form ab.
- Producer und Wein-Name getrennt — der Renderer zeigt sie zweizeilig
- Grapes als kommaseparierter String — der Renderer setzt sie kursiv
- Year als JSON-Number, nicht String

### 5. Build + Lint + Verify

```bash
cd ~/Developer/projects/neckarshore-websites/goldoni-website && npm run build && npm run lint
```

Beide müssen grün sein. TypeScript prüft Schema-Konformität gegen `Menu` und `Wine` Types — wenn der Build rot ist, hat das Schema-Drift.

Zusätzlich: prüfe dass alle referenzierten Allergen-Codes auch wirklich in der Legend aufgelöst werden:

```bash
cd ~/Developer/projects/neckarshore-websites/goldoni-website && jq -r '.. | objects | select(.allergens?) | .allergens | .[]' src/data/empfehlungskarte.json | sort -u
```

Jeder Code in der Output-Liste muss in `src/lib/codes.ts` (LMIV / ZZULV / HOUSE) definiert sein.

### 6. Branch + Commit + PR

**Branch-Naming:**
```
linus/YYYY-MM-DD-empfehlungskarte-update
```

Wenn am gleichen Tag mehrere Iterationen: `-b`, `-c` Suffix.

**Workflow:**
```bash
cd ~/Developer/projects/neckarshore-websites/goldoni-website && \
  git checkout main && git pull origin main && \
  git checkout -b linus/YYYY-MM-DD-empfehlungskarte-update
```

**Commit-Message-Pattern:**

```
empfehlungskarte: complete content swap to YYYY-MM-DD update

Vom Inhaber per <Quelle> gelieferte neue Empfehlungskarte ersetzt
komplett die bisherigen Items.

Speisen (empfehlungskarte.json):
- <N> Antipasti → <N> Antipasti
- <N> Primi & Pizze
- <N> Secondi
- <N> Dolci

Weine (weinempfehlungen.json):
- Weiß: <welche neu, welche raus, welche unverändert>
- Rot: <dito>

Allergen-Codes referenzieren codes.ts: A, C, D, ... (Allergene)
+ 1, 2, 3 (Zusatzstoffe).
```

**PR-Body-Template** (passe Inhalte an, nicht Struktur):

```markdown
## Summary

Komplettes Content-Update der Empfehlungskarte vom Inhaber (Quelle: `<dateiname>`).

**Speisen — `src/data/empfehlungskarte.json`:**
- <N>× Antipasti: <Item-Names mit Preisen>
- <N>× Primi & Pizze: ...
- <N>× Secondi: ...
- <N>× Dolci: ...

**Weine — `src/data/weinempfehlungen.json`:**
- Weiß (<N>): <Wein-Names mit Bottle/Glass-Preisen>
- Rot (<N>): <dito>

## Test plan

- [ ] `npm run build` green (verified locally)
- [ ] `npm run lint` green (verified locally)
- [ ] `/empfehlungen` rendert alle Items in den 4 Speise-Kategorien
- [ ] WeinSection zeigt nur die neuen Weine, sauber Weiß/Rot getrennt
- [ ] Sticky-Quickjump-Pills inkl. `Weißweine` + `Rotweine`
- [ ] Allergen-Legend löst alle referenzierten Codes auf
- [ ] Footnote + "Stand: YYYY-MM-DD" korrekt
```

PR 1 mit `gh pr create --base main` öffnen, der Titel beginnt mit `wochenkarte:`. Danach zeigst du die geänderten Dateien (`gh pr diff <n> --name-only`) und wartest auf die Pflicht-Checks (`gh pr checks <n> --watch --required`). Dann mergst du selbst mit `gh pr merge <n> --squash`, nie mit `--admin`. Anschließend öffnest du PR 2 mit den Korrekturen und den Fragen an Silvio.

## Pitfalls — Lessons Learned

| Stolperstein | Erkennungsmerkmal | Lösung |
|---|---|---|
| Weine in `empfehlungskarte.json` zusätzlich anlegen | Live-Site zeigt zwei Weinlisten untereinander, eine im falschen Layout | Weine ausschliesslich in `weinempfehlungen.json`. Vor Edit: `grep -rln "<wein-name>" src/` |
| Per-Person-Preis als zweiter Price | Schema kennt nur ein `price`-Feld | Hauptpreis in `price`, Per-Person-Hinweis in `description`-String mitführen |
| Allergen-Code "T" oder ähnlich Unbekanntes | Build grün (Type ist `string`), aber `npm run test:codes:unit` wird rot und die Legende erklärt den Code nicht | Niemals raten. In PR 1 bleibt der Code weg, in PR 2 steht die Frage, was er bedeutet (linus.md, Punkt 2c). |
| Preis in Kartenschreibweise übernommen | `"15,00"`, `"30,–"` oder `"8,50"` in einer JSON; `npm run test:preise:unit` bzw. der Build wird rot | Speisen UND Weine: Decimal-String mit Punkt, zwei Stellen (`"30.00"`). Bis 2026-11-05 stand hier für Weine fälschlich Komma + Halbgeviertstrich — das galt nur bis zum Founder-Entscheid 2026-09-23. |
| Codes-Comment in `src/lib/menu.ts` ist stale | Skill nennt L/M/O, codes.ts hat I/J/S | Nicht im Skill-Workflow korrigieren — separater Doc-Update-PR. Aber dem User melden falls auffällig. |
| ASCII-Transliteration in deutscher Beschreibung (`Kaese`, `Sosse`, `fuer` …) | Sieht aus wie 1998-OCR; User-Catch 2026-04-30 | Vor PR-Open: Konsistenz-Check unten ausführen. Jeder Hit muss vor Push gefixt sein. Italienische Speisenamen bleiben Original. |

## Konsistenz-Check vor PR

```bash
cd ~/Developer/projects/neckarshore-websites/goldoni-website && \
  echo "--- Empfehlungskarte Kategorien ---" && \
  jq -r '.categories[] | "\(.id): \(.items | length) items"' src/data/empfehlungskarte.json && \
  echo "--- Weine Counts ---" && \
  jq '{weiss: (.weiss | length), rot: (.rot | length)}' src/data/weinempfehlungen.json && \
  echo "--- Used Allergen Codes ---" && \
  jq -r '.. | objects | select(.allergens?) | .allergens | .[]' src/data/empfehlungskarte.json | sort -u | tr '\n' ' ' && echo && \
  echo "--- Transliteration-Check (muss leer sein) ---" && \
  rg -n '\b(fuer|ueber|koennen|moegen|moeglich|zurueck|gaeste|gueltig|pruefen|auswaehlen|persoenlich|uebermitt|naechst|spaeter|laesst|erhaelt|woechentl|naehere|hoeflich|tatsaechl|empfaeng|aehnlich|zusaetzl|ergaenz|verstaendl|gegenueber|fruehz|gruessen|wuensch|kaese|vorzueg|haelt|faellt|laeuft|haetten|waeren|moecht|begruess|qualitaet|aktivitaet|spezialitaet|gemuetlich|baerlauch|verkaeufer|enttaeusch|tortenstueck|tuermchen|geraeuchert|duenn|akazienblueten|granakaese|bueffel|geschaelten|verfuegbar|atmosphaere|getraenke|menue|gaesteanzahl|aenderung|gefuellt|trueffel|sosse|olivenoel|suedtirol|fruechten|gemuese|taeglich|kaeseteller|heisses|weisses|grosse|aenderungen|saeumen)\b' src/data/empfehlungskarte.json src/data/weinempfehlungen.json && echo "ASCII-Hits gefunden — muessen vor PR gefixt werden" || echo "OK — keine ASCII-Transliteration"
```

Sollte zeigen:
- 4 Kategorien (antipasti, primi-pizze, secondi, dolci) — keine Wein-Kategorie
- weiss + rot Counts entsprechen dem PDF
- Alle Codes in der LMIV/ZZulV/HOUSE-Whitelist (siehe oben)
- Transliteration-Check: "OK — keine ASCII-Transliteration" (jeder Hit ist ein Blocker für den PR)

## Definition of Done

- [ ] PDF/Quelle vollständig in beide JSONs übersetzt
- [ ] Deutsche Beschreibungen verwenden echte Umlaute + ß (siehe Process §1)
- [ ] `npm run build` grün
- [ ] `npm run lint` grün
- [ ] Konsistenz-Check (oben) zeigt: erwartete Counts + nur whitelisted Codes + "OK — keine ASCII-Transliteration"
- [ ] Branch gepusht
- [ ] PR auf `main` geöffnet, Test-Plan + Body-Template gefüllt
- [ ] PR 1 ist auf grünen Pflicht-Checks selbst gemergt, die Karte ist live (linus.md, `GOLDONI WEEKLY CARD — LIVE FIRST`)
- [ ] PR 2 mit allen Korrekturen, Abweichungen und Fragen an Silvio ist geöffnet und wartet auf den Founder
- [ ] Wird der Merge von PR 1 verweigert, wird das nicht umgangen: die Verweigerung kommt in den Report, der Founder mergt
