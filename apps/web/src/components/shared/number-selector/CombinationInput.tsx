import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { formatCombination, parseCombinationText } from "@/lib/formatters/number";

export function CombinationInput({
  value,
  onChange,
  onBlur,
  id,
  invalid,
  disabled,
  className,
  placeholder = "2, 18, 23, 44, 45, 49",
}: {
  value: number[];
  onChange: (numbers: number[]) => void;
  onBlur?: () => void;
  id?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}) {
  const [text, setText] = useState(() => formatCombination(value));
  const isFocused = useRef(false);

  useEffect(() => {
    if (!isFocused.current) {
      setText(formatCombination(value));
    }
  }, [value]);

  return (
    <Input
      id={id}
      value={text}
      disabled={disabled}
      invalid={invalid}
      placeholder={placeholder}
      inputMode="numeric"
      autoComplete="off"
      className={className}
      onFocus={() => {
        isFocused.current = true;
      }}
      onChange={(event) => {
        const raw = event.target.value;
        setText(raw);
        onChange(parseCombinationText(raw));
      }}
      onBlur={() => {
        isFocused.current = false;
        setText(formatCombination(value));
        onBlur?.();
      }}
    />
  );
}
