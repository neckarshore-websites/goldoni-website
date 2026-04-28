import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * sitemap.xml — generated at build time.
 *
 * Lists only public, indexable routes. Internal pages (/style-guide,
 * /assets) are excluded; they carry `noindex` and are disallowed in
 * robots.ts.
 *
 * Legal pages (impressum, datenschutz) are included so Google knows
 * they exist (DSGVO discoverability), with low priority.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${SITE.url}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE.url}/menu`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/empfehlungen`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/feiern`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE.url}/kontakt`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE.url}/impressum`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE.url}/datenschutz`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
