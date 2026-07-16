import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listBets } from "@/lib/api/bets.api";
import { queryKeys } from "@/lib/query/keys";
import type { ListBetsQuery } from "@/types/bet";

export function useBetsList(query: ListBetsQuery, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.bets.list(query),
    queryFn: ({ signal }) => listBets(query, signal),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}
