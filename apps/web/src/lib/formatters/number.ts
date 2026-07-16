export function formatLotteryNumber(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatCombination(numbers: number[]): string {
  return numbers.map(formatLotteryNumber).join(", ");
}

/** Parsea texto tipo "2, 18, 23, 44, 45, 49" a números crudos (sin validar rango/cantidad/duplicados). */
export function parseCombinationText(text: string): number[] {
  return text
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map((part) => Number(part));
}
