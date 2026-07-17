import { GameBadge } from "@/components/shared/GameBadge";
import { NumberBadge } from "@/components/shared/NumberBadge";
import { Card, CardContent } from "@/components/ui/card";
import { SuggestionOutcomeBadge } from "@/features/suggestions/components/SuggestionOutcomeBadge";
import { formatPlainDate, type DateFormatPreference } from "@/lib/formatters/date";
import type { SuggestionWithOutcome } from "@/types/suggestion";

export function SuggestionCard({
  suggestion,
  gameLabel,
  dateFormat,
}: {
  suggestion: SuggestionWithOutcome;
  gameLabel?: string;
  dateFormat?: DateFormatPreference;
}) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between gap-2">
          <GameBadge game={suggestion.game} label={gameLabel} />
          <span className="text-xs text-slate-500 dark:text-slate-400">{formatPlainDate(suggestion.suggestionDate, dateFormat)}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestion.numbers.map((n) => (
            <NumberBadge key={n} value={n} size="sm" />
          ))}
        </div>
        <div className="mt-2">
          <SuggestionOutcomeBadge outcome={suggestion.outcome} />
        </div>
      </CardContent>
    </Card>
  );
}
