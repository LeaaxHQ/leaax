import Link from "next/link";
import { LOCALES, translations, type Locale } from "@/lib/i18n/translations";

const HOMEPAGE_ROUTE: Record<Locale, string> = { en: "/en", de: "/de" };

/**
 * Two real links between the sibling-locale homepages (/de ↔ /en), not a
 * client-side text swap — each locale is its own crawlable, indexable
 * URL (see src/app/de, src/app/en). This is a navigation shortcut, not
 * a preference toggle, so it's a plain Server Component.
 */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const t = translations[locale];

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-border-subtle bg-background-elevated p-1 text-sm"
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((code) => (
        <Link
          key={code}
          href={HOMEPAGE_ROUTE[code]}
          aria-current={locale === code ? "page" : undefined}
          className={`rounded-full px-3 py-1 transition-colors ${
            locale === code
              ? "bg-accent text-accent-foreground font-medium"
              : "text-foreground-muted hover:text-foreground"
          }`}
        >
          {t.language[code]}
        </Link>
      ))}
    </div>
  );
}
