/**
 * Shared traffic-light status type, used by both the AI-chat-leak check
 * and the email-breach check so the two independent checks can be
 * combined into one overall result.
 */
export type TrafficLightStatus = "red" | "yellow" | "green";

const SEVERITY: Record<TrafficLightStatus, number> = { green: 0, yellow: 1, red: 2 };

/** Combines two traffic-light statuses into the worse (more severe) of the two. */
export function worseStatus(a: TrafficLightStatus, b: TrafficLightStatus): TrafficLightStatus {
  return SEVERITY[a] >= SEVERITY[b] ? a : b;
}
