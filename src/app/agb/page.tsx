import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { renderLegalMarkdown } from "@/lib/content";
import { translations } from "@/lib/i18n/translations";
import { LEGAL_DOC_STATUS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "AGB",
  description: "Allgemeine Geschäftsbedingungen von Leaax.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/agb",
    languages: {
      de: "/agb",
      en: "/terms",
      "x-default": "/terms",
    },
  },
};

export default function AgbPage() {
  const t = translations.de.legal;
  return (
    <LegalPage
      locale="de"
      title={t.terms}
      isPlaceholder={LEGAL_DOC_STATUS.terms.isPlaceholder}
      placeholderBanner={t.placeholderBanner}
      contentHtml={renderLegalMarkdown("agb-de.md")}
      siblingHref="/terms"
      siblingLabel={translations.de.language.en}
      backHomeLabel={t.backHome}
    />
  );
}
