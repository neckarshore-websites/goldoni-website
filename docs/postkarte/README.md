# Postkarte — Entwurfsstand 2026-07-26

Zwei Entwürfe für eine Postkarte, die den Wolt-Lieferungen beiliegt und im
Restaurant ausliegt. **Noch nicht freigegeben, noch keine Druckdaten.**

> **Warning:** Nichts hier ist für einen Drucker bestimmt. Vor jedem Handoff
> sind die drei offenen Punkte unter [Vor dem Druck](#vor-dem-druck) zu klären.

## Auftrag

Die Karte hat eine Aufgabe: Gäste auf die Wolt-Storefront bringen. Über den
Marktplatz kostet eine Bestellung rund 30 % Provision, über die Storefront
16 % mit Wolt-Kurier und 3,5 % bei Abholung. Jeder Gast, der wechselt, ist der
Unterschied zwischen diesen Zahlen — Abholung ist die Kür, die Storefront
überhaupt ist der Grundgewinn.

Die Vorderseite lädt ein, die Rückseite lässt bestellen.

## Format

| Angabe | Wert |
|--------|------|
| Endformat | 210 × 148 mm (DIN A5 quer) |
| Datenformat | 216 × 154 mm |
| Beschnitt | 3 mm umlaufend |
| Sicherheitsabstand | 3 mm ab Endformat |
| Druck | 4/4-farbig |
| QR gedruckt | ca. 51 mm Kantenlänge, gut 1 mm je Modul |

Aus der Vorlage von wir-machen-druck ausgelesen, nicht geschätzt.

## Die beiden Entwürfe

| | Vorderseite | Rückseite | Headline vorn |
|---|---|---|---|
| **A** | Espresso | **Olive** — leise | „Italienisch verliebt." |
| **B** | Espresso | **Marinara** — laut | „Italienisch verliebte Küche." |

Beide Rückseiten tragen denselben Text. Getestet wird, ob Zurückhaltung oder
Auffälligkeit gewinnt — in einer Papiertüte zwischen Pizzakartons ist das keine
Geschmacksfrage.

Farben ausschließlich aus der Tavola-Palette in `src/app/globals.css`.
Olive ist keine Erfindung: `--color-bg-olive` steht dort bereits zusammen mit
`--color-on-olive` als vollflächiges Farbfeld. Gemessen ergibt Mozzarella auf
Olive 5,5:1, Parmigiano 4,8:1. Der cremefarbene Tan-Ton kommt dort nur auf
2,9:1 und wird auf Olive deshalb nicht verwendet.

## Getroffene Entscheidungen

1. **Keine Öffnungszeiten auf der Karte.** Sonntag wurde am 2026-07-26 geändert,
   ab 3. August ist drei Wochen geschlossen. Papier lernt das nicht nach.
2. **Nur der eigene Bestellweg.** Kein Uber Eats, kein zweiter Kanal.
3. **Kein Papier-Gutschein.** Ein Gutschein, den man abgibt, vernichtet die
   Karte, die am Kühlschrank hängen bleiben soll. Anreize laufen als
   Wolt-Kampagne im Portal — damit ist der Druck auch unabhängig davon, wann
   die Kampagne wechselt.
4. **Adresse nur auf der Vorderseite.** Bekannter Nebeneffekt: der Abholsatz
   steht hinten, die Straße vorn.
5. **Headline steht neben dem QR, nicht darüber.** Eine Variante mit ganzbreiter
   Headline wurde gebaut und verworfen.
6. **Kein Wort über Gebühren oder Provisionen.** Abholung wird damit begründet,
   dass sie schnell ist, nicht dass sie billig ist.

### Zwei Formulierungen, die korrigiert wurden

**„Unsere eigene Bestellseite" war sachlich falsch.** Die Storefront ist Wolts
White-Label-Produkt auf `order.site` — sie trägt Namen und Karte des Hauses, ist
aber keine eigene Seite. Die Formulierung stammte aus der internen
Kanal-Dokumentation, wo sie den Kanal gegen den Marktplatz abgrenzt; als
Gästetext wird daraus eine Behauptung, die nicht hält.

**„Auf dem Heimweg abholen" war zu eng.** Es deckte nur den ab, der ohnehin
vorbeifährt, nicht den, der schon zu Hause sitzt und noch einmal rausgeht.
„Kurz vorbeikommen" trägt beide.

## Der QR-Code

Erzeugt aus `STOREFRONT_PARTNER.url` in `src/lib/site.ts` — derselben Konstante,
auf die der Bestell-Button der Website zeigt. Fehlerkorrektur H, Ruhezone
4 Module, runde Module, eigene Suchmuster, Emblem in der Mitte auf 2 % der
Codefläche.

`qr.ts` rastert die gestylte Geometrie und liest sie mit jsQR zurück. Das ist
kein Zierrat: Gestaltung heißt hier, den Code absichtlich zu beschädigen, und ob
30 % Reserve reichen, ist eine Vermutung, bis etwas die Pixel gegenliest. Das
Emblem wird dabei als volles Schwarz gerastert, also im ungünstigsten Fall.

Wolt hat dem Haus einen druckfertigen QR auf die `/en/`-Seite geliefert — für
ein Lokal in Stuttgart. Ein Anbieter mit weit mehr Mitteln hat genau diesen
Fehler in genau diesem Artefakt gemacht.

## Vor dem Druck

1. **QR-Module in reinem Schwarz** (nur K, kein gemischtes Schwarz) — an
   Modulkanten kostet jede Passerdifferenz Lesbarkeit. Die Augen dürfen farbig
   bleiben, sie sind groß genug.
2. **Das „G" im Emblem in Pfade konvertieren.** Eine lebende Schriftreferenz in
   Druckdaten ist ein Platzhalterkästchen, das nur darauf wartet zu passieren.
3. **Marinara `#8E2800` als Proof prüfen.** Der Ton kippt von RGB nach CMYK am
   stärksten und steht auf der Rückseite von B vollflächig. Ein Bildschirm
   beantwortet diese Frage nicht.

## Reproduzieren

```bash
npx tsx docs/postkarte/qr.ts        # QR erzeugen + Dekodierung prüfen
node docs/postkarte/build.mjs --pdf # proof.html, print.html, PDF
```

`proof.html` und `print.html` sind erzeugt und nicht eingecheckt; das PDF liegt
als weitergabefähiges Ergebnis bei.

## Offen

Die Textvarianten stehen im Andruckbogen (`proof.html`) mit Quellenangabe und
Wirkung. Entschieden sind sie nicht. Ebenso offen: welche Wolt-Kampagne läuft
(Bestellwert-Rabatt oder Artikel-Promotion — „keine Liefergebühr" ist verworfen,
weil sie Lieferung verbilligt und damit gegen die Abholung arbeitet), und die
Freigabe durch den Betreiber.
