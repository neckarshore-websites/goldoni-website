---
name: goldoni-empfehlungskarte
description: Arbeitet eine neue wöchentliche Empfehlungskarte des Ristorante Goldoni vom Inhaber-PDF in das Repo ein — splittet Speisen und Weine sauber in ihre jeweiligen Datenquellen (`empfehlungskarte.json` + `weinempfehlungen.json`), validiert Allergen-Codes gegen `src/lib/codes.ts`, baut + lintet + öffnet einen PR. Nutze diesen Skill IMMER wenn der Inhaber/User eine neue Empfehlungskarte als PDF, Foto oder Text liefert ("neue Empfehlungskarte", "Empfehlungskarte einarbeiten", "Empfehlungskarte aktualisieren", "neue Karte ist da", "ekarte", "neue Wochenkarte"), oder wenn Speisen UND Weine in einem Schwung getauscht werden sollen. Auch dann triggern, wenn der User nur das PDF anhängt ohne weiteren Kontext — ein PDF mit "ekarte" oder "Empfehlung" im Dateinamen ist Indikator genug. Verhindert den klassischen Anti-Pattern-Fehler "alle Items in eine JSON" — Speisen und Weine MÜSSEN in getrennten Dateien gepflegt werden, sonst werden Weine doppelt gerendert.
---

# Goldoni Empfehlungskarte einarbeiten

Wöchentlicher Workflow für das Update der Empfehlungskarte. Inhaber liefert PDF (oder Foto/Text), du übersetzt das in zwei separate JSON-Quellen + öffnest einen PR.

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

Wenn der User ein PDF liefert: mit `Read` oder dem entsprechenden PDF-Reader-Tool öffnen. Wenn nur Text/Foto: User um Klärung bei Mehrdeutigkeiten bitten.

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

Lies `src/lib/codes.ts`. Jeder im PDF referenzierte Code (Buchstabe oder Zahl) muss in `LMIV_ALLERGENS`, `ZZULV_ADDITIVES` oder `HOUSE_CODES` aufgelöst sein. Wenn nicht: **dem User explizit melden** und nachfragen, statt zu raten.

Aktueller Stand der Goldoni-Codes (Stand 2026-04-29):

**LMIV-Allergene** (Buchstaben):
- A Glutenhaltiges Getreide · B Krebstiere · C Eier · D Fische · E Erdnüsse · F Sojabohnen
- G Milch (Laktose) · H Schalenfrüchte · N Sesam · P Lupinen · R Weichtiere

**Goldoni-Hauseigene Allergen-Codes** (statt LMIV-Standard L/M/O):
- I Sellerie (LMIV-Standard wäre L)
- J Senf (LMIV-Standard wäre M)
- S Sulfite (LMIV-Standard wäre O)

**ZZulV-Zusatzstoffe** (Zahlen): 1 Farbstoff · 2 Konservierungsstoff · 3 Antioxidationsmittel · 4 Geschmacksverstärker · 5 Geschwefelt · 6 Geschwärzt · 7 Gewachst · 8 Phosphat · 9 Süßungsmittel · 10 Phenylalaninquelle · 11 Süßungsmittel+Zucker · 12 Chininhaltig · 13 Coffeinhaltig

Wenn das PDF einen Code referenziert der nicht in dieser Liste steht (z.B. "K"): nicht raten — User fragen.

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
      "priceBottle": "30,–",          // String mit Komma + Halbgeviertstrich (–) für Glatte
      "priceGlass": "8,50"            // String mit Komma
    }
  ],
  "rot": [ /* gleiches Schema */ ]
}
```

**Schreibweise-Konventionen** (auf der Live-Site sichtbar):
- Halbgeviertstrich `–` (U+2013) statt Bindestrich `-` für glatte Preise: `"28,–"`, `"30,–"`, `"40,–"`
- Komma als Dezimaltrenner: `"7,50"`, `"8,50"`
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

Allergen-Codes referenzieren codes.ts: A, C, D, ... (LMIV) + I, J, S (Goldoni)
+ 1, 2, 3 (ZZulV).
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

PR mit `gh pr create --base main` öffnen.

## Pitfalls — Lessons Learned

| Stolperstein | Erkennungsmerkmal | Lösung |
|---|---|---|
| Weine in `empfehlungskarte.json` zusätzlich anlegen | Live-Site zeigt zwei Weinlisten untereinander, eine im falschen Layout | Weine ausschliesslich in `weinempfehlungen.json`. Vor Edit: `grep -rln "<wein-name>" src/` |
| Per-Person-Preis als zweiter Price | Schema kennt nur ein `price`-Feld | Hauptpreis in `price`, Per-Person-Hinweis in `description`-String mitführen |
| Allergen-Code "K" oder ähnlich Unbekanntes | Build grün (Type ist `string`), aber Legend zeigt "Hauseigener Code (Bedeutung folgt)" | Vor JSON-Write: User fragen welche Bedeutung der Code hat. Niemals raten. |
| Decimal-Trenner-Mismatch | Speisen-Preis `"15,00"` statt `"15.00"` | Speisen: PUNKT als Decimal. Weine: KOMMA als Decimal (verschiedene Renderer-Konventionen). |
| Halbgeviertstrich `–` vs. Bindestrich `-` bei Wein-Preisen | Inkonsistente Live-Anzeige `28,-` vs `28,–` | Halbgeviertstrich (U+2013) für glatte Preise: `"28,–"`. Komma + Dezimalstellen: `"7,50"`. |
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
- [ ] Vercel Preview-Deploy auf dem PR sichtbar — User kann reviewen
- [ ] User-Bestätigung: "PASS" oder Merge → erst dann ist die Session abgeschlossen
