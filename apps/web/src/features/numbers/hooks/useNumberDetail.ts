import { useQuery } from "@tanstack/react-query";
import { getNumberDetail } from "@/lib/api/numbers.api";
import { queryKeys } from "@/lib/query/keys";

export function useNumberDetail(number: number | undefined, game: string | undefined) {
  const isValid = number !== undefined && Number.isInteger(number) && number > 0;

  return useQuery({
    queryKey: queryKeys.numbers.detail(number ?? -1, game),
    queryFn: ({ signal }) => getNumberDetail(number as number, game, signal),
    enabled: isValid,
  });
}
