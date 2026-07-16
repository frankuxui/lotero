import { useRef, useState, type KeyboardEvent } from "react";
import { formatLotteryNumber } from "@/lib/formatters/number";
import { cn } from "@/lib/utils";

export interface NumberGridProps {
  min: number;
  max: number;
  /** Cantidad máxima seleccionable en modo "multiple". Sin límite si se omite. */
  count?: number;
  value: number[];
  onChange: (numbers: number[]) => void;
  mode?: "multiple" | "single";
  disabled?: boolean;
  invalid?: boolean;
  columns?: number;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

export function NumberGrid({
  min,
  max,
  count,
  value,
  onChange,
  mode = "multiple",
  disabled = false,
  invalid = false,
  columns = 7,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy
}: NumberGridProps) {
  const numbers = Array.from({ length: max - min + 1 }, (_, index) => min + index);
  const [focused, setFocused] = useState(value[0] ?? min);
  const containerRef = useRef<HTMLDivElement>(null);

  const atCapacity = mode === "multiple" && count !== undefined && value.length >= count;

  const toggle = (n: number) => {
    if (disabled) return;
    if (mode === "single") {
      onChange(value[0] === n ? [] : [n]);
      return;
    }
    if (value.includes(n)) {
      onChange(value.filter((v) => v !== n).sort((a, b) => a - b));
      return;
    }
    if (count !== undefined && value.length >= count) return;
    onChange([...value, n].sort((a, b) => a - b));
  };

  const focusNumber = (n: number) => {
    const clamped = Math.min(max, Math.max(min, n));
    setFocused(clamped);
    requestAnimationFrame(() => {
      containerRef.current?.querySelector<HTMLButtonElement>(`[data-number="${clamped}"]`)?.focus();
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, n: number) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        focusNumber(n + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusNumber(n - 1);
        break;
      case "ArrowDown":
        event.preventDefault();
        focusNumber(n + columns);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusNumber(n - columns);
        break;
      case "Home":
        event.preventDefault();
        focusNumber(min);
        break;
      case "End":
        event.preventDefault();
        focusNumber(max);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-invalid={invalid || undefined}
      className={cn("grid gap-1.5", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {numbers.map((n) => {
        const selected = value.includes(n);
        const isDisabled = disabled || (!selected && atCapacity);
        return (
          <button
            key={n}
            type="button"
            data-number={n}
            disabled={isDisabled}
            aria-pressed={selected}
            aria-label={`Número ${formatLotteryNumber(n)}${selected ? ", seleccionado" : ""}`}
            tabIndex={n === focused ? 0 : -1}
            onClick={() => toggle(n)}
            onFocus={() => setFocused(n)}
            onKeyDown={(event) => handleKeyDown(event, n)}
            className={cn(
              "flex aspect-square items-center justify-center rounded-md border text-sm font-semibold tabular-nums transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-1",
              selected
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
              isDisabled && "cursor-not-allowed opacity-40 hover:border-slate-300 hover:bg-white dark:hover:bg-slate-900",
              invalid && "border-red-400"
            )}
          >
            {formatLotteryNumber(n)}
          </button>
        );
      })}
    </div>
  );
}
