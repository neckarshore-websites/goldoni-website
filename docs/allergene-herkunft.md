# Allergene und Zusatzstoffe — Herkunft der Angaben

Diese Datei hält fest, **woher** jede Allergen- und Zusatzstoffangabe auf
`ristorante-goldoni.de` stammt, was der Inhaber bestätigt hat, und was noch offen
ist. Sie ist die Begründung hinter `src/data/speisekarte.json` und
`src/data/empfehlungskarte.json` — nicht deren Kopie.

> **Wichtig:** Die Codes sind eine rechtlich verbindliche Aussage gegenüber Gästen
> (LMIV, Verordnung (EU) Nr. 1169/2011, dazu LMIDV für lose Ware und LMZDV § 5).
> Eine Angabe, die niemand belegen kann, ist schlechter als keine.

## Wie eine Angabe belegt ist

Vier Stufen, absteigend nach Güte. Jede Zeile unten nennt ihre Stufe.

| # | Stufe | Was sie bedeutet |
|---|-------|------------------|
| 1 | **Etikett** | Jemand hat die Zutatenliste des Produkts im Haus gelesen |
| 2 | **Hersteller** | Zutatenliste von der Herstellerseite, nicht vom Produkt im Haus |
| 3 | **Inhaber** | Silvio hat es gesagt |
| 4 | **ungemessen** | Erwartung aus der Produktgattung, nichts geprüft |

Eine **Zutat** und eine **Spur aus dem Produktionsprozess** sind rechtlich nicht
dasselbe: Anhang II verlangt Zutaten-Allergene, ein Spurenhinweis ist freiwillig
(Art. 36). Beide stehen heute in derselben Code-Liste. Ob das kenntlich gemacht
wird, ist offen — siehe unten.

## Antworten des Inhabers, aufgenommen 2026-09-21

Die Nummern sind die des Fragebogens in der Fassung vom 19.09. mit 34 Fragen
(`goldoni-allergen-fragebogen-2026-09-19.html`), die der Inhaber auf Papier
beantwortet hat. Die Spalte **35er** nennt dieselbe Frage in der neueren Fassung
(`…-19b.html`), weil sich die Karte am 19.09. gedreht hat und die Nummern dadurch
auseinanderlaufen. Eine Umrechnung "minus eins" gibt es nicht: drei Fragen sind
mit ihren Gerichten weggefallen, vier sind dazugekommen.

| Nr. | 35er | Gericht / Thema | Antwort | Stufe |
|-----|------|-----------------|---------|-------|
| 12 | 11 | Ravioli spinaci e ricotta | **B bleibt.** Im Produktionsprozess der zugekauften Ravioli kann es Spuren von Krebstieren geben. | Inhaber — und ein **Spureneintrag**, keine Zutat |
| 13 | entfällt | Calamari marinati | **D bleibt.** Die ursprüngliche Begründung des Inhabers ("Calamari sind Fische") ist falsch — Calamari sind Weichtiere. D ist trotzdem richtig, weil die Marinade alla mediterranea Fisch enthalten kann. | Inhaber, Begründung korrigiert. Gericht seit 19.09. von der Karte |
| 18 | 18 | Insalata Casa, Code 6 | — offen — | — |
| 19 | 19 | vier Biere, Code 2 | **2 kann bei allen vier weg.** Pils, Hefeweizen, Kristallweizen nach Reinheitsgebot. Italienisches Flaschenbier = Peroni. Fassbier = Birra Moretti: "Wasser, Gerstenmalz, Mais, Hopfen, Hopfenextrakt". A bleibt überall. | Hersteller (Moretti), Inhaber (Peroni) |
| 20 | 20 | Orangensaft, Apfelsaftschorle, Code 2 | **2 kann weg.** Beide von Kumpf, beide ohne Konservierungsstoff. Die Fruchtsaftverordnung verbietet sie in Saft und Nektar ohnehin. | Hersteller |
| 21 | 21 | Cola, Cola Zero, Fanta, Spezi, Sprite, Kirschnektar | **Je Getränk verschieden**, siehe Änderungsliste unten. | Hersteller, mit offener Postmix-Frage |
| 22 | 22 | Tiramisù, rohes Ei | **Ohne Ei zubereitet.** Für die Creme ist C nicht nötig. | Inhaber |
| 23 | 23 | Tiramisù, Code H | **Amaretto, laut Inhaber aus Mandeln.** Mandel ist Anhang II Nr. 8, H wäre damit richtig. | Inhaber, Etikett steht aus |
| 25 | 25 | sechs Digestivi ohne jeden Code | **"Bitte prüfen und ergänzen."** | Inhaber — löst eine Aufgabe aus, schließt keine Frage |
| 33 | entfällt | Filetti di rombo, Wortlaut | **Dorade kommt dazu**, der italienische Name muss bei einer Rückkehr beide Fische nennen (z.B. "Duetto di orata e rombo"). | Inhaber. Gericht seit 19.09. von der Karte |
| 34 | 34 | Desserts, Wortlaut | **Italienische Namen für alle vier.** Entwurf siehe unten, Abnahme durch den Inhaber steht aus. | Inhaber |

## Abgeleitete Änderungen

### Belegt, ohne offene Vorbedingung

Flaschenware, deren Hersteller feststeht.

| # | Eintrag | heute | belegt richtig | Änderung |
|---|---------|-------|----------------|----------|
| 1 | Pils, Italienisches Bier, Hefeweizen Hell, Kristallweizen | `2 A` | `A` | `2` streichen, 4× |
| 2 | Orangensaft | `2 3` | keine | beide streichen |
| 3 | Apfelsaftschorle | `2 3` | keine | beide streichen |
| 4 | Kirschnektar | `1 2 3 11` | keine | alle vier streichen |

### Hängt an der Postmix-Frage

Kommt das Getränk aus der Flasche oder aus dem Postmix-Sirup? Der Sirup hat eine
eigene Zutatenliste. Bis das geklärt ist, sind die folgenden Zeilen gerechnet,
nicht belegt.

| # | Eintrag | heute | bei Flaschenware | Änderung |
|---|---------|-------|------------------|----------|
| 5 | Coca-Cola | `1 2 3 9 11` | `1 9` | `2 3 11` streichen |
| 6 | Fanta | `1 2 3 11` | `1 3` | `2 11` streichen |
| 7 | Spezi | `1 2 3 9 11` | `1 3 9` | `2 11` streichen |
| 8 | Sprite | `1 3 11` | vermutlich keine | Etikett lesen |

Zur Spezi: der Inhaber nennt Paulaner, vermutet aber, sie werde von Hand aus Cola
und Fanta gemischt. **Für die Codes führt beides zum selben Ergebnis** — eine
Handmischung bringt Farbstoff, Ascorbinsäure und Koffein mit, also `1 3 9`, und
das ist auch die Paulaner-Liste.

### Italienische Dessertnamen — online seit 2026-09-23

Auf Founder-Anweisung live gestellt; der deutsche Name steht jetzt als
Beschreibungszeile darunter. Die Abnahme des Wortlauts durch den Inhaber
(Frage 34) steht weiter aus.

| # | Heute | Entwurf |
|---|-------|---------|
| 1 | Soufflé al cioccolato con gelato alla vaniglia | unverändert |
| 2 | Gefüllte Windbeutel umhüllt mit weißer Milchcreme | Profiteroles bianchi con crema al latte |
| 3 | Hausgemachte Himbeer-Pannacotta | Panna cotta ai lamponi fatta in casa |
| 4 | Pistazieneis umhüllt mit gehackten Mandeln | Gelato al pistacchio in crosta di mandorle |

"Tartufo" ist bewusst vermieden: auf der Hauptkarte steht bereits
"Tartufo Nero / Bianco", das wären zwei verschiedene Desserts unter einem Wort.

## Offen

| # | Punkt | Wer klärt es | Warum es zählt |
|---|-------|--------------|----------------|
| 1 | **Löffelbiskuit im Tiramisù** | Packung im Haus | Die Website sagt wörtlich "ohne Ei". Savoiardi enthalten praktisch immer Ei. Ist der Biskuit zugekauft, steht dort eine **falsche Allergen-Aussage als ausgeschriebener Satz**, nicht bloß ein fehlender Code. |
| 2 | **Amaretto-Etikett** | Flasche im Haus | Disaronno und viele andere Amaretti werden aus Aprikosenkernen gemacht, nicht aus Mandeln. Aprikosenkern ist kein Anhang-II-Allergen. Dann wäre H eine freiwillige Vorsichtsangabe statt einer Pflichtangabe. |
| 3 | **Flasche oder Postmix** | Tresen | Gilt für Cola, Fanta, Spezi, Sprite. Entscheidet vier Zeilen der Änderungsliste. |
| 4 | **sechs Digestivi** | Etiketten | Averna, Ramazzotti, Cynar, Amaro del Capo, Sambuca, Fernet tragen heute gar keinen Code. Erwartung (ungemessen): Zuckerkulör und damit Code 1 bei fünf von sechs. |
| 5 | **Sprite-Etikett** | Flasche | Sprite wird in Europa mit Zucker oder mit Zucker plus Süßungsmitteln abgefüllt. |
| 6 | **Frage 18, Insalata Casa** | Inhaber | Code 6 steht für geschwärzte Oliven. |
| 7 | **Spur oder Zutat kenntlich machen?** | Entscheidung | Zwei Fälle bisher (Ravioli B, möglicherweise Amaretto H). Heute stehen beide Arten ununterscheidbar in derselben Liste. |

## Was diese Datei nicht ist

Sie ersetzt keine Messung. Wo als Stufe "Hersteller" steht, ist die Zutatenliste
von einer Produktseite im Netz, nicht vom Produkt im Haus — und die Gastronomie
führt regelmäßig andere Gebinde als der Einzelhandel. Wer eine Angabe verteidigen
muss, liest das Etikett.
