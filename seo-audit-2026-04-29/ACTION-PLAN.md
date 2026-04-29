# SEO-Action-Plan — ristorante-goldoni.de

**Erstellt:** 2026-04-29
**Audit-Quelle:** [`FULL-AUDIT-REPORT.md`](./FULL-AUDIT-REPORT.md)
**Health-Score Baseline:** 31/100 (Legacy-WordPress-Seite)

Die Empfehlungen sind nach Aufwand/Impact priorisiert. **Die wichtigste Empfehlung ist Punkt 1.**

---

## Strategische Empfehlung

**Migrate zur neuen Next.js-Seite, anstatt das alte WordPress zu flicken.**

Die heutige Session hat den neuen Bau bereits SEO-fertig gemacht:

| Audit-Issue | Status auf Legacy-Site | Status auf Next.js-Bau |
|---|---|---|
| Restaurant-Schema | ❌ fehlt | ✅ vorhanden (alle NAP-Felder, Öffnungszeiten, Bilder, Menu-Link) |
| Sitemap | ⚠️ nur `/wp-sitemap.xml` | ✅ `/sitemap.xml` mit Prioritäten |
| robots.txt | ⚠️ WordPress-Default | ✅ explizit, mit Sitemap-Link |
| Mixed Content | ❌ alle Bilder per http:// | ✅ alles https:// |
| Duplicate Titles | ❌ "Kontakt" doppelt | ✅ alle eindeutig |
| Duplicate Descriptions | ❌ 4× "Ristorante Goldoni" | ✅ alle eindeutig + 110-160 Zeichen |
| OG-Image | ❌ fehlt | ✅ `hero-goldoni-velvet.webp` |
| Per-Page Canonical | ⚠️ vorhanden | ✅ vorhanden |
| Title-Template | ❌ inkonsistent | ✅ `%s \| Ristorante Goldoni` |
| Modern Image-Formate | ❌ JPG/PNG aus 2015 | ✅ AVIF + WebP via next/image |
| Security-Header | ❌ fehlen | ✅ Vercel-Default |
| HTML-Gewicht | 130 KB | < 50 KB (statisch generiert) |
| URL-Struktur | ⚠️ `/menue-28/` | ✅ `/menu`, `/feiern`, `/empfehlungen` |

**Erwarteter Health-Score nach Migration: 80–90/100.**

---

## Critical (sofort, vor Live-Schalt)

| # | Maßnahme | Aufwand | Impact | Wo |
|---|---|---|---|---|
| 1 | Next.js-Site auf Vercel deployen, Domain-Switch via Hostinger-DNS | 1 h | 🔥 sehr hoch | Vercel + Hostinger |
| 2 | `/sitemap.xml` bei Google Search Console einreichen | 10 min | hoch | GSC |
| 3 | Google Business Profile aktualisieren (Adresse, Öffnungszeiten, Telefon, Menu-Link) | 30 min | sehr hoch (Local Pack) | Google Business |

> **Wichtig:** Die Migration muss mit 301-Redirects von alten URLs (`/menue-28/`, `/private-feiern-und-firmen-events/`) auf die neuen (`/menu`, `/feiern`) verbunden werden. Sonst gehen bestehende Backlinks verloren. → Empfehlung: Redirect-Map im `next.config.ts` oder via Middleware.

---

## High (innerhalb 1 Woche nach Migration)

| # | Maßnahme | Aufwand | Impact |
|---|---|---|---|
| 4 | 301-Redirects für alle alten WP-URLs | 30 min | hoch |
| 5 | Google Search Console + Bing Webmaster Tools verifizieren (TXT-Record über Hostinger) | 30 min | hoch |
| 6 | Echtes OG-Bild generieren (1200×630, Schriftzug + Tagline auf rotem Samt) | 1 h | mittel |
| 7 | FAQ-Schema-Block hinzufügen ("Wie reserviere ich?", "Welche Öffnungszeiten?", "Gibt es Lieferung?") | 1 h | mittel |
| 8 | Geo-Koordinaten in `restaurant-jsonld` ergänzen (sobald aus Google Business Profile bekannt) | 15 min | mittel |
| 9 | NAP-Konsistenz prüfen — Yelp, Tripadvisor, Apple Maps, Google Maps müssen identische Adresse + Telefon zeigen wie auf der Site | 1 h | hoch |

---

## Medium (innerhalb 1 Monat)

| # | Maßnahme | Aufwand | Impact |
|---|---|---|---|
| 10 | Menu-Schema (`Menu` + `MenuSection` + `MenuItem`) ergänzen — wir haben das `speisekarte.json` schon strukturiert, lässt sich generieren | 2 h | mittel |
| 11 | BreadcrumbList-Schema je Subpage | 1 h | niedrig-mittel |
| 12 | Echte Geschichte / Über-uns-Section schreiben (E-E-A-T) | 2 h Copy | mittel |
| 13 | Alt-Texte für alle Bilder beschreibend setzen (nicht nur "Slide") | 1 h | niedrig (a11y + SEO) |
| 14 | `llms.txt` im Public-Verzeichnis ergänzen | 30 min | niedrig (AI-Suche) |
| 15 | Italienische Cuisine-Keywords im Body integrieren ("Italian restaurant Stuttgart-West", "Antipasti Stuttgart") | Copy-Pass | mittel |
| 16 | Echte Kundenstimmen / Reviews einbinden + `Review`/`AggregateRating`-Schema (nur mit echten Daten!) | 2 h + Daten | mittel |

---

## Low (Backlog)

| # | Maßnahme | Aufwand | Impact |
|---|---|---|---|
| 17 | Hreflang-Erweiterung um englische Variante, falls Übersetzung kommt | TBD | niedrig |
| 18 | Article/Blog-Section für seasonale Inhalte ("Trüffelsaison", "Spargelsaison") — hilft AI-Sichtbarkeit | hoch (laufend) | mittel |
| 19 | Open Reservations API anbinden (OpenTable / Resmio) — bringt Reservation-Schema-Erweiterung | hoch | mittel |

---

## Was NICHT zu tun ist

- **Keine Aggregate-Ratings erfinden.** Nur reale Bewertungen mit Schema markieren. Google straft Fake-Reviews hart ab.
- **Keine Keyword-Stuffing.** Die alte WP-Seite hatte einen `<meta name="keywords">`-Tag — das ist seit ~2009 ranking-irrelevant und kann sogar negativ wirken bei Überfüllung. Auf der Next.js-Seite haben wir diesen Tag bewusst weggelassen.
- **Keine bezahlten Backlinks.** Lokales Restaurant ranking funktioniert über echtes Local-SEO (Google Business + Konsistenz + Reviews), nicht über Linkbuilding.

---

## Checkliste für den Migration-Day

- [ ] Vercel-Projekt verifiziert + Custom Domain konfiguriert
- [ ] Hostinger-DNS auf Vercel umgestellt (A-Record + `www`-CNAME)
- [ ] HTTPS funktioniert (Vercel-Auto-Cert)
- [ ] `https://ristorante-goldoni.de/sitemap.xml` lädt
- [ ] `https://ristorante-goldoni.de/robots.txt` lädt
- [ ] Schema-Validator durchgelaufen: https://validator.schema.org/
- [ ] Rich Results Test: https://search.google.com/test/rich-results
- [ ] OpenGraph Preview: https://www.opengraph.xyz/
- [ ] 301-Redirects funktionieren (`/menue-28/` → `/menu`)
- [ ] Google Search Console — alte Sitemap entfernt, neue eingereicht
- [ ] Google Business Profile — Site-URL aktualisiert
- [ ] Lighthouse-Run desktop + mobile, 95+ Ziel
- [ ] Re-Audit mit `seo-audit`-Skill — Ziel: Health-Score > 80
