import Link from "next/link";
import { translations, type Locale } from "@/lib/i18n/translations";
import { LEGAL_ROUTES, TERMS_LINK_VISIBLE } from "@/lib/legal";

/**
 * Shared on every page (homepage + all legal pages) so Impressum/
 * Datenschutz are always reachable. Works both as a plain server
 * component (legal pages) and imported into the client homepage — it
 * uses no server-only APIs, so it's safe in either tree.
 */
export function Footer({ locale }: { locale: Locale }) {
  const t = translations[locale];
  const routes = LEGAL_ROUTES[locale];

  return (
    <footer className="flex flex-col items-center gap-3 px-6 py-6 text-center text-xs text-foreground-muted sm:px-10">
      <nav
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1"
        aria-label={t.legal.navLabel}
      >
        <Link href={routes.imprint} className="hover:text-foreground hover:underline">
          {t.legal.imprint}
        </Link>
        <Link href={routes.privacy} className="hover:text-foreground hover:underline">
          {t.legal.privacy}
        </Link>
        {TERMS_LINK_VISIBLE && (
          <Link href={routes.terms} className="hover:text-foreground hover:underline">
            {t.legal.terms}
          </Link>
        )}
      </nav>
      <p>{t.footer.text}</p>
      <p>
        <a
          href="https://brave.com/search/api/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground hover:underline"
        >
          {t.footer.poweredBy}
        </a>
      </p>
      {/* Identical in both locales — a copyright year/name notice doesn't need translation. */}
      <p>© 2026 Leaax</p>
    </footer>
  );
}
