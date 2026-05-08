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
   * Legacy WordPress redirects — see src/lib/redirects.ts for rationale.
   * `permanent: true` emits HTTP 308 (preserves method, equivalent to 301
   * for SEO link-equity transfer).
   */
  async redirects() {
    return buildLegacyRedirects();
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
   * If a future change adds external embeds (Google Maps iframe,
   * Wolt SDK, reCAPTCHA, etc.) the connect-src / frame-src /
   * script-src rules need extending here.
   */
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
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
