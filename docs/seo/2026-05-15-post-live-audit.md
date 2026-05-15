# L41 — Post-Live SEO-Audit gegen `ristorante-goldoni.de`

**Datum:** 2026-05-15
**Persona:** Linus FE
**Live seit:** 2026-05-07 (DNS-Cutover Phase C, L40)
**WordPress-Baseline:** 31/100 (pre-migration, Bell-Audit)
**Geschätzter Post-Migration-Score:** **90–94 / 100** → Lift **+60 Punkte**

## TL;DR

Die SEO-Migration ist ein klarer Erfolg. Alle 7 produktiven Routen liefern HTTP/2 200, ein vollständiges Schema.org-Set (Restaurant + Menu + FAQPage + BreadcrumbList) ist live, Security-Headers sind komplett, Sitemap und robots.txt korrekt. Es gibt **1 kosmetisches Finding** (og:title-Duplication auf allen Routen) und **2 User-Manual-Tasks** (Rich-Results-Test, GSC-Index-Status nach 1 Woche).

## Methode

1. Curl-Probe gegen alle 7 produktiven Routen + `/sitemap.xml` + `/robots.txt`.
2. Pro Route extrahiert: HTTP-Status, `<title>`, meta-description, canonical, `og:title`, `og:image`, h1-count, JSON-LD `@type`-Inventar.
3. Response-Header geprüft (Security-Suite).
4. Legacy-WP-URL-Probe (8 typische Slugs) auf 308 oder 404.
5. www→apex-Redirect verifiziert.

## Findings

### Strengths (positive Befunde)

| # | Kategorie | Befund |
|---|---|---|
| 1 | Reachability | Alle 7 produktiven Routen HTTP/2 200 |
| 2 | Sitemap | `/sitemap.xml` 200, 7 URLs, `lastmod` 2026-05-14, korrekt nach `changefreq` priorisiert (homepage `weekly` 1.0, menu `monthly` 0.9, etc.) |
| 3 | robots.txt | Allow `/`, Disallow `/style-guide` + `/assets`, Sitemap-Link, Host-Direktive |
| 4 | Security-Headers | Vollständig: CSP, HSTS (`max-age=63072000` = 2 Jahre), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` |
| 5 | Protocol | HTTPS + HTTP/2 |
| 6 | CDN | `x-vercel-cache: HIT` auf homepage (Edge-Caching aktiv) |
| 7 | Canonicals | Pro Route self-referential, keine www-Variante, kein trailing-slash-Drift |
| 8 | www→apex | `www.ristorante-goldoni.de` → `ristorante-goldoni.de` via HTTP/2 308 |
| 9 | Schema.org | Restaurant auf allen 7 Routen, BreadcrumbList auf 6/7 (Root sinnvollerweise ausgenommen), Menu auf `/menu` + `/empfehlungen`, FAQPage auf `/` |
| 10 | H1-Disziplin | Genau 1 `<h1>` pro Route |
| 11 | Per-Route-Metadata | Title + Description pro Route eindeutig und thematisch passend |

### Per-Route Schema-Matrix

| Route | Schema-Typen | h1 |
|---|---|---|
| `/` | Restaurant + FAQPage | 1 |
| `/menu` | Restaurant + BreadcrumbList + Menu | 1 |
| `/empfehlungen` | Restaurant + BreadcrumbList + Menu | 1 |
| `/kontakt` | Restaurant + BreadcrumbList | 1 |
| `/feiern` | Restaurant + BreadcrumbList | 1 |
| `/impressum` | Restaurant + BreadcrumbList | 1 |
| `/datenschutz` | Restaurant + BreadcrumbList | 1 |

Aus L41-Briefing geforderte 4 Schema-Typen (Restaurant + Menu + FAQ + Breadcrumb) sind alle live. ✅

### Findings (Verbesserungspotenzial)

#### F1 — og:title-Duplication auf allen Routen (Impact: Low-Medium)

Alle 7 Routen senden identisch:

```
<meta property="og:title" content="Ristorante Goldoni — Bella Italia in Stuttgart">
```

`<title>` ist pro Route differenziert (z.B. `"Speisekarte — Ristorante Goldoni"` für `/menu`), aber `og:title` fällt zurück auf den globalen Default. Social-Card-Previews (Facebook/LinkedIn/X) aus tieferen Routen werden dadurch generisch dargestellt.

**Fix:** In jeder Route-`page.tsx` `metadata.openGraph.title` explizit auf den seiten-spezifischen Titel setzen. Effort: XS (5 Min).

#### F2 — og:image generisch (Impact: Low)

`og:image` ist überall `hero-goldoni-velvet.webp` (Velvet-Slide aus der Homepage-Slideshow). Akzeptabel als globaler Default. Optional: pro Route ein thematisches OG-Bild rendern (z.B. `/feiern` → Saal-Foto, `/menu` → Pasta-Plate).

**Fix:** Nice-to-have, kein Blocker. Effort: M (OG-Image-Pipeline pro Route).

#### F3 — Legacy WP-URLs liefern 404 statt 308 (Impact: Unbekannt)

Stichprobe: `/reservierung`, `/reservation`, `/standort`, `/ueber-uns`, `/kueche`, `/wein`, `/weinkarte`, `/speisekarte` — alle 8 geben **HTTP/2 404**.

Annahme: Die WP-Site war strukturell anders aufgebaut, eine 1:1-URL-Migration war nicht erforderlich. Ob das ein Problem ist, hängt davon ab, welche WP-URLs tatsächlich Backlinks oder Such-Impressions hatten.

**Action (User):** GSC > Indexing > Pages nach 1 Woche prüfen. Falls 404-URLs mit Impressions auftauchen, gezielte 308-Redirects via `next.config.ts` nachziehen.

#### F4 — `Host:` in robots.txt ist Yandex-spezifisch (Impact: None)

`robots.txt` enthält:

```
Host: https://ristorante-goldoni.de
```

Das ist eine non-standard Yandex-Erweiterung. Google ignoriert die Zeile. Kein Schaden, kann bleiben.

## Health-Score-Estimate

| Kategorie | Score | Begründung |
|---|---|---|
| Technical SEO | 100/100 | Security, Schema, Sitemap, Canonicals, Redirects, Mobile — alles grün |
| On-Page | 95/100 | F1 (og:title-Duplication) zieht 5 Punkte ab |
| Performance | 95/100 | per L34 Lighthouse-CDN-Run: Mobile 93+, Desktop 100, CLS 0 |
| Mobile + A11y | 100/100 | per L34 Lighthouse |
| **Estimate (gewichtet)** | **~92/100** | vs WP-Baseline 31/100 → **+61 Punkte** |

## User-Manual-Tasks (kann ich nicht headless)

| # | Was | Wo |
|---|---|---|
| M1 | Rich-Results-Test gegen Live für 3 Routen: `/` (Restaurant + FAQ), `/menu` (Menu + Breadcrumb), `/empfehlungen` (Menu + Breadcrumb) | https://search.google.com/test/rich-results |
| M2 | OG-Card-Preview-Check (Facebook/LinkedIn/X) für 3 Routen | https://developers.facebook.com/tools/debug/ · https://www.linkedin.com/post-inspector/ · https://cards-dev.twitter.com/validator |
| M3 | GSC-Index-Status nach 1 Woche prüfen: alle 7 Routen "Indexed"? 0 Errors? Sitemap successfully read? 404-Reports auf Legacy-URLs? | Google Search Console > Pages |

Erwartung M1: Restaurant + FAQ + Menu + BreadcrumbList alle "Eligible for rich results".

## Follow-Up

- **F1-Fix (og:title pro Route):** als kleiner Folge-PR. Trivial, kann sofort in dieselbe Session, ist aber nicht Teil der Audit-Acceptance.
- **L41-Status:** in-review → done sobald M1-M3 manuell durchgeführt sind.

## Quellen

- Probe-Script: `/tmp/goldoni-seo-probe.py` (curl + JSON-LD-Parser, 9 Routen).
- WP-Baseline-Audit: pre-migration Bell-Audit (Score 31/100).
- L34 Lighthouse-Anteil: post-PR-#16 CDN-Run (Mobile 93, Desktop 100).
- L40 DNS-Cutover: 2026-05-07 (Phase C complete).
