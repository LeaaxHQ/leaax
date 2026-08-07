import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { renderLegalMarkdown } from "@/lib/content";
import { translations } from "@/lib/i18n/translations";
import { LEGAL_DOC_STATUS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of service for Leaax.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/terms",
    languages: {
      de: "/agb",
      en: "/terms",
      "x-default": "/terms",
    },
  },
};

export default function TermsPage() {
  const t = translations.en.legal;
  return (
    <LegalPage
      locale="en"
      title={t.terms}
      isPlaceholder={LEGAL_DOC_STATUS.terms.isPlaceholder}
      placeholderBanner={t.placeholderBanner}
      contentHtml={renderLegalMarkdown("agb-en.md")}
      siblingHref="/agb"
      siblingLabel={translations.en.language.de}
      backHomeLabel={t.backHome}
    />
  );
}
