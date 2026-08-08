import type { ReactNode } from "react";
import type { Translation } from "@/lib/i18n/translations";
import type { TrafficLightStatus } from "@/lib/status";

/** A single masked hit, already formatted for display — shared shape for
 * both the AI-chat-leak hits and the email-breach hits, so the rendering
 * doesn't need to know which check produced them. */
export interface DisplayHit {
  key: string;
  maskedLabel: string;
  detail: string;
}

type CheckBreakdownProps =
  | {
      kind: "ok";
      label: string;
      status: TrafficLightStatus;
      hits: DisplayHit[];
      totalHits: number;
      t: Translation;
      /** Pre-rendered "what to do now" recommendation HTML for this check, in the current locale — see src/lib/content.ts. */
      recommendationHtml: string;
    }
  | { kind: "error"; label: string; errorMessage: string };

const STATUS_DOT: Record<TrafficLightStatus, string> = {
  red: "bg-status-red",
  yellow: "bg-status-yellow",
  green: "bg-status-green",
};

/** One line of the per-check breakdown, e.g. "AI chat history: Red", plus its masked hit list. */
export function CheckBreakdown(props: CheckBreakdownProps) {
  if (props.kind === "error") {
    return (
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-foreground-muted" aria-hidden="true" />
          <span>{props.label}</span>
        </div>
        <p className="mt-2 text-xs text-foreground-muted">{props.errorMessage}</p>
      </div>
    );
  }

  const { label, status, hits, totalHits, t, recommendationHtml } = props;

  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_DOT[status]}`} aria-hidden="true" />
        <span>
          {label}: {t.result.statusWord[status]}
        </span>
      </div>

      {totalHits > 0 && (
        <div className="mt-3 space-y-3">
          <p className="text-xs font-medium text-foreground-muted">
            {totalHits} {t.result.hitsFound}
          </p>
          <ul className="space-y-2">
            {hits.map((hit) => (
              <li
                key={hit.key}
                className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-border-subtle bg-background/60 px-4 py-3 text-sm"
              >
                <span className="font-mono">{hit.maskedLabel}</span>
                <span className="text-foreground-muted">— {hit.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fixed, editorially-reviewed guidance (content/recommendations-*.md)
          — never model-generated — shown collapsed by default so the
          result itself stays the visual focus. Only surfaced for an
          actual hit (red/yellow), never for a clean "green" result. */}
      {status !== "green" && (
        <details className="recommendation-toggle mt-3 text-sm">
          <summary className="text-accent font-medium">{t.result.whatToDoNow}</summary>
          <div
            className="recommendation-content mt-2"
            dangerouslySetInnerHTML={{ __html: recommendationHtml }}
          />
        </details>
      )}
    </div>
  );
}

interface OverallResultCardProps {
  status: TrafficLightStatus;
  children: ReactNode;
  t: Translation;
  hasAnyHits: boolean;
}

const STATUS_STYLES: Record<TrafficLightStatus, { dot: string; border: string; bg: string }> = {
  red: { dot: "bg-status-red", border: "border-status-red/40", bg: "bg-[var(--status-red-bg)]" },
  yellow: { dot: "bg-status-yellow", border: "border-status-yellow/40", bg: "bg-[var(--status-yellow-bg)]" },
  green: { dot: "bg-status-green", border: "border-status-green/40", bg: "bg-[var(--status-green-bg)]" },
};

/** The overall (combined) result — the worse of the individual checks' statuses — with each check's breakdown nested inside. */
export function OverallResultCard({ status, children, t, hasAnyHits }: OverallResultCardProps) {
  const styles = STATUS_STYLES[status];
  const copy = t.result.overall[status];

  return (
    <div
      className={`w-full rounded-2xl border ${styles.border} ${styles.bg} p-6 sm:p-8`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span className={`h-4 w-4 shrink-0 rounded-full ${styles.dot}`} aria-hidden="true" />
        <h2 className="text-lg sm:text-xl font-semibold">{copy.title}</h2>
      </div>
      <p className="mt-3 text-foreground-muted leading-relaxed">{copy.body}</p>

      <div className="mt-6 space-y-4 divide-y divide-border-subtle/60 [&>*+*]:pt-4">{children}</div>

      {hasAnyHits && <p className="mt-4 text-xs text-foreground-muted">{t.result.noContentShown}</p>}
    </div>
  );
}
