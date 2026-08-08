/**
 * Logging must never contain the user's search term, raw result content,
 * or anything else personally identifiable. Only structured, non-PII
 * event metadata is allowed through this module — treat it as the single
 * choke point for server-side logging so that guarantee stays enforceable
 * in one place.
 */

type CheckEvent = {
  event: "check_requested" | "check_completed" | "check_rejected" | "check_failed";
  /** Which independent check this event is about. Not PII — just a label. */
  check?: "name" | "email";
  status?: "green" | "yellow" | "red";
  hitCount?: number;
  rawResultCount?: number;
  reason?: string;
  durationMs?: number;
};

export function logCheckEvent(event: CheckEvent): void {
  // Intentionally no request body, query string, headers, or IP here.
  console.log(
    JSON.stringify({
      ts: new Date().toISOString(),
      ...event,
    }),
  );
}
