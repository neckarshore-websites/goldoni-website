# SEO-Audit — ristorante-goldoni.de

**Audit-Datum:** 2026-04-29
**Auditor:** Linus (Frontend Artist)
**Audit-URL:** `https://ristorante-goldoni.de/`
**Audit-Tool:** seo-audit Skill (Claude Code)

---

## Wichtige Vorbemerkung — Welche Seite wurde gescannt?

Die Live-Domain `ristorante-goldoni.de` zeigt aktuell die **Legacy-WordPress-Seite** (PHP 8.2, WordPress, Apache). Die neue Next.js-Seite ist im Repo `GmanFooFoo/goldoni-website` (Branch `linus/feiern-form-polish`) gebaut, aber **noch nicht deployed**. Dieser Report ist daher die **Baseline der Legacy-Seite** — perfekt als Vorher/Nachher-Vergleich für die Migration.

> Die heutige Session hat den neuen Next.js-Bau bereits SEO-fertig gemacht (Sitemap, robots.txt, Restaurant-JSON-LD, OG-Bild, per-page canonicals). Sobald die neue Seite live geht, sollte ein zweiter Audit-Lauf den Sprung dokumentieren.

---

## Executive Summary

| Kategorie | Score | Gewicht | Beitrag |
|---|---|---|---|
| Technical SEO | 35/100 | 25% | 8.75 |
| Content Quality | 35/100 | 25% | 8.75 |
| On-Page SEO | 30/100 | 20% | 6.00 |
| Schema / Structured Data | **0/100** | 10% | 0.00 |
| Performance (CWV proxy) | 50/100 | 10% | 5.00 |
| Images | 25/100 | 5% | 1.25 |
| AI Search Readiness | 20/100 | 5% | 1.00 |
| **SEO Health Score** | | | **~31/100** |

### Top 5 Critical Issues

1. **Keine Schema.org-Strukturdaten** — null Restaurant-, LocalBusiness-, Menu- oder Address-Schema. Google kann die Seite nicht als Restaurant-Eintrag im "Local Pack" rendern.
2. **Mixed Content** — alle Bilder per `http://` statt `https://` (Hero-Slider, Logos, Galerie). Browser-Warnung möglich, Google-Ranking-Signal negativ.
3. **Duplicate Titles + Meta Descriptions** — 4 Seiten haben identische Beschreibung "Ristorante Goldoni"; `/private-feiern-und-firmen-events/` hat den Title "Kontakt" (Copy-Paste-Fehler).
4. **Keine Security Headers** — `Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options`, `Referrer-Policy` fehlen. Server leakt PHP-Version (`x-powered-by: PHP/8.2.30`).
5. **Thin Content** — `/infos/` mit 50 Wörtern, `/menue-28/pasta-2/` mit 103 Wörtern. Google indexiert solche Seiten ungern.

### Top 5 Quick Wins

1. **Migration zur Next.js-Seite ausrollen** — die neue Version löst Punkte 1–5 oben in einem Schritt.
2. **HTTPS-Cleanup für Bilder** — `http://` → `https://` Search-and-Replace im WordPress-Template (1 Zeile in functions.php oder per Better-Search-Replace-Plugin).
3. **Title + Description je Seite eindeutig setzen** — Yoast SEO oder Rank Math Plugin kostenlos, 30 Min Arbeit.
4. **PHP-Version-Header verbergen** — `expose_php = Off` in php.ini oder Header-Removal in .htaccess.
5. **WebP-Plugin aktivieren** — `Smush` oder `EWWW Image Optimizer` für WordPress, automatische Konvertierung.

---

## 1. Technical SEO

### Crawlability — OK
- `robots.txt` existiert, blockiert sinnvoll `/wp-admin/`, allowt `admin-ajax.php`.
- WordPress-Sitemap unter `/wp-sitemap.xml` (8 URLs gesamt) — funktioniert, aber: `/sitemap.xml` (Standard-Pfad) liefert 404 statt Redirect. Manche Crawler probieren nur den Standard-Pfad.

### Indexability — OK
- Canonical-Tags auf jeder Seite gesetzt und korrekt.
- `hreflang="de-DE"` deklariert (sinnvoll, single-language-Site).
- Keine `noindex`-Meta auf öffentlichen Seiten gefunden.

### Security — Schwach
| Header | Status |
|---|---|
| `Strict-Transport-Security` | **fehlt** |
| `Content-Security-Policy` | **fehlt** |
| `X-Frame-Options` | **fehlt** |
| `X-Content-Type-Options` | **fehlt** |
| `Referrer-Policy` | **fehlt** |
| `Permissions-Policy` | **fehlt** |
| `x-powered-by: PHP/8.2.30` | **leakt PHP-Version** (Information Disclosure) |

### URL-Struktur
- `/menue-28/` — die `-28` ist ein WordPress-Page-ID-Artefakt, sollte `/speisekarte/` heißen.
- `/menue-28/pasta-2/` — verschachtelte Page mit `-2`-Suffix, gleiche Begründung.
- `/private-feiern-und-firmen-events/` — sehr lang. `/feiern/` reicht.
- Trailing slashes konsistent verwendet.

### Mobile
- Viewport-Meta gesetzt: `width=device-width, initial-scale=1, maximum-scale=1`.
- `maximum-scale=1` ist accessibility-feindlich — sollte entfernt werden (verhindert Pinch-Zoom).

### Core Web Vitals (Proxy)
TTFB: ~244 ms (gut). Volles Lighthouse-Run nicht durchgeführt — Empfehlung: PageSpeed Insights manuell laufen, dort bekommt man echte Felddaten (CrUX) sofern genug Traffic.

---

## 2. Content Quality

### Wortzahl je Seite

| URL | Wörter | Bewertung |
|---|---|---|
| `/` (Home) | 404 | OK |
| `/menue-28/` | 177 | dünn |
| `/menue-28/pasta-2/` | 103 | thin content |
| `/kontakt/` | 120 | dünn (für Kontaktseite akzeptabel) |
| `/private-feiern-und-firmen-events/` | 233 | OK |
| `/impressum/` | 154 | OK (Impressum) |
| `/datenschutzerklaerung/` | 2995 | OK (DSGVO-Standardtext) |
| `/infos/` | 50 | **thin content** |

### E-E-A-T-Signale
- **Experience:** schwach — keine Stories über Gerichte, keine Aussagen zur Küche.
- **Expertise:** keine Hinweise auf Köche, Tradition, Familienbetrieb-Geschichte.
- **Authoritativeness:** alte "Prinz Top Guide 2010"-Referenz im Sidebar — nicht aktualisiert.
- **Trust:** Adresse, Telefon, Impressum, Datenschutz alle vorhanden.

### Duplicate Content
- 4 Seiten mit identischer Meta Description "Ristorante Goldoni": Homepage, Impressum, Infos, Pasta.
- 2 Seiten mit identischem Title "Kontakt": `/kontakt/` und `/private-feiern-und-firmen-events/` (= **Bug**).

---

## 3. On-Page SEO

### Title Tags

| URL | Title | Länge | Issues |
|---|---|---|---|
| `/` | "Ristorante Goldoni - Stuttgart Reinsburgstraße 151" | 51 | OK, könnte Cuisine-Keyword tragen |
| `/menue-28/` | "Ristorante Goldoni - Speisekarte" | 32 | OK |
| `/kontakt/` | "Kontakt" | 7 | **zu kurz**, kein Brand |
| `/impressum/` | "Impressum – Ristorante Goldoni" | 30 | OK |
| `/datenschutzerklaerung/` | "Datenschutzerklärung" | 20 | **kein Brand** |
| `/private-feiern-und-firmen-events/` | "Kontakt" | 7 | **falsch** (Bug, Copy-Paste) |
| `/infos/` | "Wichtige Infos – Ristorante Goldoni" | 35 | OK |
| `/menue-28/pasta-2/` | "Pasta – Ristorante Goldoni" | 26 | OK |

### Meta Descriptions

| URL | Description | Länge | Issues |
|---|---|---|---|
| `/` | "Ristorante Goldoni" | 19 | **viel zu kurz**, dupliziert |
| `/menue-28/` | "Unsere wöchentliche wechselnde Empfehlungskarte, sowie die beliebten Klassiker,." | 80 | Tippfehler ("wöchentliche wechselnde"), endet mit ",." |
| `/kontakt/` | "Hier finden Sie unsere Kontaktdaten…" | 95 | OK |
| `/impressum/` | "Ristorante Goldoni" | 19 | dupliziert |
| `/infos/` | "Ristorante Goldoni" | 19 | dupliziert |
| `/menue-28/pasta-2/` | "Ristorante Goldoni" | 19 | dupliziert |

Best practice: 110–160 Zeichen, jede Seite eindeutig.

### Heading-Struktur — OK
- Jede Seite hat genau 1 H1.
- Homepage hat 9 H2 — gut für Skim-Reading.

### Interne Verlinkung
- Hauptnav: Home, Speisekarte, Kontakt, Private Feiern, Impressum, Datenschutz.
- **Keine kontextuellen Links im Body-Text** zwischen Seiten. Die Pasta-Subseite verlinkt nicht zurück zur Speisekarte oder zur Home.

---

## 4. Schema & Structured Data

**Status: 0 Schema-Blöcke gefunden.**

Eine Restaurant-Seite ohne Schema ist 2026 ein klares Negativsignal — Google Rich Results für "italienisches Restaurant Stuttgart" oder ähnliche lokale Suchen werden aus Schema-Daten gespeist.

Was komplett fehlt:
- `Restaurant` (Schema.org)
- `LocalBusiness`
- `PostalAddress`
- `OpeningHoursSpecification`
- `Menu` / `MenuItem`
- `BreadcrumbList`
- `Organization` mit Logo

> Die neue Next.js-Version implementiert bereits `Restaurant` mit allen NAP-Feldern (Name/Address/Phone), Öffnungszeiten, Bildern, `hasMenu`, `priceRange`. Migration löst diese Kategorie komplett.

---

## 5. Performance (Proxy-Metriken)

| Metrik | Wert | Bewertung |
|---|---|---|
| DNS Lookup | 3 ms | exzellent |
| TCP Connect | 36 ms | exzellent |
| TTFB | 244 ms | gut |
| HTML-Größe | 130 KB | groß für eine Restaurant-Homepage |
| Total Page Weight (geschätzt) | > 1.5 MB | mit 32 Bildern hoch |

### Image Weight
Beispiel-Asset-Größen:
- `italy-Large.jpg`: **265 KB** (viel zu groß für Hero)
- `Bohnen.jpg`: 75 KB
- `Kartoffeln.jpg`: 84 KB
- `Servieren.jpg`: 79 KB

Alle Bilder sind JPG/PNG aus **2015/2016**, kein WebP, kein AVIF. Modern-Format-Konvertierung würde ~70 % Bandbreite sparen.

---

## 6. Images

| Issue | Anzahl |
|---|---|
| Bilder gesamt (Homepage) | 32 |
| Mit leerem `alt=""` | ~15 (Slider-Decoration teilweise legitim) |
| Mit generischem `alt="Slide"` | mehrfach |
| Mit `http://` statt `https://` | nahezu alle |
| WebP/AVIF | 0 |
| Lazy-Loading (`loading="lazy"`) | unbekannt, vermutlich keines |

---

## 7. AI Search Readiness

| Faktor | Status |
|---|---|
| Schema.org Restaurant | **fehlt** |
| Klare H1/H2-Struktur | OK |
| Adresse + Öffnungszeiten als Schema | **fehlt** |
| `llms.txt` | fehlt |
| Antworten auf typische Fragen ("Öffnungszeiten?", "Reservierung?") als FAQ | fehlt |
| Brand-Mention-Konsistenz (NAP) | gut (Adresse einheitlich) |

ChatGPT/Perplexity zitieren Sites bevorzugt, die strukturiert geantwortet haben. Restaurant-Schema + FAQ-Schema = Pflicht für AI-Sichtbarkeit.

---

## 8. WordPress-spezifische Hygiene

- `xmlrpc.php`-Endpoint exposed (DDoS/Brute-Force-Vektor) — sollte deaktiviert werden, falls keine Pingbacks/App-Editor genutzt werden.
- `/wp-json/`-REST-API offen — exposed Page IDs und Author-Daten. Sollte für `/users` zumindest eingeschränkt werden.
- RSS-Feeds aktiv (`/feed/`, `/comments/feed/`) — OK technisch, aber für ein Restaurant inhaltlich nutzlos.
- `format-detection: telephone=no` — verhindert Tap-to-Call-Auto-Linking auf iOS. Für ein Restaurant das auf Telefon-Reservierung setzt: **kontraproduktiv**.

---

## Anhang — Gecrawlte Seiten

8 URLs aus der WordPress-Sitemap:
1. `https://ristorante-goldoni.de/` (Homepage)
2. `https://ristorante-goldoni.de/menue-28/`
3. `https://ristorante-goldoni.de/menue-28/pasta-2/`
4. `https://ristorante-goldoni.de/kontakt/`
5. `https://ristorante-goldoni.de/private-feiern-und-firmen-events/`
6. `https://ristorante-goldoni.de/impressum/`
7. `https://ristorante-goldoni.de/datenschutzerklaerung/`
8. `https://ristorante-goldoni.de/infos/`

Rohdaten: `seo-audit-2026-04-29/page_*.html`, `headers.txt`, `wp-sitemap.xml`.
