import type { TrafficLightStatus } from "@/lib/status";
import { maskEmail } from "@/lib/mask";
import { createXposedOrNotProvider } from "./xposedornot";
import type { BreachCheckProvider } from "./types";

export interface BreachHit {
  breachName: string;
  maskedLabel: string;
}

export interface BreachCheckResult {
  status: TrafficLightStatus;
  hits: BreachHit[];
  totalHits: number;
}

function getConfiguredProvider(): BreachCheckProvider {
  return createXposedOrNotProvider();
}

/**
 * Runs the email data-breach check for a given email address.
 *
 * Unlike the AI-chat-leak check there's no "weak match" concept here — an
 * email either shows up in a known breach or it doesn't — so the result
 * is binary: red (found in at least one breach) or green (not found).
 *
 * The raw email only ever lives in local variables for the duration of
 * this call — nothing here writes it to a log, cache, or store of any
 * kind.
 */
export async function runBreachCheck(email: string): Promise<BreachCheckResult> {
  const provider = getConfiguredProvider();
  const maskedLabel = maskEmail(email);

  const results = await provider.check(email);
  const hits: BreachHit[] = results.map((result) => ({
    breachName: result.breachName,
    maskedLabel,
  }));

  const status: TrafficLightStatus = hits.length > 0 ? "red" : "green";

  return { status, hits, totalHits: hits.length };
}
