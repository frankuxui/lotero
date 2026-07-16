import { Select } from "@/components/ui/select";

export interface SortOption {
  value: string;
  label: string;
}

export function SortSelector({
  value,
  onChange,
  options,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SortOption[];
  id?: string;
}) {
  return (
    <Select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}
