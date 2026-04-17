@AGENTS.md

## Repo Context

- **Owner:** Linus (Frontend Artist)
- **GitHub home:** `GmanFooFoo/goldoni-website` (User's personal GitHub — NOT the `neckarshore-ai` Org; this is a private barter project, not a Neckarshore AI product)
- **Domain:** `ristorante-goldoni.de` — currently WordPress/PHP 8.2 at the existing host. Migration path TBD in a dedicated session.
- **Context:** Barter deal between the User and a friend who is part-owner of the restaurant. No cash — the User gets meals/pizza in exchange for maintaining the site. This affects priorities: no deadline pressure, but also no budget for fancy external tooling. Sustainable, low-maintenance, self-pflegbar is the goal.

## Status

**Briefing stage.** No code, no Next.js bootstrap, no design system. Only `BRIEFING.md` + this file. Scope decisions (full relaunch vs. landing-only, CMS vs. manual, reservation handling, etc.) happen in a dedicated Goldoni session with the User after scope is confirmed with the friend.

## Working Directory Rule

This repo lives at `~/Developer/projects/goldoni-website/`. Every Bash command must start with:

```bash
cd ~/Developer/projects/goldoni-website && ...
```

The Claude Code harness resets `cwd` after every Bash call. Unscoped commands risk writing to the wrong repo (rauhut-website, neckarshore-website, OMNIXIS, planning repos, Obsidian vault). Same discipline as `neckarshore-website` and `rauhut-website`. Non-negotiable.

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
- Playwright E2E (v1 manuelles Testing)
- CI/CD Extras über Vercel hinaus
