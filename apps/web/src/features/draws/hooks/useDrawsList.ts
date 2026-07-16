import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listDraws } from "@/lib/api/draws.api";
import { queryKeys } from "@/lib/query/keys";
import type { ListDrawsQuery } from "@/types/draw";

export function useDrawsList(query: ListDrawsQuery, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.draws.list(query),
    queryFn: ({ signal }) => listDraws(query, signal),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}
