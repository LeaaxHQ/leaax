import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Check in under a minute whether your name or company is linked to a publicly exposed AI chat share link. Free, private, nothing is stored.";

/**
 * Metadata shared by all three root layouts (see RootShell below and
 * src/app/de/layout.tsx, src/app/en/layout.tsx, src/app/(default)/layout.tsx).
 * Every real, indexable page (the two homepages, the six legal pages)
 * overrides what it needs (title, description, canonical, openGraph,
 * twitter) — this is only ever seen by whatever doesn't override it,
 * which in practice is just the dead "/" fallback page (src/app/(default)/page.tsx),
 * since "/" itself never actually renders — see src/proxy.ts.
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Find out where your [li:ks] are`,
    template: `%s — ${SITE_NAME}`,
  },
  description,
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} — Find out where your [li:ks] are`,
    description,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Find out where your [li:ks] are`,
    description,
  },
};

/**
 * Shared `<html>`/`<body>` shell for all three root layouts. Each locale
 * needs its own root layout (not a shared one) specifically so `<html
 * lang>` can be correct per locale — src/app/de/layout.tsx passes "de",
 * src/app/en/layout.tsx passes "en". Previously there was a single root
 * layout with `lang` hardcoded to "en", which meant /de was served with
 * `<html lang="en">` despite its German content and `hreflang="de"`
 * annotation — a real, live-verified signal mismatch (see the commit
 * this file was introduced in) that plausibly compounded Search
 * Console's "duplicate, different canonical chosen" flag on /de and /en,
 * on top of the redirect-status fix from the previous commit.
 *
 * A single shared component (rather than duplicating this JSX three
 * times) keeps the three layouts' only real difference — the `lang`
 * value — visible at the call site instead of buried in copy-pasted
 * markup.
 */
export function RootShell({ lang, children }: { lang: string; children: ReactNode }) {
  return (
    <html lang={lang} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
