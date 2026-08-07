import Link from "next/link";
import { Footer } from "@/components/Footer";
import type { Locale } from "@/lib/i18n/translations";

interface LegalPageProps {
  locale: Locale;
  title: string;
  isPlaceholder: boolean;
  placeholderBanner: string;
  /** Pre-rendered HTML from a trusted, repo-controlled Markdown file — see src/lib/content.ts. */
  contentHtml: string;
  siblingHref: string;
  siblingLabel: string;
  backHomeLabel: string;
}

export function LegalPage({
  locale,
  title,
  isPlaceholder,
  placeholderBanner,
  contentHtml,
  siblingHref,
  siblingLabel,
  backHomeLabel,
}: LegalPageProps) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="text-lg font-bold tracking-tight hover:text-accent">
          Leaax
        </Link>
        <Link href={siblingHref} className="text-sm text-foreground-muted hover:text-foreground hover:underline">
          {siblingLabel}
        </Link>
      </header>

      <main className="flex-1 px-6 py-12 sm:py-16">
        <article className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

          {isPlaceholder && (
            <p
              role="note"
              className="mt-4 rounded-lg border border-status-yellow/40 bg-[var(--status-yellow-bg)] px-4 py-3 text-sm font-semibold"
            >
              {placeholderBanner}
            </p>
          )}

          <div className="legal-content mt-8" dangerouslySetInnerHTML={{ __html: contentHtml }} />

          <Link href="/" className="mt-10 inline-block text-sm font-medium text-accent hover:underline">
            {backHomeLabel}
          </Link>
        </article>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
