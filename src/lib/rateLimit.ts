/**
 * Simple in-memory sliding-window rate limiter, keyed by IP.
 *
 * MVP-1 explicitly runs without a database/backend, so this limiter lives
 * in the memory of a single serverless function instance. On Vercel that
 * means the effective limit is "per warm instance", not truly global —
 * good enough to blunt casual scripted abuse for the MVP. If usage grows,
 * swap this module for a shared store (e.g. Upstash Redis / Vercel KV)
 * without touching call sites.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

type Hit = number[];

const hits = new Map<string, Hit>();

// Periodically forget IPs with no recent activity so the map can't grow
// without bound over the lifetime of a warm instance.
const MAX_TRACKED_IPS = 5000;

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const existing = hits.get(ip) ?? [];
  const recent = existing.filter((ts) => ts > windowStart);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestInWindow = recent[0];
    const retryAfterMs = oldestInWindow + WINDOW_MS - now;
    hits.set(ip, recent);
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
  }

  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > MAX_TRACKED_IPS) {
    evictStale(windowStart);
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

function evictStale(windowStart: number) {
  for (const [key, timestamps] of hits) {
    if (timestamps.every((ts) => ts <= windowStart)) {
      hits.delete(key);
    }
  }
}

/** Extracts a best-effort client IP from standard proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
