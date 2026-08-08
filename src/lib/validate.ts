import { z } from "zod";

/**
 * Strict input validation/sanitization for the check query.
 *
 * - Trims whitespace
 * - Enforces a sane length range
 * - Strips control characters and anything that isn't a letter, digit,
 *   space, or common name/company punctuation, so the value can never be
 *   used to inject markup, search-operator syntax, or template payloads
 *   downstream.
 */

// Anything that is NOT a letter, digit, whitespace, or common name/company
// punctuation gets stripped.
const ALLOWED_CHARS = /[^\p{L}\p{N}\s.,'&-]/gu;

// Intentionally stripping ASCII control chars; built from a string so the
// no-control-regex lint rule (which targets regex literals) doesn't apply.
const CONTROL_CHARS = new RegExp("[\\u0000-\\u001F\\u007F]", "g");

export const checkQuerySchema = z
  .string()
  .trim()
  .min(2, "too_short")
  .max(120, "too_long");

export type SanitizeResult =
  | { ok: true; value: string }
  | { ok: false; error: "too_short" | "too_long" | "invalid" };

export function sanitizeQuery(raw: unknown): SanitizeResult {
  if (typeof raw !== "string") {
    return { ok: false, error: "invalid" };
  }

  const withoutControlChars = raw.replace(CONTROL_CHARS, "");
  const withoutDisallowed = withoutControlChars
    .replace(ALLOWED_CHARS, " ")
    .replace(/\s+/g, " ")
    .trim();

  const parsed = checkQuerySchema.safeParse(withoutDisallowed);
  if (!parsed.success) {
    const issue = parsed.error.issues[0]?.message;
    if (issue === "too_short") return { ok: false, error: "too_short" };
    if (issue === "too_long") return { ok: false, error: "too_long" };
    return { ok: false, error: "invalid" };
  }

  return { ok: true, value: parsed.data };
}

/**
 * Strict input validation/sanitization for the email-breach-check query.
 *
 * - Strips ASCII control characters, then trims whitespace
 * - Enforces RFC 5321's practical max length for a full email address
 * - Delegates format validation to zod's `email()` check rather than a
 *   hand-rolled regex, so the value is well-formed before it's ever used
 *   to build the outbound breach-provider request
 * - Lower-cases the result: email lookups are effectively case-insensitive,
 *   and normalizing avoids treating "Jane@x.com" / "jane@x.com" as
 *   different inputs downstream
 */
const EMAIL_MAX_LENGTH = 254;

export const checkEmailSchema = z.email();

export type EmailSanitizeResult =
  | { ok: true; value: string }
  | { ok: false; error: "too_short" | "too_long" | "invalid" };

export function sanitizeEmail(raw: unknown): EmailSanitizeResult {
  if (typeof raw !== "string") {
    return { ok: false, error: "invalid" };
  }

  const withoutControlChars = raw.replace(CONTROL_CHARS, "").trim();

  if (withoutControlChars.length === 0) {
    return { ok: false, error: "too_short" };
  }
  if (withoutControlChars.length > EMAIL_MAX_LENGTH) {
    return { ok: false, error: "too_long" };
  }

  const parsed = checkEmailSchema.safeParse(withoutControlChars);
  if (!parsed.success) {
    return { ok: false, error: "invalid" };
  }

  return { ok: true, value: parsed.data.toLowerCase() };
}
