"use client";

import { useState, type FormEvent } from "react";
import { useLanguage } from "@/lib/i18n/context";
import type { Translation } from "@/lib/i18n/translations";
import { ResultCard } from "@/components/ResultCard";
import type { CheckHit, TrafficLightStatus } from "@/lib/search";

interface CheckResponse {
  status: TrafficLightStatus;
  hits: CheckHit[];
  totalHits: number;
}

interface ApiErrorBody {
  error: keyof Translation["errors"] | string;
}

type ErrorKey = keyof Translation["errors"];

type ViewState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "result"; data: CheckResponse }
  | { kind: "error"; errorKey: ErrorKey };

const KNOWN_ERROR_KEYS: ErrorKey[] = [
  "too_short",
  "too_long",
  "invalid",
  "rate_limited",
  "provider_not_configured",
  "internal_error",
];

function toErrorKey(value: string): ErrorKey {
  return (KNOWN_ERROR_KEYS as string[]).includes(value) ? (value as ErrorKey) : "internal_error";
}

export function CheckForm() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [state, setState] = useState<ViewState>({ kind: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.kind === "loading") return;

    setState({ kind: "loading" });

    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const body = (await response.json()) as CheckResponse | ApiErrorBody;

      if (!response.ok) {
        setState({ kind: "error", errorKey: toErrorKey((body as ApiErrorBody).error) });
        return;
      }

      setState({ kind: "result", data: body as CheckResponse });
    } catch {
      setState({ kind: "error", errorKey: "internal_error" });
    }
  }

  function reset() {
    setQuery("");
    setState({ kind: "idle" });
  }

  const isLoading = state.kind === "loading";

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {state.kind !== "result" && (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="query" className="sr-only">
              {t.form.label}
            </label>
            <input
              id="query"
              name="query"
              type="text"
              autoComplete="off"
              required
              minLength={2}
              maxLength={120}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.form.placeholder}
              className="w-full rounded-xl border border-border-subtle bg-background-elevated px-4 py-3.5 text-base text-foreground placeholder:text-foreground-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || query.trim().length < 2}
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
          <ResultCard status={state.data.status} hits={state.data.hits} totalHits={state.data.totalHits} t={t} />
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
