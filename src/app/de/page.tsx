import type { Metadata } from "next";
import { Home } from "@/components/Home";
import { loadRecommendationsContent, renderFaqMarkdown } from "@/lib/content";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { buildFaqPageJsonLd, buildSoftwareApplicationJsonLd } from "@/lib/structuredData";

// SEO title/description are intentionally decoupled from t.tagline /
// t.hero.subtitle (which drive the on-page hero, kept broad on purpose —
// see src/components/Home.tsx). These sharpen positioning to the
// ChatGPT/AI-chat-leak angle for freelancers & small businesses without
// touching page content.
// Page title omits the "— Leaax" suffix: the root layout's title template
// (`%s — ${SITE_NAME}`) appends it, so the rendered <title> reads
// "ChatGPT- & KI-Chat-Leak-Check — Ist dein Chat öffentlich? — Leaax".
// OG/Twitter titles aren't templated, so they spell out the full string.
const SEO_TITLE = "ChatGPT- & KI-Chat-Leak-Check — Ist dein Chat öffentlich?";
const SEO_TITLE_FULL = `${SEO_TITLE} — ${SITE_NAME}`;
const SEO_DESCRIPTION =
  "Prüfe kostenlos, ob dein ChatGPT- oder KI-Chat öffentlich auffindbar ist — wichtig für Freelancer & kleine Unternehmen. Unter 1 Minute, ohne Speicherung. Leaax.";

export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  alternates: {
    canonical: "/de",
    languages: {
      de: "/de",
      en: "/en",
      "x-default": "/en",
    },
  },
  openGraph: {
    title: SEO_TITLE_FULL,
    description: SEO_DESCRIPTION,
    url: "/de",
    siteName: SITE_NAME,
    type: "website",
    locale: "de_DE",
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
// src/app/en/page.tsx for the English sibling and src/proxy.ts for how
// "/" picks between them.
export default function DeHomePage() {
  const recommendations = loadRecommendationsContent();
  const faqHtml = renderFaqMarkdown("faq-de.md");

  // Structured data (see src/lib/structuredData.ts): SoftwareApplication
  // reuses this page's own SEO_DESCRIPTION rather than a separate
  // hand-written blurb; FAQPage is parsed straight from faq-de.md so it
  // can't drift from the visible FAQ in Home.tsx.
  const softwareApplicationJsonLd = buildSoftwareApplicationJsonLd({
    description: SEO_DESCRIPTION,
    url: `${SITE_URL}/de`,
  });
  const faqPageJsonLd = buildFaqPageJsonLd("faq-de.md");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: softwareApplicationJsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqPageJsonLd }} />
      <Home locale="de" recommendations={recommendations} faqHtml={faqHtml} />
    </>
  );
}
