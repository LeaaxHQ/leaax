/**
 * Configuration of AI chat providers whose PUBLIC share-link feature is
 * indexed by search engines. This list is intentionally closed/curated —
 * only providers with a genuine, search-engine-indexable public share
 * link go here. Agent-based tools that run on private/isolated
 * infrastructure (no public share links) must NOT be added.
 *
 * To add a new provider once it ships a comparable public share feature,
 * append an entry here — no other code needs to change.
 */
export interface AiShareProvider {
  /** Stable machine id, used as a translation key suffix. */
  id: string;
  /** Human readable display name. */
  name: string;
  /** Domain the share links live on. */
  domain: string;
  /** Path prefix identifying a share link on that domain. */
  pathPrefix: string;
}

export const AI_SHARE_PROVIDERS: AiShareProvider[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    domain: "chatgpt.com",
    pathPrefix: "/share/",
  },
  {
    id: "claude",
    name: "Claude",
    domain: "claude.ai",
    pathPrefix: "/share/",
  },
  {
    id: "gemini",
    name: "Gemini",
    domain: "gemini.google.com",
    pathPrefix: "/share/",
  },
  {
    id: "grok",
    name: "Grok",
    domain: "grok.com",
    pathPrefix: "/share/",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    domain: "chat.deepseek.com",
    pathPrefix: "/share/",
  },
  {
    id: "copilot",
    name: "Microsoft Copilot",
    domain: "copilot.microsoft.com",
    pathPrefix: "/chats/",
  },
  {
    id: "qwen",
    name: "Qwen",
    domain: "chat.qwen.ai",
    pathPrefix: "/s/",
  },
];

/**
 * Builds a single-provider search query.
 *
 * Deliberately one `site:` filter per request, not an OR-combination of
 * several — Brave Search only reliably applies `site:` when there's
 * exactly one in the query; combined with OR it silently returns no
 * results at all (flagged internally by Brave as `bad_results: true`),
 * which would show a false "nothing found" for every check. Likewise,
 * Google-style `inurl:` isn't a Brave operator — the path belongs in the
 * `site:` value itself (`site:example.com/path/`), not as a separate
 * clause.
 */
export function buildProviderQuery(query: string, provider: AiShareProvider): string {
  return `"${query}" site:${provider.domain}${provider.pathPrefix}`;
}

/** Finds which configured provider a given result URL belongs to, if any. */
export function matchProvider(url: string): AiShareProvider | undefined {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return undefined;
  }
  return AI_SHARE_PROVIDERS.find(
    (p) =>
      (parsed.hostname === p.domain || parsed.hostname.endsWith(`.${p.domain}`)) &&
      parsed.pathname.startsWith(p.pathPrefix),
  );
}
