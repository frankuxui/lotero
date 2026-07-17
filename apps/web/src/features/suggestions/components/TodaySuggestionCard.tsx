import { GameBadge } from "@/components/shared/GameBadge";
import { NumberBadge } from "@/components/shared/NumberBadge";
import { Card } from "@/components/ui";
import type { ExtraFieldConfig } from "@/types/game";
import type { Suggestion } from "@/types/suggestion";

const EXTRA_LABEL_ABBREVIATIONS: Record<string, string> = {
  complementario: "C",
  reintegro: "R"
};

export function TodaySuggestionCard({ suggestion, gameLabel, extrasConfig }: { suggestion: Suggestion; gameLabel?: string; extrasConfig?: ExtraFieldConfig[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <GameBadge game={suggestion.game} label={gameLabel} />
        <span className="text-xs text-foreground/70">Sugerencia de hoy</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {suggestion.numbers.map((n) => (
          <NumberBadge key={n} value={n} />
        ))}
        {extrasConfig?.map((extra) => {
          const raw = suggestion.extras[extra.key];
          if (raw === undefined || raw === null || raw === "") return null;
          const label = EXTRA_LABEL_ABBREVIATIONS[extra.key] ?? extra.label;

          if (extra?.key === "reintegro" && typeof raw === "number") {
            return (
              <span key={extra.key} className="ml-1 flex items-center gap-1 text-xs">
                <span className="font-medium">{label}:</span>
                <NumberBadge value={raw} size="md" variant="extra" />
              </span>
            );
          }

          if (extra?.key === "complementario" && typeof raw === "number") {
            return (
              <span key={extra.key} className="ml-1 flex items-center gap-1 text-xs">
                <span className="font-medium">{label}:</span>
                <NumberBadge value={raw} size="md" variant="extra" />
              </span>
            );
          }

          if (extra?.key === "jocker" && typeof raw === "number") {
            return (
              <span key={extra.key} className="rounded-full inline-flex flex-none items-center justify-center bg-indigo-500/10">
                <span className="font-medium">{label}:</span>
                <NumberBadge value={raw} size="md" variant="extra" />
              </span>
            );
          }
          return (
            <span key={extra.key} className="ml-1 flex items-center gap-1 text-xs">
              <span className="font-medium">{label}:</span>
              {typeof raw === "number" ? <NumberBadge value={raw} size="md" variant="extra" /> : <span>{String(raw)}</span>}
            </span>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-foreground/60">Basada en proximidad a sorteos recientes, coincidencias de fecha en años anteriores y frecuencia histórica.</p>
    </Card>
  );
}
