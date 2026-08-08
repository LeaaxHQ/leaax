export interface BreachSearchResult {
  /** Name of the breach the email was found in, e.g. "LinkedIn". */
  breachName: string;
}

export interface BreachCheckProvider {
  id: string;
  /** Runs a single breach lookup for one email. Must not log the email. */
  check(email: string): Promise<BreachSearchResult[]>;
}
