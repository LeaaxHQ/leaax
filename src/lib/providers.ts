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
];

/** Builds a search-engine `site:` filter clause covering all providers. */
export function buildSiteFilter(providers: AiShareProvider[] = AI_SHARE_PROVIDERS): string {
  return providers
    .map((p) => `site:${p.domain} inurl:${p.pathPrefix}`)
    .join(" OR ");
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
