/**
 * Legacy WordPress URL redirects — preserves SEO equity from the
 * pre-2026 WordPress site at ristorante-goldoni.de.
 *
 * Why this matters: external backlinks (Google's index, Tripadvisor,
 * Yelp, blog posts, Wolt's listing) point at the old WP URLs. Without
 * 301/308 redirects those links would 404, and the new site would lose
 * the accumulated PageRank.
 *
 * Why both slash variants: WordPress canonical URLs end with "/", but
 * Next.js's default routing strips trailing slashes. Without explicit
 * mapping, "/foo/" would 308 to "/foo", which would then 308 to the
 * new path — two hops. Google passes full link equity only on the
 * first hop, so two-hop chains dilute SEO. We list both forms so
 * every legacy URL reaches its destination in one hop.
 */

export type LegacyRedirect = {
  /** Old WordPress path, written WITHOUT a trailing slash. */
  from: string;
  /** New Next.js path, written WITHOUT a trailing slash (or "/" for root). */
  to: string;
};

/**
 * Exact-path mappings derived from `wp-sitemap-posts-page-1.xml`
 * (audit 2026-04-29). Order matters: more specific first, so Next's
 * matcher hits the narrower rule before any catch-all wildcards.
 */
export const LEGACY_REDIRECTS: readonly LegacyRedirect[] = [
  { from: "/menue-28/pasta-2", to: "/menu" },
  { from: "/menue-28", to: "/menu" },
  // GSC 2026-05-15 — Pages > Not found (404) surfaced /menue/ as
  // separately indexed from /menue-28/. WP had both canonical and
  // ID-suffixed slug variants alive.
  { from: "/menue", to: "/menu" },
  // GSC 2026-05-15 — Pages > Page with redirect surfaced this
  // malformed double-domain path (first detected 2022-10-18), almost
  // certainly an external backlink written as a relative URL on a site
  // whose template prepended its own host. Maps to /menu so any residual
  // link equity transfers to the canonical menu route.
  { from: "/ristorante-goldoni.de/menue", to: "/menu" },
  { from: "/private-feiern-und-firmen-events", to: "/feiern" },
  { from: "/datenschutzerklaerung", to: "/datenschutz" },
  { from: "/kontakt", to: "/kontakt" },
  { from: "/impressum", to: "/impressum" },
  { from: "/infos", to: "/" },
] as const;

/**
 * Sub-tree catch-alls. Some WP routes may have child pages we never
 * crawled (the WP sitemap only lists 8 URLs but more might exist
 * through internal navigation or external links). The :path* wildcard
 * folds anything under /menue-28/ into /menu.
 *
 * Wildcards run AFTER exact matches in Next's redirect ordering, so
 * the specific /menue-28/pasta-2 entry above still resolves first.
 */
export const WILDCARD_REDIRECTS: readonly { from: string; to: string }[] = [
  { from: "/menue-28/:path*", to: "/menu" },
] as const;

type NextRedirect = {
  source: string;
  destination: string;
  permanent: true;
};

/**
 * Expands LEGACY_REDIRECTS into the format Next.js expects in
 * next.config's `redirects()` hook. For each entry, emits:
 *  - the trailing-slash variant (always),
 *  - the bare variant (only when `from !== to` — otherwise the bare
 *    form would be an identity redirect to itself).
 * Wildcards are appended verbatim.
 */
export function buildLegacyRedirects(): NextRedirect[] {
  const out: NextRedirect[] = [];

  for (const r of LEGACY_REDIRECTS) {
    out.push({ source: `${r.from}/`, destination: r.to, permanent: true });
    if (r.from !== r.to) {
      out.push({ source: r.from, destination: r.to, permanent: true });
    }
  }

  for (const w of WILDCARD_REDIRECTS) {
    out.push({ source: w.from, destination: w.to, permanent: true });
  }

  /**
   * General trailing-slash fallback. Replaces Next.js's built-in
   * `/:path+/` -> `/:path+` rule, which we disable via
   * `skipTrailingSlashRedirect: true` in next.config so it cannot
   * intercept legacy URLs before our specific mappings above.
   *
   * Anything not caught by the specific or wildcard rules above lands
   * here and gets cleaned to the no-slash canonical form in one hop.
   */
  out.push({ source: "/:path+/", destination: "/:path+", permanent: true });

  return out;
}
