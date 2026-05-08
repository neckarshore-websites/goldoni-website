# Phase D Action Plan — ristorante-goldoni.de Post-Live

**Basis:** [`FULL-AUDIT-REPORT.md`](./FULL-AUDIT-REPORT.md) — Score 93/100 (Ziel 80–90 übertroffen, +62 vs. WP-Baseline)

Keiner der Findings ist Blocker für Vollbetrieb. Reihenfolge nach ROI / Effort.

---

## Critical (kein Eintrag)

Keine kritischen Issues. Migration ist sauber.

---

## High Priority — innerhalb 1 Woche

### H-1 — Title-Doppelpräfix beheben (Code-Fix, XS, Linus)

**Symptom:** 6/7 Pages haben Title `[Page] — Ristorante Goldoni | Ristorante Goldoni` (Brand zwei Mal).

**Ursache:** Vermutlich `metadata.title` per Page setzt `[Page] — Ristorante Goldoni`, und das Root-Layout `metadata.title.template` ergänzt automatisch ` | Ristorante Goldoni`. Doppelte Brand.

**Fix:** Im Root-Layout entweder
- `template: "%s"` (Pages liefern bereits ihren vollen Title), oder
- Pages liefern nur den Page-Anteil ohne ` — Ristorante Goldoni`, Template ergänzt ihn.

**Zielzustand:**
- `/menu` → `Speisekarte — Ristorante Goldoni`
- `/feiern` → `Feiern bei Goldoni — Private Anlässe in Stuttgart` (auch < 60 Zeichen, kein Truncation)

**Effort:** 15 min Code + Lighthouse-Re-Run.

**Impact:** Minor SEO, mid-impact Klick-Optik in SERPs (saubere Brand-Präsenz statt Doppelnennung).

---

### H-2 — Rich Results Test ausführen (User-Manual, XS)

**Action:** 4 URLs durch [Google Rich Results Test](https://search.google.com/test/rich-results) laufen lassen:

1. `https://ristorante-goldoni.de/` → erwartet **Restaurant** + **FAQPage**
2. `https://ristorante-goldoni.de/menu` → erwartet **Menu** + **Breadcrumb** (Restaurant ist auch da, Tool zeigt aber nur Rich-Results-eligible Types)
3. `https://ristorante-goldoni.de/empfehlungen` → erwartet **Menu**
4. `https://ristorante-goldoni.de/kontakt` → erwartet **Breadcrumb**

**Erwartung:** Alle 4 "Eligible for rich results", 0 Errors, 0 Warnings.

**Bei Errors:** Screenshot + Findings zurück an Linus für Schema-Fix-Pass.

**Effort:** 5 min User-Action.

---

### H-3 — Google Search Console Sitemap einreichen (User-Manual, XS)

**Action:**
1. GSC → Property `https://ristorante-goldoni.de` (DNS-verified)
2. Sitemaps → URL hinzufügen: `sitemap.xml`
3. Status sollte innerhalb 24h "Erfolgreich" + Discovered URLs = 7

**Effort:** 2 min User-Action.

**Impact:** Beschleunigt Crawl-Discovery der neuen Routes. Ohne Sitemap-Submission entdeckt Google die 7 Routen über organisches Crawling, was Tage statt Stunden dauert.

---

## Medium Priority — innerhalb 1 Monat

### M-1 — Security Headers vervollständigen (Linus, S)

**Findings:** HSTS ist live, aber `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` fehlen.

**Fix:** `next.config.ts` mit `headers()` async-Funktion erweitern:

```typescript
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; ..." },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ]
  }];
}
```

**Caveat:** CSP muss inline-Scripts berücksichtigen (Next/Image, Theme-Init-Script, JSON-LD). Vorsichtig schrittweise einführen, sonst zerschießt es das Theme-Toggle und/oder Bilder. Erst Report-Only-Mode, dann Enforce.

**Effort:** 60 min (Spec + iterative CSP-Tuning + Smoke-Tests + E2E).

**Impact:** Mozilla Observatory C → A. Best-Practice-Check in Lighthouse bleibt 100 (das deckt die fehlenden Header bereits indirekt ab, der Score-Hit ist Audit-intern).

---

### M-2 — www-Subdomain auf 308-Redirect setzen (Linus + User, XS)

**Symptom:** `https://www.ristorante-goldoni.de/` antwortet 200 statt 308 → apex.

**Mitigation:** Canonical-Tag (`<link rel="canonical" href="https://ristorante-goldoni.de"/>`) ist im HTML present, Google respektiert das.

**Sauberer Fix:**

Vercel Dashboard → Project `goldoni-website` → Settings → Domains:
- Prüfen ob `www.ristorante-goldoni.de` als zweite Domain konfiguriert ist mit "Redirect to ristorante-goldoni.de" (308).
- Falls "Continue without redirect" gewählt war: auf "Redirect to apex" umstellen.

**Alternative:** Code-Level via `next.config.ts` `redirects()` mit `has: [{ type: 'host', value: 'www.ristorante-goldoni.de' }]` → permanent → apex.

**Effort:** 5 min User-Action via Vercel Dashboard ODER 10 min Code-Pass.

**Impact:** Niedrig (Canonical mitigiert), aber Audit-Hygiene und Mozilla-Best-Practices-Konform.

---

### M-3 — `aggregateRating` + `review` Schema (Linus, M)

**Lücke:** Restaurant-Schema hat keine Sterne-Ratings, daher rendert Google in AI Overviews keine ⭐⭐⭐⭐☆ Marker.

**Fix:**
1. Aktuelles Google-Rating + Review-Count manuell beim Restaurant erfragen oder via Google-My-Business-API ziehen (wenn API-Zugang da ist; sonst Snapshot ist ok).
2. Zu Restaurant-Schema hinzufügen:

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.6",
  "reviewCount": "287",
  "bestRating": "5",
  "worstRating": "1"
}
```

3. Optional: 3–5 ausgewählte Google-Reviews als `review` Array (Schema.org `Review` Type).

**Effort:** 30 min wenn Rating + Count bekannt; 2h wenn API-Integration für Auto-Sync gewünscht (aber Out-of-Scope per BRIEFING.md).

**Impact:** AI Overviews + Local Pack Knowledge-Panel werden Sterne anzeigen. Klickrate +5–15% empirisch (lokal-Restaurant-Studien).

**Caveat:** Nur einbauen wenn die Zahl real reflektiert was auf Google steht. Sonst Schema-Spam-Risiko.

---

### M-4 — Description-Polish Impressum + Datenschutz (Linus, XS)

**Symptom:**
- `/impressum` Description nur 38 Zeichen ("Anbieterkennzeichnung gemaess § 5 DDG.") — Google füllt mit eigenem Snippet.
- `/datenschutz` Description 62 Zeichen ("Informationen zur Verarbeitung personenbezogener Daten gemaess Art. 13 DSGVO.") — knapp.

**Fix:** Auf 120–150 Zeichen ausbauen, z. B.:
- Impressum: "Anbieterkennzeichnung des Ristorante Goldoni in Stuttgart-West gemäß § 5 DDG. Vollständige Kontaktdaten und verantwortliche Person."
- Datenschutz: "Wie das Ristorante Goldoni personenbezogene Daten gemäß Art. 13 DSGVO verarbeitet. Cookies, Server-Logs, Reservierungs-Anfragen, Kontakt-Formular."

**Effort:** 5 min Code-Pass, 2 Pages.

**Impact:** Niedrig. Legal-Pages ranken selten, aber Google-SERP-Snippet wird besser kontrollierbar.

---

### M-5 — `paymentAccepted` + `hasMap` Schema (Linus, XS)

**Erweiterung Restaurant-Schema:**

```json
"paymentAccepted": "Cash, Credit Card, EC Card",
"hasMap": "https://maps.app.goo.gl/u3PAUvKHqcANve797"
```

**Erfordert:** Owner-Bestätigung welche Zahlungsmethoden akzeptiert werden (User → Owner-Item parallel zu L25 House-Codes).

**Effort:** 5 min Code wenn Owner-Info da ist.

**Impact:** Bedient "Akzeptiert Goldoni Karten?"-AI-Queries, Knowledge-Panel-Anreicherung.

---

## Low Priority — Backlog

### L-1 — Feiern-Title kürzen

`Feiern bei Goldoni — Private Anlässe in Stuttgart | Ristorante Goldoni` (70 Zeichen) → nach H-1-Fix wäre es `Feiern bei Goldoni — Private Anlässe in Stuttgart` (50 Zeichen, ✓).

(Wird durch H-1 mit erledigt.)

### L-2 — Spotify-Playlist-Embed JSON-LD

Footer-Link zur Hauseigenen Spotify-Playlist könnte als `MusicPlaylist` Schema annotiert werden. Quirky brand detail, aber kein SEO-Impact.

**Effort:** 10 min. **Skip-able.**

---

## T+7 / T+14 / T+30 Follow-Ups

### T+7 (2026-05-15) — Linus + User

| # | Was | Wer | Tool |
|---|---|---|---|
| 1 | GSC URL-Inspection für 7 Routen — alle "URL is on Google"? | User | GSC Web-UI |
| 2 | GSC Coverage-Report — keine Crawl-Errors auf Legacy-WP-308-Redirects | User | GSC Web-UI |
| 3 | Lighthouse-Re-Run nach H-1 (Title-Fix) + M-1 (Headers) wenn deployed | Linus | npx lighthouse |
| 4 | Site-Operator-Suche: `site:ristorante-goldoni.de` — sind alle 7 Routen indexiert? | User oder Linus | Google.com |

### T+14 (2026-05-22) — Linus

| # | Was | Wer |
|---|---|---|
| 5 | seo-audit Re-Run gegen Live (Phase E) — Score-Bewegung nach H-1/M-1/M-2/M-3 messen | Linus |
| 6 | GSC Performance-Report — erste Klick-Daten gegen WP-Baseline-History (falls verfügbar) | User → Linus |

### T+30 (2026-06-07) — User + Linus

| # | Was | Wer |
|---|---|---|
| 7 | GSC 30-Tage Performance-Report — Impressions/Clicks/CTR/Position vs. WP-Pre-Cutover | User |
| 8 | Bewertung: Migrations-Lift in Zahlen dokumentieren (für künftige Linus-Migrations-Patterns) | Linus |

---

## Skip — bewusst nicht aufgenommen

- **Cookie-Banner / Cookiebot etc.** — Out-of-Scope per CLAUDE.md (Goldoni hat aktuell keine Tracking-Cookies, also kein Banner nötig).
- **Mehrsprachigkeit (DE/IT)** — Out-of-Scope per CLAUDE.md.
- **Author-Bylines / E-E-A-T-Author-Schema** — n/a für Restaurant-Site.
- **Photo-to-Markdown-Skill für Empfehlungskarte** — eigenes Backlog-Item L27, separat von SEO.

---

## Priorisierung kompakt

| # | ID | Item | Wer | Effort | Impact |
|---|---|---|---|---|---|
| 1 | H-1 | Title-Doppelpräfix Code-Fix | Linus | XS (15min) | Mid |
| 2 | H-2 | Rich Results Test | User | XS (5min) | Verification |
| 3 | H-3 | GSC Sitemap einreichen | User | XS (2min) | Crawl-Speed |
| 4 | M-1 | Security Headers Suite | Linus | S (60min) | Mid |
| 5 | M-2 | www → 308 Redirect | User+Linus | XS (5min) | Low (Hygiene) |
| 6 | M-3 | aggregateRating Schema | Linus | M (30min) | High (AI Overviews) |
| 7 | M-4 | Description-Polish Legal | Linus | XS (5min) | Low |
| 8 | M-5 | paymentAccepted + hasMap | Linus | XS (5min) | Mid |

**Empfehlung Reihenfolge:** H-1 + H-2 + H-3 sofort (User-Triple-Pass + Linus-Single-PR) → bis T+7 erledigt → Phase E Re-Audit am 2026-05-22 → bei grünem Re-Audit M-3 als Bonus-Sprint für AI-Citation-Boost.
