import { Shuffle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NumberGrid } from "@/components/shared/number-selector/NumberGrid";
import { NumberSlotsInput } from "@/components/shared/number-selector/NumberSlotsInput";
import { SelectedNumbers } from "@/components/shared/number-selector/SelectedNumbers";
import { randomValidCombination } from "@/lib/validation/game-rules";
import type { GameConfig } from "@/types/game";

export function NumberCombinationField({
  config,
  value,
  onChange,
  onBlur,
  invalid,
  disabled,
  id,
  allowRandom = true
}: {
  config: GameConfig;
  value: number[];
  onChange: (numbers: number[]) => void;
  onBlur?: () => void;
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  /** Desactívalo cuando los números son un resultado real que se introduce a mano (sorteos), no una predicción. */
  allowRandom?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <NumberSlotsInput
          id={id}
          count={config.numbers.count}
          min={config.numbers.min}
          max={config.numbers.max}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          invalid={invalid}
          disabled={disabled}
        />
        <div className="flex gap-2">
          {allowRandom && (
            <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={() => onChange(randomValidCombination(config))}>
              <Shuffle aria-hidden="true" />
              Aleatorio
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" disabled={disabled || value.length === 0} onClick={() => onChange([])}>
            <X aria-hidden="true" />
            Limpiar
          </Button>
        </div>
      </div>
      <SelectedNumbers value={value} count={config.numbers.count} />
      <NumberGrid
        min={config.numbers.min}
        max={config.numbers.max}
        count={config.numbers.count}
        value={value}
        onChange={onChange}
        disabled={disabled}
        invalid={invalid}
        aria-label={`Selector de números para ${config.label}`}
      />
    </div>
  );
}
