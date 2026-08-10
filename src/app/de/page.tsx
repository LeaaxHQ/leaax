import type { Metadata } from "next";
import { Home } from "@/components/Home";
import { loadRecommendationsContent } from "@/lib/content";
import { translations } from "@/lib/i18n/translations";
import { SITE_NAME } from "@/lib/site";

const t = translations.de;

export const metadata: Metadata = {
  title: t.tagline,
  description: t.hero.subtitle,
  alternates: {
    canonical: "/de",
    languages: {
      de: "/de",
      en: "/en",
      "x-default": "/en",
    },
  },
  openGraph: {
    title: `${SITE_NAME} — ${t.tagline}`,
    description: t.hero.subtitle,
    url: "/de",
    siteName: SITE_NAME,
    type: "website",
    locale: "de_DE",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${t.tagline}`,
    description: t.hero.subtitle,
  },
};

// Server component: reads the repo-controlled recommendation Markdown
// files once per request/build (see src/lib/content.ts) and hands the
// pre-rendered HTML down to the client-rendered check form. The locale
// is this route itself now (not a client-side preference) — see
// src/app/en/page.tsx for the English sibling and src/proxy.ts for how
// "/" picks between them.
export default function DeHomePage() {
  const recommendations = loadRecommendationsContent();
  return <Home locale="de" recommendations={recommendations} />;
}
