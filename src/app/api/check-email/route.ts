import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { sanitizeEmail } from "@/lib/validate";
import { runBreachCheck } from "@/lib/breach";
import { logCheckEvent } from "@/lib/logger";

export const runtime = "nodejs";

// Same guarantee as /api/check: this route never persists the request
// body anywhere (no DB, no file writes, no analytics call with the raw
// email). The email only exists in memory for the lifetime of this
// request handler, and is never written to a log (see logCheckEvent).
export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);

  // Same shared, IP-keyed limiter as /api/check — a client can't get a
  // bigger effective budget by splitting requests across the two checks.
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    logCheckEvent({ event: "check_rejected", check: "email", reason: "rate_limited" });
    return NextResponse.json(
      { error: "rate_limited", retryAfterSeconds: rateLimit.retryAfterSeconds },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
          "Cache-Control": "no-store",
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    logCheckEvent({ event: "check_rejected", check: "email", reason: "invalid_json" });
    return NextResponse.json(
      { error: "invalid_request" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const rawEmail = typeof body === "object" && body !== null ? (body as Record<string, unknown>).email : undefined;
  const sanitized = sanitizeEmail(rawEmail);

  if (!sanitized.ok) {
    logCheckEvent({ event: "check_rejected", check: "email", reason: sanitized.error });
    return NextResponse.json(
      { error: sanitized.error },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  logCheckEvent({ event: "check_requested", check: "email" });
  const startedAt = Date.now();

  try {
    const result = await runBreachCheck(sanitized.value);
    logCheckEvent({
      event: "check_completed",
      check: "email",
      status: result.status,
      hitCount: result.totalHits,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json(
      { status: result.status, hits: result.hits, totalHits: result.totalHits },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch {
    logCheckEvent({ event: "check_failed", check: "email", reason: "unexpected_error" });
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
