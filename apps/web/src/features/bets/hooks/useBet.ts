import { useQuery } from "@tanstack/react-query";
import { getBet } from "@/lib/api/bets.api";
import { queryKeys } from "@/lib/query/keys";

export function useBet(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.bets.detail(id ?? ""),
    queryFn: ({ signal }) => getBet(id ?? "", signal),
    enabled: Boolean(id),
  });
}
