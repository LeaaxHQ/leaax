import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Locale } from "@/lib/i18n/translations";

/**
 * "/" itself has no content — it only exists to send visitors to the
 * right real, indexable homepage (see src/app/de, src/app/en, and the
 * matching hreflang alternates in their metadata). German is the
 * fallback whenever Accept-Language is missing or names neither
 * supported language, since most of the target audience is DACH-based.
 * src/app/page.tsx redirects to that same fallback as a defense-in-depth
 * backstop in case Proxy is ever bypassed.
 */
function pickLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return "de";

  const ranked = acceptLanguage
    .split(",")
    .map((entry) => {
      const [tag, ...params] = entry.trim().split(";").map((s) => s.trim());
      const qParam = params.find((p) => p.startsWith("q="));
      const quality = qParam ? Number(qParam.slice(2)) : 1;
      return { tag: tag.toLowerCase(), quality: Number.isFinite(quality) ? quality : 1 };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    if (tag.startsWith("de")) return "de";
    if (tag.startsWith("en")) return "en";
  }
  return "de";
}

export function proxy(request: NextRequest) {
  const locale = pickLocale(request.headers.get("accept-language"));
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}

// Every other route already has its own real, locale-specific URL (the
// two homepages, and the legal pages' separate DE/EN routes) — narrowing
// the matcher to exactly "/" keeps Proxy off the hot paths (checks,
// assets, all other pages).
export const config = {
  matcher: "/",
};
