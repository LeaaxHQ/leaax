"use client";

import { useState, type FormEvent } from "react";
import { useLanguage } from "@/lib/i18n/context";
import type { Translation } from "@/lib/i18n/translations";
import { CheckBreakdown, OverallResultCard, type DisplayHit } from "@/components/ResultCard";
import type { CheckHit } from "@/lib/search";
import type { BreachHit } from "@/lib/breach";
import { worseStatus, type TrafficLightStatus } from "@/lib/status";
import type { RecommendationsContent } from "@/lib/content";

interface NameCheckResponse {
  status: TrafficLightStatus;
  hits: CheckHit[];
  totalHits: number;
}

interface EmailCheckResponse {
  status: TrafficLightStatus;
  hits: BreachHit[];
  totalHits: number;
}

interface ApiErrorBody {
  error: keyof Translation["errors"] | string;
}

type ErrorKey = keyof Translation["errors"];

type CheckOutcome<T> = { kind: "ok"; data: T } | { kind: "error"; errorKey: ErrorKey };

type ViewState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "result"; name?: CheckOutcome<NameCheckResponse>; email?: CheckOutcome<EmailCheckResponse> }
  | { kind: "error"; errorKey: ErrorKey };

const KNOWN_ERROR_KEYS: ErrorKey[] = [
  "too_short",
  "too_long",
  "invalid",
  "rate_limited",
  "provider_not_configured",
  "internal_error",
  "at_least_one_required",
];

function toErrorKey(value: string): ErrorKey {
  return (KNOWN_ERROR_KEYS as string[]).includes(value) ? (value as ErrorKey) : "internal_error";
}

async function fetchCheck<T>(url: string, body: Record<string, string>): Promise<CheckOutcome<T>> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const responseBody = (await response.json()) as T | ApiErrorBody;

    if (!response.ok) {
      return { kind: "error", errorKey: toErrorKey((responseBody as ApiErrorBody).error) };
    }

    return { kind: "ok", data: responseBody as T };
  } catch {
    return { kind: "error", errorKey: "internal_error" };
  }
}

interface CheckFormProps {
  recommendations: RecommendationsContent;
}

export function CheckForm({ recommendations }: CheckFormProps) {
  const { t, locale } = useLanguage();
  const [nameQuery, setNameQuery] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<ViewState>({ kind: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.kind === "loading") return;

    const trimmedName = nameQuery.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length === 0 && trimmedEmail.length === 0) {
      setState({ kind: "error", errorKey: "at_least_one_required" });
      return;
    }

    setState({ kind: "loading" });

    // Both checks (when both fields are filled) run in parallel, against
    // their own independent endpoints — see /api/check and
    // /api/check-email. One failing never blocks or discards the other.
    const [nameOutcome, emailOutcome] = await Promise.all([
      trimmedName.length > 0
        ? fetchCheck<NameCheckResponse>("/api/check", { query: trimmedName })
        : Promise.resolve(undefined),
      trimmedEmail.length > 0
        ? fetchCheck<EmailCheckResponse>("/api/check-email", { email: trimmedEmail })
        : Promise.resolve(undefined),
    ]);

    setState({ kind: "result", name: nameOutcome, email: emailOutcome });
  }

  function reset() {
    setNameQuery("");
    setEmail("");
    setState({ kind: "idle" });
  }

  const isLoading = state.kind === "loading";
  const canSubmit = nameQuery.trim().length > 0 || email.trim().length > 0;

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {state.kind !== "result" && (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label htmlFor="query" className="sr-only">
                {t.form.nameLabel}
              </label>
              <input
                id="query"
                name="query"
                type="text"
                autoComplete="off"
                maxLength={120}
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                placeholder={t.form.namePlaceholder}
                className="w-full rounded-xl border border-border-subtle bg-background-elevated px-4 py-3.5 text-base text-foreground placeholder:text-foreground-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="email" className="sr-only">
                {t.form.emailLabel}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="off"
                maxLength={254}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.form.emailPlaceholder}
                className="w-full rounded-xl border border-border-subtle bg-background-elevated px-4 py-3.5 text-base text-foreground placeholder:text-foreground-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !canSubmit}
            className="shrink-0 rounded-xl bg-accent px-6 py-3.5 text-base font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? t.form.submitLoading : t.form.submit}
          </button>
        </form>
      )}

      {state.kind !== "result" && <p className="text-xs text-foreground-muted -mt-2">{t.form.hint}</p>}

      {state.kind === "error" && (
        <div
          role="alert"
          className="w-full rounded-xl border border-status-red/40 bg-[var(--status-red-bg)] px-4 py-3 text-sm"
        >
          {t.errors[state.errorKey]}
        </div>
      )}

      {state.kind === "result" && (
        <>
          <ResultsSummary
            name={state.name}
            email={state.email}
            t={t}
            aiChatRecommendationHtml={recommendations.aiChat[locale]}
            breachRecommendationHtml={recommendations.breach[locale]}
          />
          <button
            type="button"
            onClick={reset}
            className="text-sm font-medium text-accent hover:underline cursor-pointer"
          >
            {t.result.checkAnother}
          </button>
        </>
      )}
    </div>
  );
}

interface ResultsSummaryProps {
  name?: CheckOutcome<NameCheckResponse>;
  email?: CheckOutcome<EmailCheckResponse>;
  t: Translation;
  aiChatRecommendationHtml: string;
  breachRecommendationHtml: string;
}

function ResultsSummary({ name, email, t, aiChatRecommendationHtml, breachRecommendationHtml }: ResultsSummaryProps) {
  const okStatuses: TrafficLightStatus[] = [];
  if (name?.kind === "ok") okStatuses.push(name.data.status);
  if (email?.kind === "ok") okStatuses.push(email.data.status);

  // Every check that actually ran failed outright (e.g. rate limited,
  // upstream provider down) — there's nothing to summarize, so surface
  // the failure(s) directly instead of a misleading overall card.
  if (okStatuses.length === 0) {
    return (
      <div className="w-full flex flex-col gap-3">
        {name?.kind === "error" && (
          <div
            role="alert"
            className="w-full rounded-xl border border-status-red/40 bg-[var(--status-red-bg)] px-4 py-3 text-sm"
          >
            {t.result.checks.name.label}: {t.errors[name.errorKey]}
          </div>
        )}
        {email?.kind === "error" && (
          <div
            role="alert"
            className="w-full rounded-xl border border-status-red/40 bg-[var(--status-red-bg)] px-4 py-3 text-sm"
          >
            {t.result.checks.email.label}: {t.errors[email.errorKey]}
          </div>
        )}
      </div>
    );
  }

  const overallStatus = okStatuses.reduce(worseStatus);

  const nameHits: DisplayHit[] =
    name?.kind === "ok"
      ? name.data.hits.map((hit, i) => ({
          key: `name-${i}`,
          maskedLabel: hit.maskedLabel,
          detail: `${t.result.foundVia}: ${hit.providerName} (${hit.sourceDomain})`,
        }))
      : [];

  const emailHits: DisplayHit[] =
    email?.kind === "ok"
      ? email.data.hits.map((hit, i) => ({
          key: `email-${i}`,
          maskedLabel: hit.maskedLabel,
          detail: `${t.result.foundInBreach}: ${hit.breachName}`,
        }))
      : [];

  const hasAnyHits = nameHits.length > 0 || emailHits.length > 0;

  return (
    <OverallResultCard status={overallStatus} t={t} hasAnyHits={hasAnyHits}>
      {name &&
        (name.kind === "ok" ? (
          <CheckBreakdown
            kind="ok"
            label={t.result.checks.name.label}
            status={name.data.status}
            hits={nameHits}
            totalHits={name.data.totalHits}
            t={t}
            recommendationHtml={aiChatRecommendationHtml}
          />
        ) : (
          <CheckBreakdown kind="error" label={t.result.checks.name.label} errorMessage={t.errors[name.errorKey]} />
        ))}
      {email &&
        (email.kind === "ok" ? (
          <CheckBreakdown
            kind="ok"
            label={t.result.checks.email.label}
            status={email.data.status}
            hits={emailHits}
            totalHits={email.data.totalHits}
            t={t}
            recommendationHtml={breachRecommendationHtml}
          />
        ) : (
          <CheckBreakdown kind="error" label={t.result.checks.email.label} errorMessage={t.errors[email.errorKey]} />
        ))}
    </OverallResultCard>
  );
}
