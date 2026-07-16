import { Link } from "react-router-dom";
import { GameBadge } from "@/components/shared/GameBadge";
import { NumberBadge } from "@/components/shared/NumberBadge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPlainDate } from "@/lib/formatters/date";
import { useSettingsStore } from "@/store/settingsStore";
import type { ComparisonResult } from "@/types/comparison";

export function ComparisonResultCard({ result, gameLabel, to }: { result: ComparisonResult; gameLabel?: string; to?: string }) {
  const dateFormat = useSettingsStore((state) => state.dateFormat);
  const matchSet = new Set(result.matches);
  const total = result.matches.length + result.nonMatches.length;

  const content = (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">#{result.ranking}</span>
          <GameBadge game={result.game} label={gameLabel} />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {result.recordType === "draw" ? "Sorteo" : "Apuesta"} · {formatPlainDate(result.date, dateFormat)}
          </span>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {result.totalMatches}/{total}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {result.numbers.map((n) => (
          <NumberBadge key={n} value={n} variant={matchSet.has(n) ? "match" : "muted"} />
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {result.percentage}% de aciertos · diferencia de suma {result.sumDifference > 0 ? "+" : ""}
        {result.sumDifference}
      </p>
    </>
  );

  return (
    <Card>
      <CardContent className="pt-4">
        {to ? (
          <Link to={to} className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
            {content}
          </Link>
        ) : (
          content
        )}
      </CardContent>
    </Card>
  );
}
