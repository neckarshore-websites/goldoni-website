import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * robots.txt — generated at build time.
 *
 * Allows everything except internal reference pages (/style-guide,
 * /assets, /sandbox), which carry `noindex` on the page itself but are
 * also disallowed here so well-behaved crawlers skip them entirely.
 *
 * /sandbox is a temporary preview surface (Wolt-Storefront button) and
 * disappears again — its entry here goes with it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/style-guide", "/assets", "/sandbox"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
