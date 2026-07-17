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
      <div className="flex flex-col gap-6 sm:gap-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full flex-1 **:data-input-group:w-full **:*:data-input-group:grid **:data-input-group:grid-cols-6 **:data-input-group:gap-2 **:data-input-group:**:data-input-slot:w-full **:data-input-group:**:data-input-slot:h-14">
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
        </div>
        <div className="flex gap-2">
          {allowRandom && (
            <Button type="button" variant="inverse" size="sm" className="gap-3" disabled={disabled} onClick={() => onChange(randomValidCombination(config))}>
              <Shuffle aria-hidden="true" />
              Aleatorio
            </Button>
          )}
          <Button type="button" variant="inverse" size="sm" className="gap-3" disabled={disabled || value.length === 0} onClick={() => onChange([])}>
            <X aria-hidden="true" />
            Limpiar
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <SelectedNumbers value={value} count={config.numbers.count} />
      </div>
      <div className="mt-4">
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
    </div>
  );
}
