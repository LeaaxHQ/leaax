import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { sanitizeQuery } from "@/lib/validate";
import { runCheck, SearchProviderNotConfiguredError } from "@/lib/search";
import { logCheckEvent } from "@/lib/logger";

export const runtime = "nodejs";

// This route intentionally never persists the request body anywhere
// (no DB, no file writes, no analytics call with the raw query). The
// query only exists in memory for the lifetime of this request handler.
export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);

  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    logCheckEvent({ event: "check_rejected", reason: "rate_limited" });
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
    logCheckEvent({ event: "check_rejected", reason: "invalid_json" });
    return NextResponse.json(
      { error: "invalid_request" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const rawQuery = typeof body === "object" && body !== null ? (body as Record<string, unknown>).query : undefined;
  const sanitized = sanitizeQuery(rawQuery);

  if (!sanitized.ok) {
    logCheckEvent({ event: "check_rejected", reason: sanitized.error });
    return NextResponse.json(
      { error: sanitized.error },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  logCheckEvent({ event: "check_requested" });
  const startedAt = Date.now();

  try {
    const result = await runCheck(sanitized.value);
    logCheckEvent({
      event: "check_completed",
      status: result.status,
      hitCount: result.totalHits,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof SearchProviderNotConfiguredError) {
      logCheckEvent({ event: "check_failed", reason: "provider_not_configured" });
      return NextResponse.json(
        { error: "provider_not_configured" },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }

    logCheckEvent({ event: "check_failed", reason: "unexpected_error" });
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
