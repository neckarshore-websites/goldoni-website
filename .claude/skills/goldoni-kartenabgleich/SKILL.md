---
name: goldoni-kartenabgleich
description: Gleicht eine GEDRUCKTE Goldoni-Karte (Foto, PDF, Scan) gegen die Legende und die Gerichtsdaten im Repo ab und erzeugt die Fragenliste für den Inhaber. Nutze diesen Skill IMMER wenn eine neue oder geänderte gedruckte Karte hereinkommt ("neue Speisekarte", "Karte vom Inhaber", "Legende geändert", "Allergene prüfen", "Kartenabgleich", "stimmen die Codes noch"), oder bevor eine Empfehlungskarte eingearbeitet wird und unklar ist, ob die Legende noch dieselbe ist. Erzeugt NUR Fragen — er schreibt keine Datenquelle, er prüft nichts auf LMIV-Konformität und er beantwortet nichts. Nicht nutzen, um eine Wochenkarte einzuarbeiten, das ist goldoni-empfehlungskarte.
---

# Goldoni Kartenabgleich

## Wozu es diesen Skill gibt

Am 2026-09-17 stellte sich heraus: die Codes auf den Gerichten folgten seit jeher der gedruckten Karte, die Legende auf der Website folgte einem anderen Schema. 21 Code-Verweise auf 19 Gerichten lösten für Gäste zu einer falschen Bedeutung auf — `N` hiess auf der Karte "Weichtiere" und online "Sesam", ausgerechnet auf vier Meeresfrüchte-Gerichten.

Gefunden wurde das von Hand, in einer Sitzung, die eigentlich etwas anderes vorhatte. Dieser Skill ist die Wiederholbarkeit dieses einen Handgriffs — nicht mehr.

## Was der Skill NICHT tut

Das ist der wichtigere Teil der Beschreibung.

1. **Er prüft nicht auf LMIV-Konformität.** Er darf das Ergebnis nirgends so nennen. Formuliere nie "LMIV-konform geprüft", "Allergene sind korrekt" oder "Karte ist sauber". Der zulässige Satz lautet: *"diese Punkte müssen geklärt werden."*
2. **Er schreibt keine Datenquelle.** `speisekarte.json`, `empfehlungskarte.json`, `codes.ts` werden von diesem Skill nicht angefasst. Eine Änderung folgt erst der Antwort des Inhabers, und die trägt ein Mensch ein.
3. **Er entscheidet nichts.** Jede Abweichung wird als Frage ausgegeben, nie als Feststellung. Ob ein Gericht rohes Ei enthält, weiss die Küche — nicht das Repo und nicht du.

## Was der Skill nicht selbst weiss

Die Regeln stehen nicht im Skill, und das ist Absicht. Der Fehler vom 2026-09-17 hatte einen zweiten Teil: der Skill `goldoni-empfehlungskarte` trug **eine eigene Kopie** der Code-Zuordnung mit sich und hätte die nächste Wochenkarte wieder falsch aufgebaut. Eine abgeschriebene Regel veraltet, sobald die Quelle sich bewegt.

Deshalb:

| Wissen | Wohnt in | Skill-Zugriff |
|---|---|---|
| Code → Bedeutung | `src/lib/codes.ts` | importiert |
| Jeder Code auf einem Gericht löst auf | `tests/delivery/menu-codes.test.ts` | aufgerufen |
| Zutat im Namen → Code muss stehen | `tests/delivery/allergen-rules.test.ts` | aufgerufen |

Schreibe **keine** dieser Regeln in diese Datei. Wenn dir hier eine Regelliste fehlt, ist das kein Mangel des Skills.

## Working Directory

Jeder Bash-Call beginnt mit:

```bash
cd ~/Developer/projects/neckarshore-websites/goldoni-website && ...
```

Der Harness setzt `cwd` nach jedem Call zurück.

## Ablauf

### 1. Legende abschreiben — der einzige Schritt, den niemand nachprüfen kann

Lies das Foto/PDF und schreibe **nur den Legendenblock** ab, eine Zeile je Code, so wie er dasteht:

```
# Quelle: IMG_2115, Foto vom 2026-09-17
A Glutenhaltig
...
9 Koffeinhaltig
```

Trennzeichen sind egal (`A Text`, `A) Text`, `10. Text`), `#`-Zeilen und Leerzeilen werden übersprungen.

> **Important:** Das ist die eine Stelle, an der ein Lesefehler alles Folgende verfälscht, und keine Maschine merkt es. Deshalb gibt Abschnitt 1 der Ausgabe die eingelesene Liste vollständig zurück. **Lege sie neben das Foto und lies sie gegen, bevor du Abschnitt 2 überhaupt liest.** Erst danach ist der Rest etwas wert.

### 2. Abgleich laufen lassen

```bash
cd ~/Developer/projects/neckarshore-websites/goldoni-website && npx tsx scripts/kartenabgleich.ts <abschrift.txt>
```

Die Ausgabe ist fertiges Markdown mit fünf Abschnitten: eingelesene Abschrift · Unterschiede zur Repo-Legende · Ergebnis des Code-Tors · Ergebnis des Zutat-Tors · Zahl der offenen Punkte.

### 3. Fragenliste übergeben

Gib die Ausgabe unverändert weiter — an den Founder für das Gespräch mit dem Inhaber, oder als Kommentar an einen PR. Formuliere die Punkte als Fragen. Keine Empfehlung, welche Antwort richtig ist, ausser die Rechtslage gibt sie eindeutig her; dann nenne die Fundstelle (LMIV Anhang II, LMZDV § 5) statt sie zu behaupten.

### 4. Erst nach der Antwort ändern

Kommt eine Antwort, ist das ein **eigener** Vorgang: Datenquelle ändern, beide Tore laufen lassen, PR. Der Inhaber merged nichts, der Founder merged.

## Prüfungen

- `npm run test:kartenabgleich:unit` — Selbsttest des Skripts (Abschrift zerlegen, Legenden vergleichen). Enthält den echten Vorfall als Testfall: `N` "Weichtiere" gegen `N` "Sesam" **muss** als Abweichung erscheinen.
- `npm run test:codes:unit` und `npm run test:allergene:unit` — die beiden Tore, die der Skill aufruft. Laufen ohnehin im CI.
