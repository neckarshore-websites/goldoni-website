/**
 * Per-page Metadata helper for Ristorante Goldoni routes.
 *
 * **Why this exists (F1 from 2026-05-15 post-live SEO audit):**
 * Next.js Metadata API *replaces* (not merges) `openGraph` and `twitter`
 * blocks when a child segment defines any field inside them. Without per-page
 * openGraph, social-card previews on `/menu`, `/empfehlungen`, etc. fall back
 * to the layout's generic "Ristorante Goldoni — Bella Italia in Stuttgart"
 * og:title for every route, instead of the route-specific title.
 *
 * Reference: `node_modules/next/dist/docs/01-app/.../generate-metadata.md`
 * lines 1328 / 1358 — "All openGraph fields from app/layout.js are replaced
 * in app/blog/page.js because app/blog/page.js sets openGraph metadata."
 *
 * This helper builds a complete openGraph + twitter block per page,
 * sharing siteName / locale / image / image-alt across all routes without
 * each page-file having to spell them out.
 */
import type { Metadata } from "next";

const BRAND = "Ristorante Goldoni";

const DEFAULT_OG_IMAGE = {
  url: "/images/hero-goldoni-velvet.webp",
  width: 1200,
  height: 630,
  alt: "Ristorante Goldoni — Schriftzug auf rotem Samt",
} as const;

export interface PageMetadataOptions {
  /**
   * Short page title. Gets the "%s — Ristorante Goldoni" suffix automatically
   * unless `absoluteTitle` is true.
   *
   * Examples:
   * - `"Speisekarte"` → `<title>Speisekarte — Ristorante Goldoni</title>`
   * - `"Feiern bei Goldoni — Private Anlässe in Stuttgart"` with
   *   `absoluteTitle: true` → title used verbatim.
   */
  title: string;

  /** Description for `<meta name="description">`, og:description, twitter:description. */
  description: string;

  /** Canonical path, e.g. `"/menu"`. Also used as og:url and alternates.canonical. */
  path: string;

  /** Optional per-page OG image override. Default: hero-goldoni-velvet. */
  ogImage?: { url: string; width?: number; height?: number; alt: string };

  /**
   * When true, `title` is used verbatim everywhere (matches Next.js
   * `title.absolute` semantics). Use when the page title already contains
   * the brand name (avoids "Goldoni — Ristorante Goldoni" duplication).
   */
  absoluteTitle?: boolean;

  /** Legal pages: index=true, follow=false. */
  noFollow?: boolean;
}

export function pageMetadata(opts: PageMetadataOptions): Metadata {
  const fullTitle = opts.absoluteTitle ? opts.title : `${opts.title} — ${BRAND}`;

  const image = opts.ogImage
    ? {
        url: opts.ogImage.url,
        width: opts.ogImage.width ?? DEFAULT_OG_IMAGE.width,
        height: opts.ogImage.height ?? DEFAULT_OG_IMAGE.height,
        alt: opts.ogImage.alt,
      }
    : DEFAULT_OG_IMAGE;

  const meta: Metadata = {
    title: opts.absoluteTitle ? { absolute: opts.title } : opts.title,
    description: opts.description,
    openGraph: {
      title: fullTitle,
      description: opts.description,
      url: opts.path,
      siteName: BRAND,
      locale: "de_DE",
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: opts.description,
      images: [image.url],
    },
    alternates: { canonical: opts.path },
  };

  if (opts.noFollow) {
    meta.robots = { index: true, follow: false };
  }

  return meta;
}
