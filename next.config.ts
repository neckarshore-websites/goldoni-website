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
};

export default nextConfig;
