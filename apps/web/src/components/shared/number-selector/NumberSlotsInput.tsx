import { useEffect, useRef, useState, type ClipboardEvent, type FocusEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { formatLotteryNumber, parseCombinationText } from "@/lib/formatters/number";

/** Distribuye texto pegado (con separadores, o dígitos corridos) en bloques de 2 dígitos. */
function splitPastedText(text: string): number[] {
  const bySeparator = parseCombinationText(text).filter((n) => !Number.isNaN(n));
  if (bySeparator.length > 1) return bySeparator;

  const digitsOnly = text.replace(/\D/g, "");
  if (digitsOnly.length >= 2) {
    const chunks: number[] = [];
    for (let i = 0; i < digitsOnly.length; i += 2) {
      chunks.push(Number(digitsOnly.slice(i, i + 2)));
    }
    return chunks;
  }
  return bySeparator;
}

function slotsFromValue(value: number[], count: number): string[] {
  return Array.from({ length: count }, (_, i) => (value[i] !== undefined ? formatLotteryNumber(value[i]) : ""));
}

function sameNumbers(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((n, i) => n === b[i]);
}

/**
 * Casillas rellenadas de izquierda a derecha: cada número debe estar dentro del rango
 * del juego y ser mayor que el anterior. Se devuelve la primera casilla que incumple.
 */
function findSlotError(slots: string[], min: number, max: number): { index: number; message: string } | null {
  let previous: { index: number; value: number } | null = null;
  for (let index = 0; index < slots.length; index += 1) {
    const raw = slots[index];
    if (!raw || raw.length < 2) continue;
    const current = Number(raw);

    if (current < min || current > max) {
      return {
        index,
        message: `${formatLotteryNumber(current)} debe estar entre ${formatLotteryNumber(min)} y ${formatLotteryNumber(max)}`
      };
    }
    if (previous && current <= previous.value) {
      return {
        index,
        message: `${formatLotteryNumber(current)} debe ser mayor que ${formatLotteryNumber(previous.value)} (casilla ${previous.index + 1})`
      };
    }
    previous = { index, value: current };
  }
  return null;
}

export function NumberSlotsInput({
  count,
  min,
  max,
  value,
  onChange,
  onBlur,
  id,
  invalid,
  disabled
}: {
  count: number;
  min: number;
  max: number;
  value: number[];
  onChange: (numbers: number[]) => void;
  onBlur?: () => void;
  id?: string;
  invalid?: boolean;
  disabled?: boolean;
}) {
  const [slots, setSlots] = useState<string[]>(() => slotsFromValue(value, count));
  // Última combinación que este propio componente emitió — permite distinguir un
  // cambio "externo" (grid, aleatorio, limpiar) de un simple eco de nuestro propio onChange,
  // sin depender de la temporización de eventos focus/blur (poco fiable con auto-avance).
  const lastEmittedRef = useRef<number[]>(value);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (sameNumbers(value, lastEmittedRef.current)) return;
    lastEmittedRef.current = value;
    setSlots(slotsFromValue(value, count));
  }, [value, count]);

  const emit = (nextSlots: string[]) => {
    // Nunca más de `count` números, pase lo que pase (nextSlots ya tiene longitud `count`,
    // pero se recorta explícitamente como garantía adicional).
    const numbers = nextSlots
      .slice(0, count)
      .filter((slot) => slot !== "")
      .map((slot) => Number(slot));
    lastEmittedRef.current = numbers;
    onChange(numbers);
  };

  const slotError = findSlotError(slots, min, max);

  const focusSlot = (index: number) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const handleChange = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    const next = [...slots];
    next[index] = digits;
    setSlots(next);
    emit(next);
    if (digits.length === 2 && index < count - 1) {
      focusSlot(index + 1);
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && slots[index] === "" && index > 0) {
      event.preventDefault();
      focusSlot(index - 1);
    } else if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusSlot(index - 1);
    } else if (event.key === "ArrowRight" && index < count - 1) {
      event.preventDefault();
      focusSlot(index + 1);
    }
  };

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = splitPastedText(event.clipboardData.getData("text"));
    if (pasted.length === 0) return;
    event.preventDefault();

    const next = [...slots];
    pasted.slice(0, count - index).forEach((n, offset) => {
      next[index + offset] = Number.isInteger(n) ? String(n).slice(0, 2) : "";
    });
    setSlots(next);
    emit(next);

    const lastFilled = Math.min(index + pasted.length, count) - 1;
    focusSlot(Math.min(lastFilled + 1, count - 1));
  };

  const handleGroupBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    // Rellena con cero a la izquierda cualquier casilla con un solo dígito (p. ej. "7" -> "07").
    const padded = slots.map((slot) => (slot.length === 1 ? slot.padStart(2, "0") : slot));
    if (padded.some((slot, i) => slot !== slots[i])) {
      setSlots(padded);
      emit(padded);
    }
    onBlur?.();
  };

  return (
    <div className="flex-1 w-full">
      <div role="group" aria-invalid={invalid || Boolean(slotError) || undefined} className="flex flex-wrap gap-2" data-input-group onBlur={handleGroupBlur}>
        {Array.from({ length: count }, (_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            id={index === 0 ? id : undefined}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={2}
            disabled={disabled}
            aria-label={`Número ${index + 1} de ${count}`}
            value={slots[index] ?? ""}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            onFocus={(event) => event.target.select()}
            data-input-slot
            className={cn(
              "h-12 w-12 rounded-md border border-slate-300 bg-white text-center text-lg font-semibold tabular-nums text-slate-900 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:border-indigo-600",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
              (invalid || slotError?.index === index) && "border-red-500 focus-visible:ring-red-600"
            )}
          />
        ))}
      </div>
      {slotError && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{slotError.message}</p>}
    </div>
  );
}
