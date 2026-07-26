# Wolt Storefront — Durchstich-Protokoll 2026-07-25

Technischer Durchstich: Bestellknopf auf `ristorante-goldoni.de` → Wolt Storefront → abgeschlossene Bestellung.

**Aufbau:** `/sandbox` (noindex, unverlinkt) trägt den Bestellknopf isoliert, damit der Weg getestet werden kann, ohne die Live-Seite anzufassen. Startseite, Banner und Footer sind unverändert.

**Ziel des Tests:** eine echte Kleinbestellung (ein Bier, 3,00 €) vollständig abschliessen.

---

## Wer bekommt was

| # | Empfänger | Punkte | Warum dort |
|---|-----------|--------|------------|
| 1 | **Silvio** (Wolt-Merchant-Backend) | S1 | Eine Einstellung, die nur er ändern kann |
| 2 | **Wolt Support** (`travis.sauer@wolt.com`, cc `cem.sezen@wolt.com`) | W1–W4 | Plattform- und Materialfehler |

---

## ~~Für Silvio — S1: Liefer-/Öffnungszeiten stimmen nicht~~ — GEKLÄRT 2026-07-26, kein Defekt

**Auflösung:** Der Sonntagswert wurde vom Betreiber auf **12:00–22:30** korrigiert (die ursprünglichen 09:00–24:00 waren tatsächlich falsch). Die verbleibende Abweichung Mi–Sa — Storefront 16:30, Website 18:00 — ist **Absicht**: die Pizzaproduktion für Lieferungen beginnt, bevor der Gastraum öffnet. Lieferzeiten dürfen von Öffnungszeiten abweichen, und hier tun sie es aus einem Grund.

**Die Website bleibt unverändert.** Ihre Zeiten beschreiben das Restaurant, nicht das Lieferfenster der Küche. Wer sie später „angleichen" will, liest bitte erst diesen Absatz.

Der ursprüngliche Fund bleibt unten stehen, weil die Begründung, warum er *kein* Defekt ist, mehr wert ist als eine gelöschte Zeile.

### Ursprünglicher Fund (2026-07-25)

Die Storefront zeigt andere Zeiten als die Website. Gemessen am 2026-07-25 auf der Storefront-Detailseite.

| # | Tag | Website `ristorante-goldoni.de` | Storefront `order.site` | Abweichung |
|---|-----|--------------------------------|-------------------------|------------|
| 1 | Montag | geschlossen | Geschlossen | — |
| 2 | Dienstag | geschlossen | Geschlossen | — |
| 3 | Mittwoch | 18:00–22:30 | 16:30–22:30 | 90 min früher |
| 4 | Donnerstag | 18:00–22:30 | 16:30–22:30 | 90 min früher |
| 5 | Freitag | 18:00–22:30 | 16:30–22:30 | 90 min früher |
| 6 | Samstag | 18:00–22:30 | 16:30–22:30 | 90 min früher |
| 7 | Sonntag | 12:00–14:30 **und** 18:00–22:30 | **09:00–24:00** | 15 Stunden durchgehend |

**Einordnung:** Die 16:30 könnten Absicht sein — Lieferzeiten dürfen von Öffnungszeiten abweichen. Der Sonntag mit 09:00–24:00 ist unter keiner Lesart plausibel und sieht nach einem Standardwert aus.

**Das ist kein Wolt-Fehler.** Wolts Best-Practice-PDF (S. 8, Punkte 10 und 11) führt Lieferkosten und Mindestbestellwert als Händler-Einstellungen; die Zeiten liegen in derselben Verwaltung. Silvio kann das selbst korrigieren.

**Risiko, solange es steht:** Gäste bestellen sonntagmorgens um 09:30 in eine Küche, die nicht läuft.

---

## Für Wolt

### ~~W1 — Apple Pay lässt sich nicht bestätigen~~ — ZURÜCKGEZOGEN, kein Wolt-Fehler

**Beobachtet war:** Nach Auswahl von Apple Pay erscheint das Bezahlfenster („Ristorante Goldoni (über Wolt) bezahlen — 3,00 €", Visa Debitkarte). Die Touch-ID-Aufforderung erscheint und verschwindet wiederholt; die Zahlung liess sich nicht bestätigen.

**Warum das kein Wolt-Bug ist:** Gegengeprüft auf `applepaydemo.apple.com` — Apples eigener Referenzimplementierung. **Dort tritt derselbe Fehler auf.** Damit ist die Ursache clientseitig und weder bei Wolt noch bei uns.

Weiter eingegrenzt am betroffenen Gerät (Mac17,3 / M5, macOS 26.5.2):

| # | Geprüft | Ergebnis |
|---|---------|----------|
| 1 | Touch ID für Apple Pay freigegeben | `Biometrics for ApplePay: 1`, effektiv — **nicht die Ursache** |
| 2 | Bluetooth (für Bestätigung via gekoppeltes Gerät) | An — nicht die Ursache |
| 3 | Apple-Systemstatus | Apple Pay und Wallet ohne Störungsereignis — nicht die Ursache |
| 4 | **Safari** auf `applepaydemo.apple.com` | Bezahlfenster erscheint, Spinner dreht, **Touch-ID-Abfrage kommt nie**. Reproduziert auf Apples eigener Referenzseite |
| 5 | **Chrome** auf derselben Seite | QR-Code-Übergabe an ein Telefon statt Touch ID — **das ist Chromes vorgesehenes Verhalten** auf macOS, kein Fehler |

**Befund:** Apple Pay erreicht in Safari auf diesem Gerät (M5 / macOS 26.5.2) die Biometrie-Abfrage nicht. Lokal an der Maschine, bei aktueller Hardware-/OS-Kombination. Weder Wolt noch die Website sind beteiligt.

**Merke für den Vorgang:** Dieser Punkt stand kurz davor, als Wolt-Bug gemeldet zu werden. Die Isolationsprüfung gegen Apples Referenzseite hat das verhindert — die Reihenfolge war zuerst falsch herum (Meldung vor Eingrenzung) und wurde auf Einspruch des Betreibers korrigiert. Eine falsche Meldung hätte die drei berechtigten Punkte mitbeschädigt.

**Auswirkung auf den Durchstich: keine.** Die Bestellung wurde per Kredit-/Debitkarte erfolgreich abgeschlossen.

### W2 — Gutscheinfeld liest sich wie der Bestellabschluss

**Beobachtet:** Im Checkout steht unter den Zahlungsmethoden der Block „Gutscheincode" mit dem Hinweistext „**Wenn du** einen Promo-Code hast…" — also optional. Daneben ein schwarzer Knopf „Abschicken".

Wird er ohne Code gedrückt, erscheint: **„Der Guthaben Code wurde nicht gefunden."**

**Problem:** „Abschicken" ist der einzige hochkontrastige Knopf im sichtbaren Bereich und sitzt direkt unter den Zahlungsmethoden. Er liest sich als Bestellabschluss. Die Fehlermeldung suggeriert anschliessend, ein Code sei **erforderlich** — das Feld ist aber optional.

**Vorschlag:** Knopf beschriften mit „Code einlösen" statt „Abschicken"; bei leerem Feld nicht validieren.

### W3 — Kein Gast-Checkout, bestehendes Wolt-Konto trägt nicht

**Beobachtet:** Ein vorhandenes Wolt-Konto (Marktplatz) führte nicht zur Anmeldung. Der Dialog lautet „Anmelden **oder ein Konto erstellen** — Gib deine Telefonnummer ein, um einen Anmeldecode zu erhalten. Wenn du noch kein Konto hast, nutzen wir deine Nummer, um schnell eines einzurichten." Es gibt nur das Telefonnummernfeld — keine E-Mail, kein Google/Apple.

Der Kunde erlebt das als „ich muss ein neues Konto anlegen, obwohl ich eins habe".

**Fragen an Wolt:**
1. Teilen Marktplatz- und Storefront-Konten denselben Identitätsbestand, oder sind es getrennte Systeme?
2. Ist ein Gast-Checkout ohne Registrierung vorgesehen oder aktivierbar?

### W4 — Ausgeliefertes Material zeigt auf die englische Fassung

**Beobachtet:** In der Aktivierungs-E-Mail vom 2026-07-24 und im beigefügten PDF (S. 1, gelb markiert) steht die Bestell-URL in der **`/en/`**-Variante — und der zum Ausdrucken beigelegte **QR-Code zeigt ebenfalls auf `/en/`**.

Beide Locales antworten mit HTTP 200 und leiten nicht um. Ein deutscher Gast landet also auf der englischen Fassung.

**Wir verwenden bewusst die `/de/`-Variante** und erzeugen einen eigenen QR-Code:
`https://order.site/goldoni/de/deu/stuttgart/restaurant/ristorante-goldoni-sf`

**Vorschlag:** Für Venues in Deutschland Link und QR-Code in der `/de/`-Fassung ausliefern.

---

## Beleglage

| # | Punkt | Von wem festgestellt |
|---|-------|---------------------|
| 1 | S1 Zeiten | Selbst gemessen (Storefront-Seite gegen Website-Fussleiste) |
| 2 | W1 Apple Pay | Vom Betreiber beobachtet, nicht selbst reproduziert |
| 3 | W2 Gutscheinfeld | Aus Screenshot des Betreibers; Wortlaut belegt |
| 4 | W3 Anmeldung | Dialogtext selbst gelesen; **nicht** geprüft, ob die Konten denselben Bestand teilen (keine Anmeldung erfolgt) |
| 5 | W4 `/en/` | Selbst geprüft: beide Locales 200, keine Weiterleitung; E-Mail und PDF liegen vor |

Nicht geprüft: der Checkout jenseits der Speisekarte — es wurde weder ein Konto angelegt noch eine Bestellung durch die Automatisierung ausgelöst.
