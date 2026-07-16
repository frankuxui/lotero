import { useQuery } from "@tanstack/react-query";
import { getDraw } from "@/lib/api/draws.api";
import { queryKeys } from "@/lib/query/keys";

export function useDraw(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.draws.detail(id ?? ""),
    queryFn: ({ signal }) => getDraw(id ?? "", signal),
    enabled: Boolean(id),
  });
}
