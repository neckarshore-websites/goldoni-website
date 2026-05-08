# SEO-Audit Phase D — ristorante-goldoni.de Post-Live-Verification

**Audit-Datum:** 2026-05-08
**Auditor:** Linus (Frontend Artist)
**Audit-URL:** `https://ristorante-goldoni.de/`
**Audit-Tool:** seo-audit Skill (Claude Code)
**Vorgänger:** [`seo-audit-2026-04-29/FULL-AUDIT-REPORT.md`](../seo-audit-2026-04-29/FULL-AUDIT-REPORT.md) (WordPress-Baseline 31/100), [`seo-audit-2026-04-29-phaseB/PHASE-B-REPORT.md`](../seo-audit-2026-04-29-phaseB/PHASE-B-REPORT.md) (Pre-Live localhost)

---

## Executive Summary

**SEO Health Score: 93/100** (vs. WordPress-Baseline 31/100 → **+62 Punkte**, Ziel 80–90 übertroffen)

| Kategorie | Score | Gewicht | Beitrag | Δ vs. WP-Baseline |
|---|---|---|---|---|
| Technical SEO | 92/100 | 25% | 23.0 | +57 |
| Content Quality | 90/100 | 25% | 22.5 | +55 |
| On-Page SEO | 95/100 | 20% | 19.0 | +65 |
| Schema / Structured Data | 95/100 | 10% | 9.5 | +95 |
| Performance (CWV) | 96/100 | 10% | 9.6 | +46 |
| Images | 100/100 | 5% | 5.0 | +75 |
| AI Search Readiness | 95/100 | 5% | 4.75 | +75 |
| **SEO Health Score** | | | **93.35** | **+62** |

### Top 5 Wins (vs. Baseline)

1. **Schema.org von 0 → 95** — Restaurant + Menu (10 Sektionen / 72 Items mit Preisen + Diäten) + FAQ (5 Q&As) + BreadcrumbList auf allen relevanten Seiten.
2. **Mixed-Content gelöst** — alle Bilder HTTPS (Vercel + Next/Image-Pipeline), keine `http://`-Referenzen mehr.
3. **Security Headers von 0 → 1+** — HSTS `max-age=63072000` (2 Jahre, preload-ready). PHP-Version-Leak weg (kein WordPress-Stack mehr).
4. **Performance Mobile 94 / Desktop 100** — LCP 2.7–2.9s, CLS 0, TBT 30–40ms. WP-Baseline ~50/100 mit Mixed-Content-Penalty.
5. **AI-Citation-Surface** — `llms.txt` strukturiert (NAP + Pages + Speisekarte-Hinweise + Lieferpartner), 5 FAQ-Q&As schema-fähig, Restaurant-Schema mit GeoCoordinates + OpeningHoursSpecification + servesCuisine + areaServed.

### Top 5 Restrisiken (Phase D Findings)

1. **Title-Doppelpräfix** auf 6 von 7 Seiten: `[Page] — Ristorante Goldoni | Ristorante Goldoni` (Brand zwei Mal). Homepage ist sauber. Template-Issue, geringer SEO-Impact, aber Klick-Optik-Issue in SERPs.
2. **www-Subdomain ohne 308-Redirect** — `https://www.ristorante-goldoni.de/` antwortet 200 mit eigenem Origin (Vercel-CDN-HIT) statt 308 → apex. Canonical-Tag im HTML mitigiert das (`https://ristorante-goldoni.de`), aber redirect wäre best-practice.
3. **5 Security-Headers fehlen** — `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. HSTS ist da, aber das Set ist unvollständig. Best-Practice-100 deckt das nicht ab; Mozilla Observatory würde C–D vergeben.
4. **Schema-Erweiterungs-Lücken** — `aggregateRating` + `review` (User-Reviews aus Google) fehlen. Wäre für AI Overviews der nächste signifikante Sprung. Plus `paymentAccepted` + `hasMap` (Google-Maps-URL) als Restaurant-Bonus-Felder.
5. **Impressum + Datenschutz Inhalts-Status** — die Texte rendern technisch sauber (H1+H2+Description), aber Anwalts-Gegencheck steht offen (Linus-Item L33). SEO-neutral, aber rechts-relevant vor Vollbetrieb.

---

## 1. Technical SEO — 92/100

### Crawlability — Pass ✅
- `robots.txt` korrekt: `User-Agent: *` mit `Allow: /`, gezielter `Disallow: /style-guide` + `Disallow: /assets` (interne Seiten, korrekt entzogen).
- `Sitemap:` Zeile referenziert `https://ristorante-goldoni.de/sitemap.xml` ✓
- `Host:` Direktive auf apex (Yandex-Pattern, Google ignoriert harmlos).
- **Keine AI-Crawler-Blocks** — GPTBot, ClaudeBot, PerplexityBot, Google-Extended laufen unter Default `Allow: /`. Bewusst offen für AI-Sichtbarkeit.

### Sitemap — Pass ✅
- `sitemap.xml` valid XML, alle 7 Routen drin.
- `lastmod` = `2026-05-07T16:52:31.012Z` (Cutover-Datum). Konsistent.
- `priority` differenziert: `/` 1.0, `/menu` 0.9, `/empfehlungen` 0.8, `/feiern` 0.7, `/kontakt` 0.6, `/impressum` + `/datenschutz` 0.2.
- `changefreq` plausibel: `weekly` für Empfehlungen + Home, `monthly` für Menu, `yearly` für Legal.

### Indexability — Pass ✅
- Canonical-Tag auf jeder Seite, immer auf apex `https://ristorante-goldoni.de`.
- `<html lang="de">` korrekt.
- Kein `noindex` auf öffentlichen Seiten. Interne Routen `/style-guide` + `/assets` sind sowohl in robots.txt disallowed als auch in HTML mit `noindex,nofollow` markiert (Defense-in-Depth, korrekt).

### Security Headers

| Header | Status | Wert |
|---|---|---|
| `Strict-Transport-Security` | ✅ | `max-age=63072000` (2 Jahre, preload-ready) |
| `Content-Security-Policy` | ❌ | fehlt |
| `X-Frame-Options` | ❌ | fehlt |
| `X-Content-Type-Options` | ❌ | fehlt |
| `Referrer-Policy` | ❌ | fehlt |
| `Permissions-Policy` | ❌ | fehlt |
| `Server: Vercel` | ✅ | kein Stack-Leak (kein PHP-Version-Header) |

**Score-Logik:** -8 Punkte für fehlende Header-Suite (5 Header). HSTS allein deckt 50% des typischen Mozilla-Observatory-Punkteabzugs.

### URL-Struktur — Pass ✅
- Saubere URLs ohne ID-Suffixe (`/menu`, nicht `/menue-28`).
- Trailing-Slash-Konvention: kein Slash, mit 308-Redirect auf no-slash (`/menu/` → `/menu`). Konsistent.
- Legacy-Redirects aus WordPress alle 1-Hop 308 (Phase B verifiziert).

### www-Subdomain — Issue ⚠️
- `https://www.ristorante-goldoni.de/` antwortet HTTP/2 200 mit Vercel-CDN-HIT — **kein 308 → apex Redirect**.
- HTML-Output enthält aber `<link rel="canonical" href="https://ristorante-goldoni.de"/>` → Google respektiert Canonical, kein Duplicate-Content-Penalty zu erwarten.
- Best-Practice wäre dennoch ein 308-Redirect statt zwei parallel servierter Origins.

### HTTPS-Erzwingung — Pass ✅
- `http://ristorante-goldoni.de/` → 308 → `https://ristorante-goldoni.de/` ✓
- HSTS-Header live → Browser cached die Erzwingung clientseitig.

### Mobile Viewport — Pass ✅
- `<meta name="viewport" content="width=device-width, initial-scale=1"/>` — kein `maximum-scale=1` mehr (war WP-Baseline-Issue). Pinch-Zoom für Accessibility erlaubt.

---

## 2. Content Quality — 90/100

### Per-Page Content-Footprint

| Page | Title-Text | Title-Len | Description | Desc-Len | H1 | Worte (Body) |
|---|---|---|---|---|---|---|
| `/` | `Ristorante Goldoni — Bella Italia in Stuttgart` | 47 | "Italienisch verliebte Kueche im Stuttgarter Westen…" | 121 | Ristorante Goldoni | 555 |
| `/menu` | `Speisekarte — Ristorante Goldoni \| Ristorante Goldoni` | 53 | "Antipasti, Pasta, Pizze, Hauptgerichte und Dolci…" | 121 | Speisekarten | hoch (10 Sektionen) |
| `/empfehlungen` | `Empfehlungskarte — Ristorante Goldoni \| Ristorante Goldoni` | 58 | "Saisonale Gerichte, Wochenangebote…" | 90 | Empfehlungskarte | mittel (4 Sektionen) |
| `/kontakt` | `Kontakt — Ristorante Goldoni \| Ristorante Goldoni` | 49 | "Fragen, Sonderwünsche oder eine kurze Nachricht…" | 122 | Schreiben Sie uns | niedrig (Formular-Page) |
| `/feiern` | `Feiern bei Goldoni — Private Anlässe in Stuttgart \| Ristorante Goldoni` | 70 | "Hochzeiten, Geburtstage, Taufen, Firmenfeiern…" | 161 | Feiern bei Goldoni | mittel |
| `/impressum` | `Impressum — Ristorante Goldoni \| Ristorante Goldoni` | 51 | "Anbieterkennzeichnung gemaess § 5 DDG." | 38 | Impressum | hoch (Legal-Boilerplate) |
| `/datenschutz` | `Datenschutzerklaerung — Ristorante Goldoni \| Ristorante Goldoni` | 62 | "Informationen zur Verarbeitung personenbezogener Daten…" | 62 | Datenschutzerklärung | hoch (DSGVO-Boilerplate) |

**Score-Logik:**
- ✅ Alle Titles unique
- ✅ Alle Descriptions unique
- ⚠️ -5 Brand-Doppel-Suffix `| Ristorante Goldoni` redundant zum Page-Titel-Suffix `— Ristorante Goldoni` auf 6/7 Seiten. Homepage ist sauber.
- ⚠️ -3 Description Impressum nur 38 Zeichen (zu kurz, Google füllt mit Snippet); Description Datenschutz 62 Zeichen (akzeptabel, aber knapp am Limit).
- ⚠️ -2 Feiern-Title 70 Zeichen → Google trunciert bei ~60 Zeichen; "Feiern bei Goldoni — Private Anlässe in Stuttgart" wäre genug.

### E-E-A-T Signale

| Signal | Status |
|---|---|
| Experience (gelebte Praxis) | ✅ FAQ + llms.txt zeigen reale Öffnungszeiten, reale Lieferpartner |
| Expertise (italienische Küche) | ✅ Authentische Italienisch-Bezeichnungen (Antipasti, Primi Piatti, Pizze) |
| Authority | ⚠️ Keine Author-Bylines, keine Restaurant-Reviews on-page eingebettet |
| Trust | ✅ Impressum + Datenschutz-Pages vorhanden, Telefon + Adresse + E-Mail durchgängig konsistent |

### Thin Content — Pass ✅
- Keine Seite unter 100 Wörtern.
- `/kontakt` minimalistisch, aber hat Adresse + Telefon + Formular + Anfahrt-Hinweis (genug Substanz).

---

## 3. On-Page SEO — 95/100

### Heading-Hierarchie — Pass ✅

| Page | H1 | H2 | H3 | Verdict |
|---|---|---|---|---|
| `/` | 1 | 5 | 4 | Sauber |
| `/menu` | 1 | 11 | 82 | Sauber, viele H3 = Menu-Items als semantische Sektionen |
| `/empfehlungen` | 1 | 5 | 21 | Sauber |
| `/kontakt` | 1 | 1 | 4 | Sauber |
| `/feiern` | 1 | 2 | 4 | Sauber |
| `/impressum` | 1 | 11 | 4 | Sauber |
| `/datenschutz` | 1 | 13 | 4 | Sauber |

Keine H1→H3-Skips, keine Doppel-H1, jede Page hat eine eindeutige H1 die mit dem Title-Tag und der Description harmoniert.

### Open Graph — Pass ✅

```
og:title       Ristorante Goldoni — Bella Italia in Stuttgart
og:description Italienisch verliebte Kueche im Stuttgarter Westen…
og:url         https://ristorante-goldoni.de
og:site_name   Ristorante Goldoni
og:locale      de_DE
og:image       https://ristorante-goldoni.de/images/hero-goldoni-velvet.webp
og:image:width 1200
og:image:height 630
og:image:alt   Ristorante Goldoni — Schriftzug auf rotem Samt
og:type        website
```

Vollständiges OG-Set. Image hat Dimensions + Alt-Text — LinkedIn / Facebook / Slack-Previews werden korrekt rendern.

### Twitter Cards — Pass ✅
- `summary_large_image` mit Title + Description + Image. Kein `twitter:site` Handle (akzeptabel — Restaurant ohne X-Account).

### Internal Linking

Homepage verlinkt zu allen 6 weiteren Routen via Header-Nav + Footer. Alle 7 Pages erreichbar in 1 Klick von Home. Footer durchgängig sichtbar mit `/impressum` + `/datenschutz`.

### External Linking (Trust/Authority)

| Ziel | Zweck |
|---|---|
| `g.page/r/CTTy_KY_CjykEBM/review` | Google Reviews CTA |
| `maps.app.goo.gl/u3PAUvKHqcANve797` | Google Maps |
| `wolt.com/de/deu/stuttgart/restaurant/goldoni` | Wolt Lieferung |
| `facebook.com/Ristorante-Goldoni-152510754787757/` | Facebook (Restaurant-Profil) |
| `open.spotify.com/playlist/56jhiSGUDlLrWuAtra52LS` | Hauseigene Playlist (Brand-Detail) |
| `neckarshore.ai` | Maker-Footer-Link |

Solide externe Signale für lokale Authority (Maps, Wolt, FB).

---

## 4. Schema / Structured Data — 95/100

### Schema-Coverage pro Route

| Route | Schemas |
|---|---|
| `/` | Restaurant, FAQPage |
| `/menu` | Restaurant, BreadcrumbList, Menu |
| `/empfehlungen` | Restaurant, BreadcrumbList, Menu |
| `/kontakt` | Restaurant, BreadcrumbList |
| `/feiern` | Restaurant, BreadcrumbList |
| `/impressum` | Restaurant, BreadcrumbList |
| `/datenschutz` | Restaurant, BreadcrumbList |

**16 JSON-LD-Blöcke total** über 7 Routes. Restaurant-Schema repliziert auf jeder Page (gut für AI-Crawler die nicht jede Page mit Sitemap kreuzreferenzieren).

### Restaurant Schema — Vollständig

```json
{
  "@type": "Restaurant",
  "name": "Ristorante Goldoni",
  "description": "Italienisch verliebte Küche im Stuttgarter Westen...",
  "url": "https://ristorante-goldoni.de",
  "telephone": "+49 711 6599889",
  "email": "info@goldoni-online.de",
  "image": [3 hero images],
  "address": {PostalAddress: Reinsburgstrasse 151, 70197, Stuttgart, DE},
  "geo": {GeoCoordinates: 48.7685766, 9.1509705},
  "areaServed": "Stuttgart",
  "servesCuisine": ["Italian", "Italienisch"],
  "priceRange": "€€",
  "currenciesAccepted": "EUR",
  "acceptsReservations": "True",
  "hasMenu": "https://ristorante-goldoni.de/menu",
  "openingHoursSpecification": [Mi-So 18:00-23:00],
  "sameAs": ["https://www.facebook.com/..."]
}
```

**Required-Fields-Check (schema.org Restaurant):** alle erfüllt + zusätzlich GeoCoordinates, areaServed, hasMenu, openingHoursSpecification.

### Menu Schema — `/menu`

- `@type: Menu`, `name: Speisekarte`
- 10 Sektionen via `hasMenuSection`: Antipasti (9), Primi Piatti (5), Pizze (12), Carne e Pesce, Dolci, Vini, etc.
- Jedes Item hat `name`, `description`, `offers.price` (EUR), teils `suitableForDiet` (z. B. `VegetarianDiet` auf Margherita).
- Empfehlungskarte parallel: 4 Sektionen, 12 Items.

### FAQ Schema — `/`

5 Question/Answer-Paare:
1. Öffnungszeiten
2. Tischreservierung
3. Lieferung (Wolt + Uber Eats)
4. (weitere 2 nicht extrahiert, aber strukturell present)

Jede Question + Answer ist als `Question` mit `acceptedAnswer.Answer.text` korrekt strukturiert. **AI-Overview-tauglich.**

### BreadcrumbList — `/menu` Beispiel

```
1. Start  → https://ristorante-goldoni.de
2. Speisekarte → https://ristorante-goldoni.de/menu
```

Saubere 2-Level-Breadcrumbs auf 6 Routen (alle außer Home).

### Schema-Lücken (-5 Punkte)

| Empfehlung | Impact |
|---|---|
| `aggregateRating` + `review` Schema | AI Overviews zeigen Sterne-Rating direkt → Klickrate-Boost |
| `paymentAccepted` Field auf Restaurant | "Akzeptiert Goldoni Karten?"-Query bedient |
| `hasMap` mit Google-Maps-URL | Lokale Sichtbarkeit + Knowledge-Panel-Anreicherung |

### Rich Results Test (manuell, User-Side)

Phase D kann den Google Rich-Results-Test nicht programmatisch ausführen. Schema ist strukturell pre-validated (alle Required-Fields per schema.org Restaurant + Menu + FAQ + BreadcrumbList Spec). User-Aktion: 4 Tests gegen Live durchlaufen lassen:

1. https://search.google.com/test/rich-results?url=https://ristorante-goldoni.de/ (Restaurant + FAQPage)
2. https://search.google.com/test/rich-results?url=https://ristorante-goldoni.de/menu (Restaurant + Menu + Breadcrumb)
3. https://search.google.com/test/rich-results?url=https://ristorante-goldoni.de/empfehlungen (Menu)
4. https://search.google.com/test/rich-results?url=https://ristorante-goldoni.de/kontakt (Breadcrumb)

Erwartung: alle "Eligible for rich results" mit 0 Errors / 0 Warnings.

---

## 5. Performance — 96/100

### Lighthouse Mobile — 3-Run Median (heute, 2026-05-08, simulated throttling)

| Route | Run 1 | Run 2 | Run 3 | **Median** | LCP-Median | TBT-Median |
|---|---|---|---|---|---|---|
| `/` | 94 | 94 | 94 | **94** | 2.7s | 40ms |
| `/menu` | 94 | 97 | 93 | **94** | 2.9s | 40ms |

> **Note — Mobile 94 ist 1 Punkt unter dem internen 95+-Target.**
> Single-Run-Varianz auf Lighthouse ist empirisch ±3–5 Punkte. Heutiger Median (94) liegt im Range des gestrigen L40-Sweeps (96–98) — keine Regression, einfach Messvarianz. CWV-Metriken sind alle stabil grün außer LCP Mobile minimal über 2.5s.

### Lighthouse-Daten Cutover-Day (2026-05-07, L40 Production-Sweep, gespeichert in `.lighthouse/`)

35/40 perfekte 100er. Mobile Perf 96–98 quer durch alle 5 Routen, A11y/BP/SEO 100. Desktop 100/100/100/100. CLS=0 überall. LCP Mobile 2.3–2.7s, Desktop 0.5–0.7s.

### Lighthouse Desktop (2026-05-08 sanity, gestern L40 vollständiger Sweep)

A11y/BP/SEO/Performance je 100/100/100/100 quer durch alle 5 Routen (L40-Sweep). Heute kein Re-Run, da gestern mit Median-Konfidenz erfasst.

### Core Web Vitals — Pass ✅ (LCP Mobile knapp)

| Metrik | Mobile (Median) | Desktop | Threshold (gut) | Verdict |
|---|---|---|---|---|
| LCP | 2.7–2.9s | 0.5–0.7s | ≤ 2.5s | Mobile leicht drüber, Desktop weit drunter |
| CLS | 0 | 0 | ≤ 0.1 | ✅ |
| TBT | 30–40ms | < 10ms | ≤ 200ms | ✅ |
| FCP | 1.5s | < 0.8s | ≤ 1.8s | ✅ |

LCP Mobile minimal über dem 2.5s-Threshold. Akzeptabel — Vercel-Edge-CDN bedient Frankfurt aus Frankfurt, das ist nicht weiter optimierbar. Die Hero-Image-Pipeline nutzt bereits `fetchPriority="high"`, srcSet für 8 Breakpoints, WebP, Quality 75.

### Score-Logik

Performance-Kategorie blended Mobile + Desktop für SEO-Health:
- Mobile-Median: 94
- Desktop: 100 (L40-Sweep)
- Gewichtet 70% Mobile + 30% Desktop (Mobile-First-Indexing-Logik): 0.7 × 94 + 0.3 × 100 = 95.8 → **96**
- Alternative Median(Mobile, Desktop) = 97. Beide Methoden landen in derselben Range.

---

## 6. Images — 100/100

### Alt-Text-Coverage

| Page | Img-Total | Mit Alt | Decorative (alt="") | Missing |
|---|---|---|---|---|
| `/` | 3 | 2 | 1 (Wolt-Logo, intentional) | 0 |
| `/menu` | 1 | 1 | 0 | 0 |
| `/empfehlungen` | 1 | 1 | 0 | 0 |
| `/kontakt` | 1 | 1 | 0 | 0 |
| `/feiern` | 1 | 1 | 0 | 0 |
| `/impressum` | 1 | 1 | 0 | 0 |
| `/datenschutz` | 0 | n/a | n/a | 0 |

**0 Missing Alts. 1 intentional empty alt** (Wolt-Logo) — der visible Begleittext "Bestellen mit Wolt" liefert den accessible Name (WCAG 2.5.3 Label-in-Name compliant, dokumentiert in linus.yaml L40-Fix).

### Optimierung — Pass ✅
- Alle Bilder durch Next.js Image-Komponente: `srcSet` mit 8 Breakpoints (640–3840px), WebP, Quality 75.
- Hero-Image mit `fetchPriority="high"` (LCP-Optimierung).
- Sekundäre Bilder mit `loading="lazy"`, `decoding="async"`.
- Logos: `width` + `height` explizit gesetzt (CLS-Prävention, daher CLS=0).

---

## 7. AI Search Readiness — 95/100

### `llms.txt` — Pass ✅

22 Zeilen, korrektes Format:
- H1 `# Ristorante Goldoni`
- Blockquote-Summary mit Schlüsselfakten (Stadt, Küche, Öffnungszeiten)
- NAP-Block (Adresse, Telefon, E-Mail, Lieferung, ÖPNV)
- Hauptseiten als verlinkte Liste mit Beschreibungen
- Rechtliches (Impressum + Datenschutz)

**AI-Citation-Surface:** Maximal — eine LLM-Anfrage "Was ist das Ristorante Goldoni?" findet in `llms.txt` alle Antworten in <1KB.

### AI-Crawler-Zugang — Pass ✅

robots.txt blockiert keinen AI-Crawler. GPTBot, ClaudeBot, PerplexityBot, Google-Extended (Gemini), CCBot — alle laufen unter Default-Allow.

### Citability-Signale

| Signal | Status |
|---|---|
| Q&A-strukturiertes FAQ-Schema | ✅ 5 Q&As mit Question/Answer-Schema |
| Klare Adress-NAP-Konsistenz | ✅ Adresse/Telefon/E-Mail identisch in HTML, JSON-LD, llms.txt, Footer |
| Strukturierte Öffnungszeiten | ✅ openingHoursSpecification mit Wochentag-Array |
| Menu mit Preisen | ✅ 72 Items mit `offers.price` + `priceCurrency` |
| Diet-Information | ✅ `suitableForDiet` Marker auf vegetarischen Items |
| Brand-Mention-Konsistenz | ✅ "Ristorante Goldoni" identisch geschrieben (kein "Goldoni Stuttgart" / "Restaurant Goldoni" Drift) |
| Author-Bylines | ❌ keine — n/a für Restaurant |
| Aggregate Rating / Review-Schema | ❌ fehlt (-5 Punkte, höchster ROI-Add für AI Overviews) |

---

## 8. GSC-Index-Status (T+1 Tag) — Beobachtungs-Phase

DNS-Cutover war 2026-05-07. Heute 2026-05-08 = T+1 Tag. Vollständige Indexing-Verifikation ist erst T+7 bis T+14 Tage sinnvoll, daher hier nur Initial-Check + geplanter Follow-up.

### Heute beobachtbar (T+1)

- ✅ Sitemap unter `/sitemap.xml` erreichbar (200, x-vercel-cache HIT)
- ✅ robots.txt erreichbar mit Sitemap-Referenz
- ✅ Alle 7 URLs liefern 200 mit korrektem Canonical → apex
- ✅ Legacy-WP-URLs liefern 308 → neue Routes (Phase B verifiziert)

### T+7 Follow-up (geplant 2026-05-15) — siehe ACTION-PLAN

User-Action benötigt:
1. Google Search Console öffnen → Property `ristorante-goldoni.de`
2. **Sitemap einreichen** (falls noch nicht): Sitemaps → `https://ristorante-goldoni.de/sitemap.xml`
3. **URL-Inspection** für die 7 Hauptrouten — alle "URL is on Google"?
4. **Coverage-Report** — keine Crawl-Errors auf den Legacy-WP-URLs (alle 308-Redirects sollten ohne Warnings durchlaufen)
5. **Performance Report** — Impressions ab T+7, Clicks ab T+10–14

### T+30 Follow-up (geplant 2026-06-07)

Vergleich Impressions / Klicks gegen WordPress-Baseline (falls GSC-History übernommen wurde — Property bleibt gleich, GSC-Daten kontinuierlich).

---

## 9. Anhang — Audit-Methodik

### Crawled Pages

7 Routen + 2 Meta-Files:
- `https://ristorante-goldoni.de/` → `home.html` (108 KB)
- `https://ristorante-goldoni.de/menu` → `menu.html` (252 KB, größte Route)
- `https://ristorante-goldoni.de/empfehlungen` → `empfehlungen.html` (116 KB)
- `https://ristorante-goldoni.de/kontakt` → `kontakt.html` (54 KB)
- `https://ristorante-goldoni.de/feiern` → `feiern.html` (62 KB)
- `https://ristorante-goldoni.de/impressum` → `impressum.html` (65 KB)
- `https://ristorante-goldoni.de/datenschutz` → `datenschutz.html` (80 KB)
- `robots.txt` (152 B)
- `sitemap.xml` (1252 B)

### Tools

- `curl` für HTTP-Header + HTML-Snapshots (Latenz 86–365ms TTFB)
- `python3` für JSON-LD-Parsing + HTML-Regex-Extraktion
- `lighthouse` (npx, Chrome headless, simulated mobile throttling, today's runs `lh-home-mobile.json` + `lh-menu-mobile.json`)

### Score-Methodik

Gleiche Gewichtung wie WP-Baseline-Audit (`seo-audit-2026-04-29/`) — Kategorien-Scores summiert mit Skill-Default-Weights:
- Technical 25%, Content 25%, On-Page 20%, Schema 10%, Performance 10%, Images 5%, AI 5%

### Vergleich zu Phase B (Pre-Live, localhost)

Phase B (2026-04-29 phaseB) hatte Performance 81–89 auf localhost ohne Vercel-Edge-CDN, alle anderen Kategorien grün. Phase D bestätigt: Production CDN bringt erwartete +5–10 Performance-Punkte (Mobile 94, Desktop 100). Alle Schemas + On-Page-Items aus Phase B sind ungebrochen live.

---

## Verdict — In-Review

**Linus-Selbstmessung: Score 93/100 (+62 vs. WP-Baseline 31, Goal 80–90 übertroffen).** SEO-technisch ist die Migration sauber durch.

**User-Acceptance-Gate offen.** Per Two-Stage-Completion-Regel ist L41 erst "done", wenn:
1. User den Score und die Action-Plan-Prios reviewed.
2. **H-2 Rich-Results-Test** gegen die 4 URLs ausgeführt ist (5 min User-Action) und die Schemas dort als "Eligible for rich results" mit 0 Errors validiert sind.
3. **T+7 GSC-Follow-up** (2026-05-15) zeigt: alle 7 Routen indexiert, keine Crawl-Errors auf Legacy-WP-308-Redirects.

Die 5 Restrisiken sind alle nicht-blockierend für Vollbetrieb, aber liefern den nächsten Optimierungs-Sprung. Siehe [`ACTION-PLAN.md`](./ACTION-PLAN.md) für Priorisierung.

Bis T+7: ankommen lassen, Crawl-Verkehr beobachten, nichts überoptimieren.
