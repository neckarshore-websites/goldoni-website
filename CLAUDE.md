@AGENTS.md

## Repo Context

- **Owner:** Linus (Frontend Artist)
- **GitHub home:** `neckarshore-websites/goldoni-website` (moved from the personal GitHub account 2026-06-11; still a private barter project, not a Neckarshore AI product)
- **Domain:** `ristorante-goldoni.de` — currently WordPress/PHP 8.2 at the existing host. Migration path TBD in a dedicated session.
- **Context:** Barter deal between the User and a friend who is part-owner of the restaurant. No cash — the User gets meals/pizza in exchange for maintaining the site. This affects priorities: no deadline pressure, but also no budget for fancy external tooling. Sustainable, low-maintenance, self-pflegbar is the goal.

## Status

**Live production.** `ristorante-goldoni.de` läuft auf Vercel mit Next.js + selbst-gehosteten Fonts. Aktuelle Routen: `/` (Startseite), `/menue`, `/feiern` (Feier-Anfrage-Formular), `/kontakt` (Kontaktformular), `/empfehlungskarte`, `/api/*` (Form-Endpoints + Diagnose). SEO-Post-Live-Audit (L41) lief Mai 2026, GSC-404-Redirects (F3) gesetzt. Letzter Security-Bump: Next.js 16.2.6 (PR #72, 13 CVEs zu).

Briefing-Phase ist seit Wochen vorbei — die ursprüngliche "kein Code, keine Bootstrap"-Doku unten war bis vor diesem CLAUDE.md-Update Drift. Verbleibende Scope-Klärungen sind kein Briefing-Backlog, sondern punktuelle Add-Ons: CMS-Frage (aktuell statisch in Repo), Online-Reservierung (aktuell Telefon/Mail per Brief), Events-Pipeline (statisch). Werden in dedizierter Goldoni-Session mit User + Restaurant-Freund entschieden.

## Working Directory Rule

This repo lives at `~/Developer/projects/neckarshore-websites/goldoni-website/`. Every Bash command must start with:

```bash
cd ~/Developer/projects/neckarshore-websites/goldoni-website && ...
```

The Claude Code harness resets `cwd` after every Bash call. Unscoped commands risk writing to the wrong repo (rauhut-website, neckarshore-website, omnopsis-backend, planning repos, Obsidian vault). Same discipline as `neckarshore-website` and `rauhut-website`. Non-negotiable.

## Rules

Same quality bar as `neckarshore-website` and `rauhut-website`:

- Mobile-first responsive design
- Lighthouse 95+ target on all metrics (desktop + mobile)
- No JS frameworks beyond React/Next.js
- Self-hosted fonts (DSGVO)
- Commit after each section / logical block
- Do NOT push to production domain until User approves — and before that, the friend (restaurant owner) approves the design direction at least once
- German primary, Italian as stylistic accent (bella italia ohne Kitsch)

## Definition of Done

- Lighthouse 95+ desktop + mobile
- Mobile + Desktop visual check
- No browser console errors
- Build green (`npm run build`)
- Lint green (`npm run lint`)
- E2E tests green wenn Forms oder Server-Actions berührt wurden (`npm run test:e2e`) — Playwright-Suite deckt `/kontakt` + `/feiern` ab
- Committed + pushed

## Visuelle Abnahme — HARTE REGEL

Du entscheidest NIE, wann ein visuelles Ergebnis "fertig" ist. User entscheidet. Beim Goldoni-Projekt zusätzlich: der Freund (Restaurant-Mit-Eigentümer) muss die Design-Richtung mindestens einmal bestätigen, bevor wir live gehen. Linus baut, zeigt, beschreibt. Lighthouse-Scores sind objektiv und reportbar. Subjektive "passt" oder "sieht gut aus" Entscheidungen sind User- (und für Goldoni: Kunden-) Territorium.

## Content Source

Heute: `BRIEFING.md` in diesem Repo (Scrape-Snapshot der aktuellen Site + offene Fragen).

Später: entweder Markdown-Files im Repo (Linus pflegt), ein leichtes CMS (Decap/Sanity — TBD), oder strukturierte Daten in `lib/data.ts`. Entscheidung in Scope-Klärung.

## Out of Scope (v1)

- Analytics / Tracking (kein Cookie-Banner nötig falls möglich)
- Online-Reservierung (Telefon + Mail reicht v1; Formular-Only als Option)
- Delivery-Integration (Wolt-Link im Footer reicht)
- Mehrsprachigkeit (Deutsch primär; Italienisch als Stil-Akzent)
- Blog / Events-CMS (Events-Seite kann statisch sein)
- SEO-Overengineering
- CI/CD Extras über Vercel hinaus

## In-Scope-Erweiterungen seit v1-Start

- **Playwright E2E** (PR #32, 2026-04-30) — ursprünglich als Out-of-Scope geplant, aber durch den `inquiry.ts`-404-Bug aus PR #32 als notwendige Defensive eingezogen. Suite deckt aktuell `/kontakt` + `/feiern` ab. Bei Touch von Forms / Server-Actions: `npm run test:e2e` muss grün sein.
- **`/api/smtp-verify`** Diagnose-Endpoint (PR #34, 2026-04-30) — Token-gated Smoke-Test für SMTP-Konfig. Bleibt im Repo, kann jederzeit per `SMTP_VERIFY_TOKEN` aktiviert/deaktiviert werden.
