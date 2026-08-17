import type { Metadata } from "next";
import { RootShell, defaultMetadata } from "@/components/RootShell";
import "../globals.css";

// Root layout for the /de subtree (Next.js "multiple root layouts"
// pattern — see src/app/en/layout.tsx and src/app/(default)/layout.tsx
// for the other two) — exists solely so `<html lang="de">` is correct
// for this locale; see the comment on RootShell for why that matters.
//
// page.tsx sits in a "(home)" sub-group rather than directly here on
// purpose: per Next.js's documented metadata behavior, a layout's
// `title.template` does NOT apply to a page in the *same* route segment
// — only to child segments — so a page.tsx colocated right here would
// silently lose the " — Leaax" title suffix that src/app/de/(home)/page.tsx
// relies on. The extra route group adds no URL segment, so this is still
// served at exactly "/de".
export const metadata: Metadata = defaultMetadata;

export default function DeLayout({ children }: LayoutProps<"/de">) {
  return <RootShell lang="de">{children}</RootShell>;
}
