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

/**
 * Masks an email address for display, e.g. "jane.doe@example.com" ->
 * "j***@e*****.com". Like maskQuery, every masked segment uses a
 * fixed-length mask (not the original segment's length) so neither the
 * local part nor the domain name's original length can be reconstructed
 * from the masked output.
 */
export function maskEmail(email: string): string {
  const atIndex = email.indexOf("@");
  if (atIndex <= 0 || atIndex === email.length - 1) {
    return "***";
  }

  const localPart = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);

  const lastDot = domain.lastIndexOf(".");
  const hasTld = lastDot > 0 && lastDot < domain.length - 1;
  const domainName = hasTld ? domain.slice(0, lastDot) : domain;
  const tld = hasTld ? domain.slice(lastDot + 1) : "";

  const maskedLocal = `${localPart.charAt(0)}***`;
  const maskedDomain = `${domainName.charAt(0)}*****`;

  return hasTld ? `${maskedLocal}@${maskedDomain}.${tld}` : `${maskedLocal}@${maskedDomain}`;
}
