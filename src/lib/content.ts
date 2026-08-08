import { readFileSync } from "node:fs";
import path from "node:path";
import { marked } from "marked";
import type { Locale } from "@/lib/i18n/translations";

/**
 * Renders fixed Markdown files from /content to HTML — used for the legal
 * pages and for the "what to do now" recommendation snippets shown under
 * a red/yellow check result.
 *
 * This content is repo-controlled (edited via git/GitHub by the site
 * owners, never by end users), so rendering it through
 * dangerouslySetInnerHTML is safe — it is not user-supplied input. The
 * filename parameters are closed unions, not free-form strings, so there
 * is no path-traversal surface: callers can only ever reference one of
 * the files listed below. Recommendation files intentionally embed raw
 * `<details>` HTML for the collapsible provider-instructions section —
 * marked passes trusted inline/block HTML through untouched, which is
 * fine for the same reason.
 */
const CONTENT_DIR = path.join(process.cwd(), "content");

function renderMarkdownFile(fileName: string): string {
  const filePath = path.join(CONTENT_DIR, fileName);
  const raw = readFileSync(filePath, "utf8");
  return marked.parse(raw, { async: false }) as string;
}

export type LegalContentFile =
  | "impressum-de.md"
  | "impressum-en.md"
  | "datenschutz-de.md"
  | "datenschutz-en.md"
  | "agb-de.md"
  | "agb-en.md";

export function renderLegalMarkdown(fileName: LegalContentFile): string {
  return renderMarkdownFile(fileName);
}

export type RecommendationContentFile =
  | "recommendations-ai-chat-de.md"
  | "recommendations-ai-chat-en.md"
  | "recommendations-breach-de.md"
  | "recommendations-breach-en.md";

export function renderRecommendationMarkdown(fileName: RecommendationContentFile): string {
  return renderMarkdownFile(fileName);
}

/**
 * Pre-rendered "what to do now" recommendation HTML for both checks, in
 * both locales — read once on the server (see src/app/page.tsx) and
 * passed down to the client-rendered result UI, since the homepage's
 * language switch is a client-side preference, not a routed locale, so
 * the right variant can't be picked until render time on the client.
 */
export interface RecommendationsContent {
  aiChat: Record<Locale, string>;
  breach: Record<Locale, string>;
}

export function loadRecommendationsContent(): RecommendationsContent {
  return {
    aiChat: {
      de: renderRecommendationMarkdown("recommendations-ai-chat-de.md"),
      en: renderRecommendationMarkdown("recommendations-ai-chat-en.md"),
    },
    breach: {
      de: renderRecommendationMarkdown("recommendations-breach-de.md"),
      en: renderRecommendationMarkdown("recommendations-breach-en.md"),
    },
  };
}
