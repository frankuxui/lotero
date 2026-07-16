import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/lib/api/dashboard.api";
import { queryKeys } from "@/lib/query/keys";

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.all,
    queryFn: ({ signal }) => getDashboard(signal),
  });
}
