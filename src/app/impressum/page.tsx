import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { renderLegalMarkdown } from "@/lib/content";
import { translations } from "@/lib/i18n/translations";
import { LEGAL_DOC_STATUS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum von Leaax.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/impressum",
    languages: {
      de: "/impressum",
      en: "/imprint",
      "x-default": "/imprint",
    },
  },
};

export default function ImpressumPage() {
  const t = translations.de.legal;
  return (
    <LegalPage
      locale="de"
      title={t.imprint}
      isPlaceholder={LEGAL_DOC_STATUS.imprint.isPlaceholder}
      placeholderBanner={t.placeholderBanner}
      contentHtml={renderLegalMarkdown("impressum-de.md")}
      siblingHref="/imprint"
      siblingLabel={translations.de.language.en}
      backHomeLabel={t.backHome}
    />
  );
}
