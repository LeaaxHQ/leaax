import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// The homepage is now two real, separate per-language URLs (see
// src/app/de, src/app/en) — "/" itself only redirects (see src/proxy.ts)
// and never serves content directly, so it's left out here for the same
// reason the noindex legal pages are excluded: no value listing a URL
// that never renders anything itself. Extend this array as real content
// pages are added.
const HOMEPAGE_LANGUAGES = {
  de: `${SITE_URL}/de`,
  en: `${SITE_URL}/en`,
  "x-default": `${SITE_URL}/en`,
};

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/de`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: HOMEPAGE_LANGUAGES },
    },
    {
      url: `${SITE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: HOMEPAGE_LANGUAGES },
    },
  ];
}
