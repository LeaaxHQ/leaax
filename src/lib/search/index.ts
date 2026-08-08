import { AI_SHARE_PROVIDERS, buildProviderQuery, matchProvider } from "@/lib/providers";
import { maskQuery, maskSourceUrl } from "@/lib/mask";
import type { TrafficLightStatus } from "@/lib/status";
import { createBraveSearchProvider } from "./brave";
import { SearchProviderNotConfiguredError, type WebSearchProvider } from "./types";

// Re-exported for backwards compatibility — existing call sites import
// this type from "@/lib/search". The canonical definition lives in
// "@/lib/status" so the email-breach check (src/lib/breach) can share it
// without creating a dependency on the search module.
export type { TrafficLightStatus };

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
  /**
   * How many results the search provider returned in total across all
   * providers, before filtering down to our configured AI-share-link
   * domains. Diagnostics only — never sent to the client — so a "0 hits"
   * outcome can be told apart from "the provider silently returned
   * nothing at all", which would point at an upstream problem rather
   * than a real all-clear.
   */
  rawResultCount: number;
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
 * One search request per configured provider, run in parallel — Brave
 * Search only reliably applies a `site:` filter when there is exactly
 * one per query, so the 5 providers can't be OR-combined into a single
 * request (see buildProviderQuery in src/lib/providers.ts).
 *
 * The raw query string only ever lives in local variables for the
 * duration of this call — nothing here writes it to a log, cache, or
 * store of any kind. If any single provider request fails, the whole
 * check fails (fail closed) rather than silently showing an incomplete
 * green result.
 */
export async function runCheck(query: string): Promise<CheckResult> {
  const provider = getConfiguredProvider();

  const normalizedQuery = query.toLowerCase();
  const maskedLabel = maskQuery(query);

  const perProviderResults = await Promise.all(
    AI_SHARE_PROVIDERS.map(async (aiProvider) => ({
      aiProvider,
      results: await provider.search(buildProviderQuery(query, aiProvider)),
    })),
  );

  const hits: CheckHit[] = [];
  let rawResultCount = 0;
  let hasStrongMatch = false;
  let hasWeakMatch = false;

  for (const { aiProvider, results } of perProviderResults) {
    rawResultCount += results.length;

    for (const result of results) {
      const matched = matchProvider(result.url);
      // Defense in depth: only trust a result if it actually belongs to
      // the provider we filtered for, in case a search provider ever
      // returns something outside its own site: filter.
      if (!matched || matched.id !== aiProvider.id) continue;

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
  }

  const status: TrafficLightStatus = hasStrongMatch ? "red" : hasWeakMatch ? "yellow" : "green";

  return {
    status,
    hits,
    totalHits: hits.length,
    rawResultCount,
  };
}

export { SearchProviderNotConfiguredError };
