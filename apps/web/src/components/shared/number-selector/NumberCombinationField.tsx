import { Shuffle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CombinationInput } from "@/components/shared/number-selector/CombinationInput";
import { NumberGrid } from "@/components/shared/number-selector/NumberGrid";
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
}: {
  config: GameConfig;
  value: number[];
  onChange: (numbers: number[]) => void;
  onBlur?: () => void;
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <CombinationInput
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          invalid={invalid}
          disabled={disabled}
          className="sm:flex-1"
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onChange(randomValidCombination(config))}
          >
            <Shuffle aria-hidden="true" />
            Aleatorio
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || value.length === 0}
            onClick={() => onChange([])}
          >
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
