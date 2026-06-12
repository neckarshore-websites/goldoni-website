import type { NextConfig } from "next";
import { buildLegacyRedirects } from "./src/lib/redirects";

const nextConfig: NextConfig = {
  images: {
    // Prefer AVIF over WebP for clients that support it.
    // AVIF compresses ~30% smaller than WebP at equal perceptual quality,
    // reducing LCP for the hero photo on mobile.
    formats: ["image/avif", "image/webp"],
  },
  /**
   * Disable Next.js's automatic trailing-slash redirect so it doesn't
   * intercept legacy WordPress URLs before our specific 1-hop mappings.
   * We re-add a generic trailing-slash strip as the LAST entry in
   * `redirects()` (see src/lib/redirects.ts) — that keeps clean Next.js
   * URLs canonicalised without forcing legacy traffic through 2 hops.
   */
  skipTrailingSlashRedirect: true,
  /**
   * Redirects in priority order:
   *
   *   1. Host canonicalisation (Phase D ACTION-PLAN M-2):
   *      www.ristorante-goldoni.de/* -> ristorante-goldoni.de/*
   *      308 permanent. Vercel does NOT auto-redirect www in this
   *      project's domain config — we enforce in code so the policy
   *      lives in version control rather than relying on Dashboard
   *      state. The HTML `<link rel="canonical">` already points to
   *      apex on every page, so SEO impact is purely hygiene; this
   *      patch eliminates the duplicate-origin signal entirely.
   *
   *      Trade-off: a request to a legacy WP URL on the www subdomain
   *      (e.g. `https://www.ristorante-goldoni.de/menue-28/`) takes
   *      two hops — first to apex, then through the legacy redirect.
   *      That subset of traffic is vanishingly small (modern links
   *      use apex; legacy deeplinks use apex from the WP era too).
   *
   *   2. Legacy WordPress redirects — see src/lib/redirects.ts.
   *      `permanent: true` emits HTTP 308 (preserves method,
   *      equivalent to 301 for SEO link-equity transfer).
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ristorante-goldoni.de" }],
        destination: "https://ristorante-goldoni.de/:path*",
        permanent: true,
      },
      ...buildLegacyRedirects(),
    ];
  },
  /**
   * Security headers — Phase D ACTION-PLAN M-1.
   *
   * Vercel already sets `Strict-Transport-Security: max-age=63072000`.
   * The headers below add the rest of the OWASP-recommended set so
   * Mozilla Observatory upgrades from C to A.
   *
   * CSP strategy: realistic for a restaurant marketing site without
   * any user-generated content, comments, or auth surface. We allow
   * `'unsafe-inline'` for both script-src (because JSON-LD via the
   * StructuredData component renders as inline script tags) and
   * style-src (because the design uses React inline style props for
   * design-token bindings on dozens of elements).
   *
   * Stricter CSP with nonces would require either Next.js middleware
   * (currently absent from this repo) or a hash-based allowlist that
   * needs maintenance as the JSON-LD payload changes — both bad
   * cost/benefit ratios for a static restaurant site.
   *
   * Cloudflare Turnstile (Spam-Schutz der Formulare, dormant bis zur
   * Aktivierung) ist unten verdrahtet: challenges.cloudflare.com in
   * script-src + connect-src + frame-src. If a future change adds further
   * external embeds (Google Maps iframe, Wolt SDK, etc.) extend the same
   * rules here.
   */
  async headers() {
    const csp = [
      "default-src 'self'",
      // Cloudflare Turnstile: das Widget-Script lädt von challenges.cloudflare.com.
      "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      // Turnstile siteverify + Challenge-Fetches gegen challenges.cloudflare.com.
      "connect-src 'self' https://challenges.cloudflare.com",
      // Turnstile rendert die Challenge in einem iframe von challenges.cloudflare.com.
      "frame-src https://challenges.cloudflare.com",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
