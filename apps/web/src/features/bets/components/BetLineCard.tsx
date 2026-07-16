import { NumberBadge } from "@/components/shared/NumberBadge";
import type { BetLine } from "@/types/bet";
import type { ExtraFieldConfig } from "@/types/game";

/** Etiquetas cortas para las tarjetas de apuestas, donde el nombre completo del campo ocupa demasiado. */
const EXTRA_LABEL_ABBREVIATIONS: Record<string, string> = {
  complementario: "C",
  reintegro: "R",
};

export function BetLineCard({ line, extrasConfig }: { line: BetLine; extrasConfig?: ExtraFieldConfig[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-slate-200 p-2.5 dark:border-slate-800">
      {line.numbers.map((n) => (
        <NumberBadge key={n} value={n} size="sm" />
      ))}
      {extrasConfig?.map((extra) => {
        const raw = line.extras[extra.key];
        if (raw === undefined || raw === null || raw === "") return null;
        const label = EXTRA_LABEL_ABBREVIATIONS[extra.key] ?? extra.label;
        return (
          <span key={extra.key} className="ml-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">{label}:</span>
            {typeof raw === "number" ? <NumberBadge value={raw} size="sm" variant="extra" /> : <span>{String(raw)}</span>}
          </span>
        );
      })}
    </div>
  );
}
