/**
 * Single source of truth for the production origin. Used for
 * metadataBase (canonical/hreflang/OG URL resolution) and the
 * sitemap/robots generators — hardcoded rather than derived from the
 * request so preview/staging deployments still canonicalize to the real
 * domain instead of creating duplicate-content origins.
 */
export const SITE_URL = "https://leaax.com";
export const SITE_NAME = "Leaax";
