# Bierdeckel — Entwurfsstand 2026-08-25

Alternative zur [Postkarte](../postkarte/README.md), auf Wunsch des Betreibers.
Gleicher Auftrag, anderes Medium: Gäste auf die eigene Bestellseite bringen.

> **Warning:** Noch nicht freigegeben, noch keine Druckdaten. Die offenen
> Punkte stehen unter [Vor dem Druck](#vor-dem-druck).

## Warum ein Bierdeckel neben der Postkarte steht

Die beiden treffen verschiedene Gäste. Die Postkarte reist mit der Lieferung
nach Hause und landet im besten Fall am Kühlschrank. Der Bierdeckel liegt auf
dem Tisch **im Restaurant**, unter einem Glas, und wird dort minutenlang
angesehen — von Gästen, die gerade da sind und beim nächsten Mal vielleicht
bestellen statt zu kommen. Beides schliesst sich nicht aus.

## Format

| Angabe | Wert |
|--------|------|
| Endformat | Sechseck, 93 × 81 mm |
| Exakte Höhe | 80,54 mm |
| Datenformat | 100 × 87 mm |
| Beschnitt | 3 mm umlaufend |
| Material | 1,5 mm Bierdeckelpappe, kompostierbar |
| Druck | 4/4-farbig |
| QR gedruckt | ca. 33 mm Kantenlänge |

**Die 81 mm sind gerundet, und das ist kein Detail.** Ein regelmässiges
Sechseck mit 93 mm von Spitze zu Spitze ist 93 · √3/2 = **80,54 mm** hoch. Die
Zeichnung arbeitet mit dem exakten Wert; wer 81,0 mm einsetzt, staucht das
Sechseck um einen halben Millimeter und die Stanze passt nicht mehr zur Datei.
Die flache Kante oben misst genau eine Seitenlänge, 46,5 mm — deshalb liegen
die Eckpunkte der Kontur bei 25 % und 75 % der Breite.

## Die Gestaltung

| Seite | Grund | Inhalt |
|-------|-------|--------|
| Vorne | Espresso | Wortmarke, Adresse. Sonst nichts |
| Hinten | Olive | „Direkt bei uns bestellen.", QR-Code, ein Satz |

Farben aus der Tavola-Palette in `src/app/globals.css`, dieselben wie auf der
Postkarte. Auf 93 mm ist Zurückhaltung keine Geschmacksfrage: was ein Gast
unter einem Bierglas erkennen soll, darf nicht aus vier Zeilen bestehen.

**Alles Wichtige liegt in einem Rechteck von 58 % der Breite.** Ein Sechseck
verliert an vier Ecken Fläche, und Stanzen laufen um ein bis zwei Millimeter.
Text, der die Schrägen ausreizt, ist der Text, der abgeschnitten wird.

## Der QR-Code

Derselbe wie auf der Postkarte, aus `docs/postkarte/qr-A.svg` — erzeugt aus
`STOREFRONT_PARTNER.url` in `src/lib/site.ts` und beim Erzeugen wieder
eingelesen und mit der URL verglichen. Fehlerkorrektur H, 49 × 49 Module.
Ein Bierdeckel bekommt Flecken; Fehlerkorrektur H verträgt sie.

## Vor dem Druck

1. **QR-Module in reinem Schwarz** (nur K). Wie bei der Postkarte: an
   Modulkanten kostet jede Passerdifferenz Lesbarkeit.
2. **Olive als Proof prüfen.** Vollflächig auf ungestrichener, saugender
   Bierdeckelpappe fällt jeder Farbton dunkler und stumpfer aus als auf
   gestrichenem Papier. Ein Bildschirm beantwortet das nicht.
3. **Stanzkontur als eigene Ebene** liefern, nicht als gedruckte Linie.

## Reproduzieren

```bash
npx tsx docs/postkarte/qr.ts          # QR erzeugen + Dekodierung prüfen
node docs/bierdeckel/build.mjs --pdf  # print.html + PDF
```

`print.html` ist erzeugt und nicht eingecheckt; das PDF liegt als
weitergabefähiges Ergebnis bei. Der Kontrollbogen zeigt beide Seiten in
**echter Grösse** — ausdrucken, ausschneiden, unter ein Glas legen.

## Offen

Die Wahl zwischen Postkarte und Bierdeckel — oder beides. Und die Auflage.
Beides entscheidet der Betreiber.
