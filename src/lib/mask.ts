/**
 * Masks a name/company string for display so a result can be shown as
 * evidence without exposing the full identity, e.g. "Klaus Mueller" ->
 * "K*** M*******".
 */
export function maskQuery(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      const first = word.charAt(0);
      // Fixed-length mask (not word.length - 1) so the original length
      // can't be reconstructed from the masked output.
      return `${first}***`;
    })
    .join(" ");
}

/** Masks a URL down to just its hostname, e.g. "https://chatgpt.com/share/abc123" -> "chatgpt.com". */
export function maskSourceUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "unknown source";
  }
}
