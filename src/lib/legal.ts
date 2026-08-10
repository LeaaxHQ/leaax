/**
 * Central switchboard for the legal pages.
 *
 * `isPlaceholder` controls the visible "[PLACEHOLDER]" banner shown on a
 * legal page — independently of the Markdown content in /content, so a
 * forgotten flag fails safe (banner stays visible) rather than silently
 * disappearing the moment someone edits the .md file. Flip a document to
 * `false` only once its real, reviewed text has replaced the placeholder
 * content.
 */
export const LEGAL_DOC_STATUS = {
  imprint: { isPlaceholder: false },
  privacy: { isPlaceholder: false },
  terms: { isPlaceholder: false },
} as const;

/**
 * Terms/AGB has no content at all yet (comes with the paid subscription
 * model in MVP 2/3) — the route already exists, but its footer link
 * stays hidden until there's something worth linking to. Flip once the
 * page has real content (which also means flipping
 * LEGAL_DOC_STATUS.terms.isPlaceholder to false at the same time, or
 * later if placeholder content should stay visible for a while first).
 */
export const TERMS_LINK_VISIBLE = false;

export const LEGAL_ROUTES = {
  de: {
    imprint: "/impressum",
    privacy: "/datenschutz",
    terms: "/agb",
  },
  en: {
    imprint: "/imprint",
    privacy: "/privacy-policy",
    terms: "/terms",
  },
} as const;
