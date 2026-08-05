import type { WebSearchProvider, WebSearchResult } from "./types";

const BRAVE_ENDPOINT = "https://api.search.brave.com/res/v1/web/search";

interface BraveApiResult {
  title?: string;
  url?: string;
  description?: string;
}

interface BraveApiResponse {
  // On a 2xx response, Brave omits `web` entirely when a query (correctly
  // formed or not) produces zero results — that's its normal "nothing
  // found" shape, not an error, so this must stay optional and must NOT
  // be treated as a failure signal.
  web?: {
    results?: BraveApiResult[];
  };
  // Brave returns this shape for actual errors (e.g. quota/plan issues)
  // while still using a 2xx-ish status in some cases — this, unlike a
  // missing `web`, is a real hard failure.
  error?: {
    id?: string;
    status?: number;
    code?: string;
    detail?: string;
  };
}

/**
 * Brave Search API provider (https://api-dashboard.search.brave.com/).
 * Chosen as the MVP default: simple REST API, free tier available,
 * no scraping / ToS-violating access to Google/Bing required.
 *
 * Requires BRAVE_SEARCH_API_KEY to be set in the environment. The key is
 * never logged and never sent anywhere other than the Brave API host.
 */
export function createBraveSearchProvider(apiKey: string): WebSearchProvider {
  return {
    id: "brave",
    async search(query: string): Promise<WebSearchResult[]> {
      const url = new URL(BRAVE_ENDPOINT);
      url.searchParams.set("q", query);
      url.searchParams.set("count", "20");
      url.searchParams.set("safesearch", "off");

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "X-Subscription-Token": apiKey,
        },
        // Never cache a response containing a personal search query.
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Brave Search API error: HTTP ${response.status}`);
      }

      const data = (await response.json()) as BraveApiResponse;

      // A 2xx response can still carry an error payload (e.g. quota/plan
      // issues) — that's a real failure and must not be misread as "zero
      // results" (which would show the user a false green light).
      if (data.error) {
        throw new Error(
          `Brave Search API returned an error payload: ${data.error.code ?? data.error.status ?? "unknown"}`,
        );
      }

      // `web` being absent here is Brave's normal shape for a genuine
      // zero-result query, not an error — see BraveApiResponse above.
      const results = data.web?.results ?? [];

      return results
        .filter((r): r is Required<BraveApiResult> => Boolean(r.url && r.title))
        .map((r) => ({
          url: r.url,
          title: r.title,
          snippet: r.description ?? "",
        }));
    },
  };
}
