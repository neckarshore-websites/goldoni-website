# goldoni-website

Redesign of [ristorante-goldoni.de](https://ristorante-goldoni.de) — Italian restaurant in Stuttgart. Currently WordPress/PHP 8.2, target stack matches `rauhut.com` and `neckarshore.ai` (Next.js 16 + React 19 + Tailwind v4 + TypeScript, deployed on Vercel).

This is a barter project — not paid. See [BRIEFING.md](./BRIEFING.md) for context, scope, and design direction.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.3 (App Router) |
| UI | React 19.2.4 + Tailwind CSS v4 |
| Language | TypeScript 5 |
| Fonts | Inter Variable + Playfair Display Variable (self-hosted, DSGVO-compliant) |
| Hosting | Vercel |
| Lighthouse target | 95+ desktop and mobile |

## Run locally

```bash
npm install
npm run dev   # http://localhost:3002
```

(Port 3002 is used so it can run alongside `rauhut.com` on 3001 and `neckarshore.ai` on 3000.)

## Project layout

```
src/
  app/            # App Router pages (page.tsx, layout.tsx, route folders)
  components/     # Reusable UI components
  fonts/          # Self-hosted woff2 (DSGVO)
  lib/            # Helpers, site-wide config (site.ts = single source of truth)
public/
  images/         # Restaurant photos (placeholder until owner ships final set)
docs/             # Briefing and feature specs (BRIEFING.md, skill briefs, etc.)
```

## Status

MVP bootstrap stage (Linus session 2026-04-28). Landing skeleton live, full pages and content come iteratively. See [BRIEFING.md](./BRIEFING.md) for scope decisions.
