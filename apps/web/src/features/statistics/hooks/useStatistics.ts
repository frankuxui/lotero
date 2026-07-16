import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "@/lib/api/statistics.api";
import { queryKeys } from "@/lib/query/keys";
import type { StatisticsQuery } from "@/types/statistics";

export function useStatistics(query: StatisticsQuery, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.statistics.detail(query),
    queryFn: ({ signal }) => getStatistics(query, signal),
    enabled: options.enabled ?? true,
  });
}
