import { NumberBadge } from "@/components/shared/NumberBadge";

export function SelectedNumbers({
  value,
  count,
  emptyLabel = "Ningún número seleccionado",
}: {
  value: number[];
  count?: number;
  emptyLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {value.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-slate-500">{emptyLabel}</p>
      ) : (
        [...value]
          .sort((a, b) => a - b)
          .map((n, i) => <NumberBadge key={i} value={n} variant="match" />)
      )}
      {count !== undefined && (
        <span className="ml-auto shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">
          {value.length}/{count} seleccionados
        </span>
      )}
    </div>
  );
}
