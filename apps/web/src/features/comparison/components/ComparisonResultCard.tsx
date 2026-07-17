import { Link } from "react-router-dom";
import { GameBadge } from "@/components/shared/GameBadge";
import { NumberBadge } from "@/components/shared/NumberBadge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateLong } from "@/lib/formatters/date";
import { useSettingsStore } from "@/store/settingsStore";
import type { ComparisonResult } from "@/types/comparison";

export function ComparisonResultCard({ result, gameLabel, to }: { result: ComparisonResult; gameLabel?: string; to?: string }) {
  const dateFormat = useSettingsStore((state) => state.dateFormat);
  const matchSet = new Set(result.matches);
  const total = result.matches.length + result.nonMatches.length;

  const content = (
    <>
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2 justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold bg-foreground text-background">#{result.ranking}</span>
            <GameBadge game={result.game} label={gameLabel} />
          </div>
          <span className="rounded-full bg-foreground/10  px-2.5 py-0.5 text-xs font-semibold">
            {result.totalMatches}/{total}
          </span>
        </div>
        <p className="font-semibold text-base">
          {result.recordType === "draw" ? "Sorteo" : "Apuesta"} · {formatDateLong(result.date, dateFormat)}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5 **:data-slot-badge:size-10">
        {result.numbers.map((n) => (
          <NumberBadge key={n} value={n} variant={matchSet.has(n) ? "match" : "muted"} />
        ))}
      </div>
      <p className="mt-3 text-xs text-foreground/80">
        {result.percentage}% de aciertos · diferencia de suma {result.sumDifference > 0 ? "+" : ""}
        {result.sumDifference}
      </p>
    </>
  );

  return (
    <Card>
      <CardContent className="w-full">
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
