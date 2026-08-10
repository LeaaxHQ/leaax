import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { renderLegalMarkdown } from "@/lib/content";
import { translations } from "@/lib/i18n/translations";
import { LEGAL_DOC_STATUS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von Leaax.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/datenschutz",
    languages: {
      de: "/datenschutz",
      en: "/privacy-policy",
      "x-default": "/privacy-policy",
    },
  },
};

export default function DatenschutzPage() {
  const t = translations.de.legal;
  return (
    <LegalPage
      locale="de"
      title={t.privacy}
      isPlaceholder={LEGAL_DOC_STATUS.privacy.isPlaceholder}
      placeholderBanner={t.placeholderBanner}
      contentHtml={renderLegalMarkdown("datenschutz-de.md")}
      siblingHref="/privacy-policy"
      siblingLabel={translations.de.language.en}
      backHomeLabel={t.backHome}
      provisionalNotice={t.provisionalNotice}
    />
  );
}
