import { parseFaqMarkdown, type FaqContentFile } from "@/lib/content";

/**
 * JSON-LD builders for the homepage's structured data (see
 * src/app/de/page.tsx, src/app/en/page.tsx):
 *
 * - SoftwareApplication: describes Leaax itself for richer search
 *   listings. `description` and `url` are passed in by the caller so
 *   they stay identical to that page's own SEO metadata (SEO_DESCRIPTION
 *   in each page.tsx) instead of being duplicated here.
 * - FAQPage: built from content/faq-*.md via parseFaqMarkdown — the same
 *   file that renders the visible FAQ (see src/components/Home.tsx) —
 *   so the structured data can never drift from what's actually shown.
 *
 * escapeJsonLd guards the (currently theoretical) case of repo content
 * containing a "</script" sequence that could otherwise break out of
 * the <script> tag it's embedded in.
 */
function escapeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

interface SoftwareApplicationInput {
  description: string;
  url: string;
}

export function buildSoftwareApplicationJsonLd({ description, url }: SoftwareApplicationInput): string {
  return escapeJsonLd({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Leaax",
    applicationCategory: "SecurityApplication",
    operatingSystem: "Web",
    description,
    url,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  });
}

export function buildFaqPageJsonLd(fileName: FaqContentFile): string {
  const items = parseFaqMarkdown(fileName);
  return escapeJsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  });
}
