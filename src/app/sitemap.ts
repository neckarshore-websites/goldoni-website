import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import empfehlungskarte from "@/data/empfehlungskarte.json";

/**
 * sitemap.xml — generated at build time.
 *
 * Lists only public, indexable routes. Internal pages (/style-guide,
 * /assets) are excluded; they carry `noindex` and are disallowed in
 * robots.ts.
 *
 * Legal pages (impressum, datenschutz) are included so Google knows
 * they exist (DSGVO discoverability), with low priority.
 *
 * lastModified: ONLY where a maintained date exists. Until 2026-09-23 every
 * URL carried the build time, so all eight changed on every deploy — Google
 * learns to ignore a lastmod like that, and the one page that genuinely
 * changes weekly (the weekly menu) sent no freshness signal at all. The
 * weekly menu now carries its card's `updated` date; the others carry none,
 * because an omitted lastmod is honest and a guessed one is not.
 * (speisekarte.json's `updated` is NOT used: it still says 2026-04-28 although
 * the menu has changed since.)
 */
export default function sitemap(): MetadataRoute.Sitemap {

  return [
    {
      url: `${SITE.url}/`,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE.url}/menu`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/wochenkarte`,
      lastModified: empfehlungskarte.updated,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/feiern`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE.url}/ueber-uns`,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE.url}/kontakt`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE.url}/impressum`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE.url}/datenschutz`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
