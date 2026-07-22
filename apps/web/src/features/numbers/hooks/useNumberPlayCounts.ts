import { useQueries } from "@tanstack/react-query";
import { getNumberDetail } from "@/lib/api/numbers.api";
import { queryKeys } from "@/lib/query/keys";

/** Reutiliza GET /api/numbers/:number (mismo endpoint que /numbers/:number) para no duplicar el conteo de apariciones. */
export function useNumberPlayCounts(numbers: number[], game: string | undefined): Map<number, number> {
  const uniqueNumbers = Array.from(new Set(numbers));

  const results = useQueries({
    queries: uniqueNumbers.map((number) => ({
      queryKey: queryKeys.numbers.detail(number, game),
      queryFn: ({ signal }: { signal?: AbortSignal }) => getNumberDetail(number, game, signal),
      enabled: Boolean(game),
    })),
  });

  const counts = new Map<number, number>();
  uniqueNumbers.forEach((number, index) => {
    const data = results[index]?.data;
    if (data) counts.set(number, data.appearances.bets);
  });
  return counts;
}
