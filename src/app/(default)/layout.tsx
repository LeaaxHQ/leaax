import type { Metadata } from "next";
import { RootShell, defaultMetadata } from "@/components/RootShell";
import "../globals.css";

// Root layout (Next.js "multiple root layouts" pattern — see
// src/app/de/layout.tsx and src/app/en/layout.tsx for the other two) for
// everything that isn't one of the two locale homepages: the "/"
// fallback redirect and the six noindex legal pages, which are
// themselves a DE/EN pair (impressum/imprint, datenschutz/privacy-policy,
// agb/terms) but don't each need their own root layout since none of
// them are indexed, so `lang="en"` here is just the pre-existing
// default, unchanged from before this split.
export const metadata: Metadata = defaultMetadata;

export default function DefaultLayout({ children }: LayoutProps<"/">) {
  return <RootShell lang="en">{children}</RootShell>;
}
