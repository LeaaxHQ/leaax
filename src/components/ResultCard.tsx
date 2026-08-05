import type { Translation } from "@/lib/i18n/translations";
import type { CheckHit, TrafficLightStatus } from "@/lib/search";

interface ResultCardProps {
  status: TrafficLightStatus;
  hits: CheckHit[];
  totalHits: number;
  t: Translation;
}

const STATUS_STYLES: Record<TrafficLightStatus, { dot: string; border: string; bg: string }> = {
  red: { dot: "bg-status-red", border: "border-status-red/40", bg: "bg-[var(--status-red-bg)]" },
  yellow: { dot: "bg-status-yellow", border: "border-status-yellow/40", bg: "bg-[var(--status-yellow-bg)]" },
  green: { dot: "bg-status-green", border: "border-status-green/40", bg: "bg-[var(--status-green-bg)]" },
};

export function ResultCard({ status, hits, totalHits, t }: ResultCardProps) {
  const styles = STATUS_STYLES[status];
  const copy = t.result[status];

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

      {totalHits > 0 && (
        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium text-foreground-muted">
            {totalHits} {t.result.hitsFound}
          </p>
          <ul className="space-y-2">
            {hits.map((hit, i) => (
              <li
                key={`${hit.providerId}-${i}`}
                className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-border-subtle bg-background/60 px-4 py-3 text-sm"
              >
                <span className="font-mono">{hit.maskedLabel}</span>
                <span className="text-foreground-muted">
                  — {t.result.foundVia}: {hit.providerName} ({hit.sourceDomain})
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-foreground-muted">{t.result.noContentShown}</p>
        </div>
      )}
    </div>
  );
}
