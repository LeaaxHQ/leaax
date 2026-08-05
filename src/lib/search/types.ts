export interface WebSearchResult {
  url: string;
  title: string;
  snippet: string;
}

export interface WebSearchProvider {
  id: string;
  /** Runs a single web search and returns raw results. Must not log the query. */
  search(query: string): Promise<WebSearchResult[]>;
}

export class SearchProviderNotConfiguredError extends Error {
  constructor() {
    super("No search provider is configured (missing API key env var).");
    this.name = "SearchProviderNotConfiguredError";
  }
}
