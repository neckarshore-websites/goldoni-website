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
| Endformat | Sechseck, maximale Bemassung 93 × 81 mm |
| Datenformat | 99 × 87 mm |
| Beschnitt | 3 mm, im Datenformat enthalten |
| Sicherheitsabstand | 6 mm, **ab Datenformat** |
| Stanzform | frei — kommt vom Werkzeug, nicht aus der Datei |
| Material | 1,5 mm Bierdeckelpappe, kompostierbar |
| Druck | 4/4-farbig |
| QR gedruckt | ca. 33 mm Kantenlänge |

Quelle: Datenblatt und Vorlage der Druckerei, beide gegengelesen und die
Vorlage nachgemessen (280,63 × 246,614 pt = exakt 99 × 87 mm).

> **Warning:** Die erste Fassung dieses Dokuments nannte 100 × 87 mm und
> einen Beschnitt „umlaufend" zusätzlich zum Endformat. Beides war
> geschätzt, nicht gelesen — das Datenformat ist **99 × 87 mm** und der
> Beschnitt ist darin bereits enthalten. Der Sicherheitsabstand ist mit
> 6 mm doppelt so gross wie bei der Postkarte und wird ausserdem vom
> Datenformat aus gemessen, nicht von der Schnittkante.

**Die 81 mm sind gerundet — für den Kontrollbogen relevant, für die
Druckdatei nicht.** Ein regelmässiges Sechseck mit 93 mm von Spitze zu Spitze
ist 93 · √3/2 = **80,54 mm** hoch; die Druckerei nennt 81. Der Kontrollbogen
zeichnet 80,54, damit die ausgeschnittene Papierform stimmt.

**Die Druckdatei zeichnet gar kein Sechseck.** Das ist der Punkt, an dem die
erste Fassung falsch gedacht war: bei einer freien Stanzform liefert man ein
randloses Rechteck im Datenformat, und die Form entsteht am Werkzeug. Eine
mitgelieferte Kontur wäre entweder gedruckte Linie oder Anlass zur Rückfrage.

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
