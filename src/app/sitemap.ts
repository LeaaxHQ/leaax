import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Legal pages (impressum/imprint, datenschutz/privacy-policy, agb/terms)
// are intentionally excluded — they're noindex,follow and add no value
// for visitors arriving from search, so keeping them out of the sitemap
// avoids diluting relevance for the pages that do matter. Extend this
// array as real content pages are added.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
