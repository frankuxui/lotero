import { Select } from "@/components/ui/select";
import type { GameConfig } from "@/types/game";

export function GameSelector({
  games,
  value,
  onChange,
  onBlur,
  allowAll,
  allowAllLabel = "Todos los juegos",
  disabled,
  invalid,
  id,
  name,
  className,
}: {
  games: GameConfig[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  allowAll?: boolean;
  allowAllLabel?: string;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  name?: string;
  className?: string;
}) {
  return (
    <Select
      id={id}
      name={name}
      value={value}
      disabled={disabled}
      invalid={invalid}
      className={className}
      onBlur={onBlur}
      onChange={(event) => onChange(event.target.value)}
    >
      {allowAll && <option value="">{allowAllLabel}</option>}
      {games.map((game) => (
        <option key={game.id} value={game.id}>
          {game.label}
        </option>
      ))}
    </Select>
  );
}
