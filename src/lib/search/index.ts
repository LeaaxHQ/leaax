import { AI_SHARE_PROVIDERS, buildSiteFilter, matchProvider } from "@/lib/providers";
import { maskQuery, maskSourceUrl } from "@/lib/mask";
import { createBraveSearchProvider } from "./brave";
import { SearchProviderNotConfiguredError, type WebSearchProvider } from "./types";

export type TrafficLightStatus = "red" | "yellow" | "green";

export interface CheckHit {
  providerId: string;
  providerName: string;
  sourceDomain: string;
  maskedLabel: string;
}

export interface CheckResult {
  status: TrafficLightStatus;
  hits: CheckHit[];
  totalHits: number;
}

function getConfiguredProvider(): WebSearchProvider {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (apiKey) {
    return createBraveSearchProvider(apiKey);
  }
  throw new SearchProviderNotConfiguredError();
}

/**
 * Runs the public share-link check for a given name/company.
 *
 * The raw query string only ever lives in local variables for the
 * duration of this call — nothing here writes it to a log, cache, or
 * store of any kind.
 */
export async function runCheck(query: string): Promise<CheckResult> {
  const provider = getConfiguredProvider();

  const siteFilter = buildSiteFilter(AI_SHARE_PROVIDERS);
  const searchQuery = `"${query}" (${siteFilter})`;

  const results = await provider.search(searchQuery);

  const normalizedQuery = query.toLowerCase();
  const maskedLabel = maskQuery(query);

  const hits: CheckHit[] = [];
  let hasStrongMatch = false;
  let hasWeakMatch = false;

  for (const result of results) {
    const matched = matchProvider(result.url);
    if (!matched) continue;

    const haystack = `${result.title} ${result.snippet}`.toLowerCase();
    const isStrongMatch = haystack.includes(normalizedQuery);

    if (isStrongMatch) {
      hasStrongMatch = true;
    } else {
      hasWeakMatch = true;
    }

    hits.push({
      providerId: matched.id,
      providerName: matched.name,
      sourceDomain: maskSourceUrl(result.url),
      maskedLabel,
    });
  }

  const status: TrafficLightStatus = hasStrongMatch ? "red" : hasWeakMatch ? "yellow" : "green";

  return {
    status,
    hits,
    totalHits: hits.length,
  };
}

export { SearchProviderNotConfiguredError };
