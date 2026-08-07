import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { renderLegalMarkdown } from "@/lib/content";
import { translations } from "@/lib/i18n/translations";
import { LEGAL_DOC_STATUS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Imprint",
  description: "Legal notice (imprint) for Leaax.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/imprint",
    languages: {
      de: "/impressum",
      en: "/imprint",
      "x-default": "/imprint",
    },
  },
};

export default function ImprintPage() {
  const t = translations.en.legal;
  return (
    <LegalPage
      locale="en"
      title={t.imprint}
      isPlaceholder={LEGAL_DOC_STATUS.imprint.isPlaceholder}
      placeholderBanner={t.placeholderBanner}
      contentHtml={renderLegalMarkdown("impressum-en.md")}
      siblingHref="/impressum"
      siblingLabel={translations.en.language.de}
      backHomeLabel={t.backHome}
    />
  );
}
