import type { Metadata } from "next";
import { Home } from "@/components/Home";
import { loadRecommendationsContent } from "@/lib/content";
import { SITE_NAME } from "@/lib/site";

// SEO title/description are intentionally decoupled from t.tagline /
// t.hero.subtitle (which drive the on-page hero, kept broad on purpose —
// see src/components/Home.tsx). These sharpen positioning to the
// ChatGPT/AI-chat-leak angle for freelancers & small businesses without
// touching page content.
// Page title omits the "— Leaax" suffix: the root layout's title template
// (`%s — ${SITE_NAME}`) appends it, so the rendered <title> reads
// "ChatGPT & AI Chat Leak Checker — Is Your Chat Public? — Leaax".
// OG/Twitter titles aren't templated, so they spell out the full string.
const SEO_TITLE = "ChatGPT & AI Chat Leak Checker — Is Your Chat Public?";
const SEO_TITLE_FULL = `${SEO_TITLE} — ${SITE_NAME}`;
const SEO_DESCRIPTION =
  "Check for free if your ChatGPT or AI chat is publicly exposed — important for freelancers and small businesses. Under a minute, nothing stored. Leaax.";

export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  alternates: {
    canonical: "/en",
    languages: {
      de: "/de",
      en: "/en",
      "x-default": "/en",
    },
  },
  openGraph: {
    title: SEO_TITLE_FULL,
    description: SEO_DESCRIPTION,
    url: "/en",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE_FULL,
    description: SEO_DESCRIPTION,
  },
};

// Server component: reads the repo-controlled recommendation Markdown
// files once per request/build (see src/lib/content.ts) and hands the
// pre-rendered HTML down to the client-rendered check form. The locale
// is this route itself now (not a client-side preference) — see
// src/app/de/page.tsx for the German sibling and src/proxy.ts for how
// "/" picks between them.
export default function EnHomePage() {
  const recommendations = loadRecommendationsContent();
  return <Home locale="en" recommendations={recommendations} />;
}
