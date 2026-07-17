import { NumberBadge } from "@/components/shared/NumberBadge";
import { cn } from "@/lib/utils";
import type { BetLine } from "@/types/bet";
import type { ExtraFieldConfig } from "@/types/game";

/** Etiquetas cortas para las tarjetas de apuestas, donde el nombre completo del campo ocupa demasiado. */
const EXTRA_LABEL_ABBREVIATIONS: Record<string, string> = {
  complementario: "Complementario",
  reintegro: "Reintegro"
};

interface BetLineCardProps {
  line: BetLine;
  extrasConfig?: ExtraFieldConfig[];
  className?: string;
  enabledLabel?: boolean;
}

export function BetLineCard({ line, extrasConfig, className, enabledLabel = true }: BetLineCardProps) {
  return (
    <div className={cn("flex items-start flex-col gap-2", className)}>
      <div className="flex flex-wrap items-center gap-1">
        {line.numbers.map((n) => (
          <NumberBadge key={n} value={n} size="lg" />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1 mt-2">
        {extrasConfig?.map((extra) => {
          const raw = line.extras[extra.key];
          if (raw === undefined || raw === null || raw === "") return null;
          const label = EXTRA_LABEL_ABBREVIATIONS[extra.key] ?? extra.label;
          return (
            <span key={extra.key} className="flex items-center gap-1 text-xs bg-foreground/5 rounded-full px-2 py-1">
              {enabledLabel && <span className="font-medium px-2">{label}:</span>}
              {typeof raw === "number" ? <NumberBadge value={raw} size="md" variant="extra" /> : <span>{String(raw)}</span>}
            </span>
          );
        })}
      </div>
    </div>
  );
}
