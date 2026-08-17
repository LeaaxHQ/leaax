import type { Metadata } from "next";
import { RootShell, defaultMetadata } from "@/components/RootShell";
import "../globals.css";

// Root layout for the /en subtree (Next.js "multiple root layouts"
// pattern — see src/app/de/layout.tsx and src/app/(default)/layout.tsx
// for the other two) — exists solely so `<html lang="en">` is correct
// for this locale; see the comment on RootShell for why that matters.
//
// page.tsx sits in a "(home)" sub-group rather than directly here on
// purpose: per Next.js's documented metadata behavior, a layout's
// `title.template` does NOT apply to a page in the *same* route segment
// — only to child segments — so a page.tsx colocated right here would
// silently lose the " — Leaax" title suffix that src/app/en/(home)/page.tsx
// relies on. The extra route group adds no URL segment, so this is still
// served at exactly "/en".
export const metadata: Metadata = defaultMetadata;

export default function EnLayout({ children }: LayoutProps<"/en">) {
  return <RootShell lang="en">{children}</RootShell>;
}
