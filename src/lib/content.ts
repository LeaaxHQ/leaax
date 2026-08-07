import { readFileSync } from "node:fs";
import path from "node:path";
import { marked } from "marked";

/**
 * Renders one of the fixed legal Markdown files from /content to HTML.
 *
 * This content is repo-controlled (edited via git/GitHub by the site
 * owners, never by end users), so rendering it through
 * dangerouslySetInnerHTML on the legal pages is safe — it is not
 * user-supplied input. The filename parameter is a closed union, not a
 * free-form string, so there is no path-traversal surface: callers can
 * only ever reference one of the files listed below.
 */
const CONTENT_DIR = path.join(process.cwd(), "content");

export type LegalContentFile =
  | "impressum-de.md"
  | "impressum-en.md"
  | "datenschutz-de.md"
  | "datenschutz-en.md"
  | "agb-de.md"
  | "agb-en.md";

export function renderLegalMarkdown(fileName: LegalContentFile): string {
  const filePath = path.join(CONTENT_DIR, fileName);
  const raw = readFileSync(filePath, "utf8");
  return marked.parse(raw, { async: false }) as string;
}
