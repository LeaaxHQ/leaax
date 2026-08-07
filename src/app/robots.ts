import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Crawling is allowed everywhere, including the noindex legal pages —
// bots need to be able to crawl a page to see its `noindex` meta tag in
// the first place. Exclusion from search results is handled per-page via
// `robots: { index: false }` in metadata (see e.g. src/app/impressum/page.tsx),
// not via Disallow here.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
