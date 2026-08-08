import type { BreachCheckProvider, BreachSearchResult } from "./types";

const XPOSEDORNOT_ENDPOINT = "https://api.xposedornot.com/v1/check-email";

interface XposedOrNotResponse {
  // Success shape when the email was found: `breaches` is an array
  // containing one array of breach-name strings, e.g.
  // { "breaches": [["Adobe", "LinkedIn"]], "email": "...", "status": "success" }.
  // Confirmed against the live API (xposedornot.com/api_doc) — this
  // nesting is real, not a typo.
  breaches?: string[][];
  status?: string;
  // "Not found" shape — still a 200, not a 404. See the handling below.
  Error?: string;
}

/**
 * XposedOrNot (xonPlus) breach-check provider (https://xposedornot.com/api_doc).
 * Chosen as the MVP-2 default: the single-email "check-email" lookup used
 * here is free and keyless per the current official docs — no API key
 * env var is required today. If a future tier ever requires one, read it
 * from `process.env.XPOSEDORNOT_API_KEY` here (never hardcode it) and
 * send it as a header; nothing else in this module would need to change.
 */
export function createXposedOrNotProvider(): BreachCheckProvider {
  return {
    id: "xposedornot",
    async check(email: string): Promise<BreachSearchResult[]> {
      const url = `${XPOSEDORNOT_ENDPOINT}/${encodeURIComponent(email)}`;

      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        // Never cache a response tied to a personal email address.
        cache: "no-store",
      });

      // The API's "not found" case is a normal 200 with an `Error` field
      // (see XposedOrNotResponse) — only a genuinely failed HTTP status
      // (e.g. 429 rate-limited, 5xx) counts as a real failure here.
      if (!response.ok) {
        throw new Error(`XposedOrNot API error: HTTP ${response.status}`);
      }

      const data = (await response.json()) as XposedOrNotResponse;

      if (data.Error) {
        return [];
      }

      const breachNames = (data.breaches ?? []).flat();
      return breachNames.map((breachName) => ({ breachName }));
    },
  };
}
