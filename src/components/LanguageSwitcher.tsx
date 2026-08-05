"use client";

import { useLanguage } from "@/lib/i18n/context";
import { LOCALES } from "@/lib/i18n/translations";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-border-subtle bg-background-elevated p-1 text-sm"
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className={`rounded-full px-3 py-1 transition-colors cursor-pointer ${
            locale === code
              ? "bg-accent text-accent-foreground font-medium"
              : "text-foreground-muted hover:text-foreground"
          }`}
        >
          {t.language[code]}
        </button>
      ))}
    </div>
  );
}
