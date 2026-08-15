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

// External links (http/https) in content Markdown open in a new tab so
// Leaax stays open for the user, with the standard target="_blank"
// safeguard rel="noopener noreferrer" — prevents the new tab from getting
// a `window.opener` handle back to this page. Internal links (e.g. the
// "#check-form" anchor) fall through to marked's default same-tab
// rendering by returning `false` here.
marked.use({
  renderer: {
    link({ href, title, tokens }) {
      if (!/^https?:\/\//i.test(href)) return false;
      const label = this.parser.parseInline(tokens);
      const titleAttr = title ? ` title="${title.replace(/"/g, "&quot;")}"` : "";
      return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${label}</a>`;
    },
  },
});

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
 * Homepage FAQ section (content/faq-*.md) — same trusted-Markdown /
 * embedded-<details> convention as the recommendation snippets above,
 * one <details> per question so each renders as its own collapsible
 * item (see Home.tsx). Locale is fixed per route (see src/app/de/page.tsx,
 * src/app/en/page.tsx), so unlike loadRecommendationsContent this only
 * ever needs one language's HTML per render.
 */
export type FaqContentFile = "faq-de.md" | "faq-en.md";

export function renderFaqMarkdown(fileName: FaqContentFile): string {
  return renderMarkdownFile(fileName);
}

/** One parsed FAQ entry — plain text, not HTML (see parseFaqMarkdown). */
export interface FaqItem {
  question: string;
  /** Plain-text answer: any Markdown (links, emphasis, …) is rendered
   *  then stripped back to text, so a visible link's label survives but
   *  its markup doesn't — matches how the text actually reads on the
   *  page. */
  answer: string;
}

const FAQ_DETAILS_RE = /<details>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g;

/**
 * Strips the small subset of inline Markdown actually used in
 * content/faq-*.md answers (links, bold/italic, inline code) down to
 * plain text, keeping a link's label but dropping its target. Works
 * directly on the Markdown rather than round-tripping through
 * marked+HTML-stripping, which avoided two bugs: leftover `&quot;`-style
 * entities from marked's defensive text escaping, and a stray space
 * left behind where a tag boundary (e.g. `</a>`) sat directly against
 * punctuation.
 */
function markdownAnswerToPlainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(\*|_)(.+?)\1/g, "$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parses content/faq-*.md into plain question/answer pairs — used to
 * build the FAQPage JSON-LD (see src/lib/structuredData.ts) straight
 * from the same file that renders the visible FAQ (see renderFaqMarkdown
 * above / Home.tsx), so the structured data can't drift out of sync
 * with what's actually shown on the page.
 */
export function parseFaqMarkdown(fileName: FaqContentFile): FaqItem[] {
  const filePath = path.join(CONTENT_DIR, fileName);
  const raw = readFileSync(filePath, "utf8");

  const items: FaqItem[] = [];
  FAQ_DETAILS_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = FAQ_DETAILS_RE.exec(raw))) {
    const question = match[1].trim();
    const answerMarkdown = match[2].trim();
    items.push({ question, answer: markdownAnswerToPlainText(answerMarkdown) });
  }
  return items;
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
