import type { WebSearchProvider, WebSearchResult } from "./types";

const BRAVE_ENDPOINT = "https://api.search.brave.com/res/v1/web/search";

interface BraveApiResult {
  title?: string;
  url?: string;
  description?: string;
}

interface BraveApiResponse {
  web?: {
    results?: BraveApiResult[];
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
        throw new Error(`Brave Search API error: ${response.status}`);
      }

      const data = (await response.json()) as BraveApiResponse;
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
