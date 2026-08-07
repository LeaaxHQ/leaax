import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { renderLegalMarkdown } from "@/lib/content";
import { translations } from "@/lib/i18n/translations";
import { LEGAL_DOC_STATUS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Leaax.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/privacy-policy",
    languages: {
      de: "/datenschutz",
      en: "/privacy-policy",
      "x-default": "/privacy-policy",
    },
  },
};

export default function PrivacyPolicyPage() {
  const t = translations.en.legal;
  return (
    <LegalPage
      locale="en"
      title={t.privacy}
      isPlaceholder={LEGAL_DOC_STATUS.privacy.isPlaceholder}
      placeholderBanner={t.placeholderBanner}
      contentHtml={renderLegalMarkdown("datenschutz-en.md")}
      siblingHref="/datenschutz"
      siblingLabel={translations.en.language.de}
      backHomeLabel={t.backHome}
    />
  );
}
