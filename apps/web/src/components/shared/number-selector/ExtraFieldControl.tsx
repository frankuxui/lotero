import { NumberGrid } from "@/components/shared/number-selector/NumberGrid";
import { Input } from "@/components/ui/input";
import { formatLotteryNumber } from "@/lib/formatters/number";
import { cn } from "@/lib/utils";
import type { ExtraFieldConfig } from "@/types/game";

/** Rangos pequeños (ej. reintegro 0-9) se muestran como grupo de botones tipo segmented. */
const SEGMENTED_MAX_RANGE = 10;

export function ExtraFieldControl({
  config,
  value,
  onChange,
  onBlur,
  id,
  invalid,
  disabled,
}: {
  config: ExtraFieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur?: () => void;
  id?: string;
  invalid?: boolean;
  disabled?: boolean;
}) {
  if (config.type === "string") {
    return (
      <Input
        id={id}
        value={typeof value === "string" ? value : ""}
        disabled={disabled}
        invalid={invalid}
        placeholder={config.pattern ? "7 dígitos" : undefined}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
      />
    );
  }

  const min = config.min ?? 0;
  const max = config.max ?? 99;
  const range = max - min + 1;
  const numericValue = typeof value === "number" ? value : undefined;

  if (range <= SEGMENTED_MAX_RANGE) {
    return (
      <div id={id} role="group" aria-label={config.label} aria-invalid={invalid || undefined} className="flex flex-wrap gap-1.5">
        {Array.from({ length: range }, (_, index) => min + index).map((n) => (
          <button
            key={n}
            type="button"
            disabled={disabled}
            aria-pressed={numericValue === n}
            aria-label={`${config.label} ${formatLotteryNumber(n)}`}
            onClick={() => onChange(n)}
            onBlur={onBlur}
            className={cn(
              "flex size-9 items-center justify-center rounded-md border text-sm font-semibold tabular-nums transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-1",
              numericValue === n
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
              disabled && "cursor-not-allowed opacity-40",
              invalid && "border-red-400",
            )}
          >
            {formatLotteryNumber(n)}
          </button>
        ))}
      </div>
    );
  }

  return (
    <NumberGrid
      min={min}
      max={max}
      mode="single"
      value={numericValue !== undefined ? [numericValue] : []}
      onChange={(numbers) => onChange(numbers[0])}
      disabled={disabled}
      invalid={invalid}
      aria-label={config.label}
    />
  );
}
