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
- Lighthouse: A11y / Best Practices / SEO **hard @95** (CI-gating); Performance **soft-warn** (advisory, never blocks CI) — see [Lighthouse Device Matrix](#lighthouse-device-matrix) below
- No JS frameworks beyond React/Next.js
- Self-hosted fonts (DSGVO)
- Commit after each section / logical block
- Do NOT push to production domain until User approves — and before that, the friend (restaurant owner) approves the design direction at least once
- German primary, Italian as stylistic accent (bella italia ohne Kitsch)

## Lighthouse Device Matrix

Three profiles. **Performance is soft-warn on all of them** (advisory, never blocks CI); **Accessibility / Best Practices / SEO are hard @95** on all of them (a drop fails CI). Profiles live in `scripts/lighthouse-profiles.mjs`; the regression test `scripts/lighthouse-profiles.test.mjs` locks the shape (`npm run test:lighthouse:unit` — 6 checks, ~0.1s, no Chrome). Ported to Goldoni 2026-06-18 (#103) as the estate standard.

| # | Profil | Form Factor | Network | CPU | Perf Gate | Perf Warn-Line |
|---|--------|-------------|---------|-----|-----------|----------------|
| 1 | Desktop | desktop | `--preset=desktop` (LAN) | 1× | Soft-Warn | 80 |
| 2 | Mobile 5G | mobile | 20ms / ~50 Mbps | 4× | Soft-Warn | 90 |
| 3 | Mobile 4G | mobile | 150ms / ~1.6 Mbps (Slow-4G) | 4× | Soft-Warn | 90 |

5G is faster than 4G — the network ordering is correct. The pre-2026-06-18 "Mobile Slow (Edge-5G)" profile (400 Kbps / 6× CPU) was **deleted**: 400 Kbps is slower than 4G, so the "5G" label inverted reality; sub-4G is an unserviceable audience (restaurant guests are mobile/5G-default).

### Gate Philosophy (German Rauhut directive, 2026-06-18 — estate standard)

- **Performance is soft-warn everywhere.** Perf scores track shared-runner CPU jitter, not the site — on the 1× desktop preset a fast static page swings {70, 86, 93, 98, 100} ⇔ TBT noise while LCP <1s / CLS stay rock-solid. A hard perf gate cried wolf and got admin-bypassed repeatedly across the estate, so it is now an **advisory warning line** per profile: the run prints `⚠` and logs the metric under "Soft warnings", but the exit code is unchanged. No hard perf gate on 4G — the audience is 5G-default.
- **A11y / Best Practices / SEO are hard @95 on all three profiles** — deterministic categories (the site hits ~100), so a drop is a real defect, not runner noise. These are the *only* failures that change the exit code.

### Commands

- `npm run lighthouse:quick` — all 3 profiles (CI mode, assumes server on :3000)
- `npm run lighthouse:desktop` / `npm run lighthouse:mobile` (4G) / `npm run lighthouse:5g` — single profile for dev-loop
- `npm run test:lighthouse:unit` — profile-shape regression test (no Chrome; ~0.1s)
- `npm run lighthouse` — full pipeline (build + start + all profiles + stop)

## Definition of Done

- Lighthouse: A11y / Best Practices / SEO @95 hard (CI-gating); Performance soft-warn (advisory — logged, not gated). See Lighthouse Device Matrix.
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
