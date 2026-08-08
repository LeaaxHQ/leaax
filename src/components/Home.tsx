"use client";

import { useLanguage } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CheckForm } from "@/components/CheckForm";
import { Footer } from "@/components/Footer";
import { BrandLogo } from "@/components/BrandLogo";
import { AI_SHARE_PROVIDERS } from "@/lib/providers";
import type { RecommendationsContent } from "@/lib/content";

interface HomeProps {
  /** Pre-rendered "what to do now" recommendation HTML, both checks x both locales — read server-side, see src/app/page.tsx. */
  recommendations: RecommendationsContent;
}

export function Home({ recommendations }: HomeProps) {
  const { locale, t } = useLanguage();

  return (
    <div className="flex-1 flex flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2">
          <BrandLogo />
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-2">
            <span className="text-lg font-bold tracking-tight leading-tight">{t.brand}</span>
            <span className="text-xs sm:text-sm text-foreground-muted leading-tight">{t.tagline}</span>
          </div>
        </div>
        <LanguageSwitcher />
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-12 sm:py-20">
        <div className="w-full max-w-2xl flex flex-col items-center text-center gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">{t.hero.title}</h1>
            <p className="text-base sm:text-lg text-foreground-muted text-balance">{t.hero.subtitle}</p>
          </div>

          <CheckForm recommendations={recommendations} />

          <div className="flex flex-col items-center gap-2 pt-4">
            <h2 className="text-xs uppercase tracking-wide text-foreground-muted">{t.providers.heading}</h2>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm font-medium text-foreground-muted">
              {AI_SHARE_PROVIDERS.map((p) => (
                <span key={p.id}>{p.name}</span>
              ))}
            </div>
            <p className="max-w-md text-xs text-foreground-muted">{t.providers.note}</p>
            <p className="max-w-md text-xs text-foreground-muted">{t.providers.emailNote}</p>
          </div>

          <div className="w-full rounded-xl border border-border-subtle bg-background-elevated px-5 py-4 text-left">
            <h2 className="text-sm font-semibold">{t.privacy.title}</h2>
            <p className="mt-1 text-sm text-foreground-muted">{t.privacy.body}</p>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
