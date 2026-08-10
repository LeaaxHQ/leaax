import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CheckForm } from "@/components/CheckForm";
import { Footer } from "@/components/Footer";
import { BrandLogo } from "@/components/BrandLogo";
import { AI_SHARE_PROVIDERS } from "@/lib/providers";
import { translations, type Locale } from "@/lib/i18n/translations";
import type { RecommendationsContent } from "@/lib/content";

interface HomeProps {
  /** The route's own locale (see src/app/de/page.tsx, src/app/en/page.tsx) — no longer a client-side preference. */
  locale: Locale;
  /** Pre-rendered "what to do now" recommendation HTML, both checks — read server-side by the page for this locale. */
  recommendations: RecommendationsContent;
  /** Pre-rendered FAQ HTML for this locale — read server-side by the page (see content/faq-*.md, src/lib/content.ts). */
  faqHtml: string;
}

export function Home({ locale, recommendations, faqHtml }: HomeProps) {
  const t = translations[locale];

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
        <LanguageSwitcher locale={locale} />
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-12 sm:py-20">
        <div className="w-full max-w-2xl flex flex-col items-center text-center gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">{t.hero.title}</h1>
            <p className="text-base sm:text-lg text-foreground-muted text-balance">{t.hero.subtitle}</p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-base sm:text-lg font-semibold">{t.about.title}</h2>
              <p className="text-sm text-foreground-muted text-balance">{t.about.body}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-base sm:text-lg font-semibold">{t.problem.title}</h2>
              <p className="text-sm text-foreground-muted text-balance">{t.problem.body}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-base sm:text-lg font-semibold">{t.whatWeDo.title}</h2>
              <p className="text-sm text-foreground-muted text-balance">{t.whatWeDo.body}</p>
            </div>
          </div>

          <CheckForm locale={locale} recommendations={recommendations} />

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

          {/* Fixed, editorially-reviewed FAQ (content/faq-*.md) — each
              question is its own <details> embedded in the Markdown
              source, same collapsible convention as the "what to do
              now" recommendations above. */}
          <div className="w-full text-left">
            <h2 className="text-base sm:text-lg font-semibold text-center">{t.faq.heading}</h2>
            <div className="faq-content mt-4" dangerouslySetInnerHTML={{ __html: faqHtml }} />
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
