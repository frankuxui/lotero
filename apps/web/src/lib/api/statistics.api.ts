import { apiClient } from "@/lib/api/client";
import type { QueryParamValue } from "@/lib/api/client";
import type { StatisticsQuery, StatisticsResponse } from "@/types/statistics";

export function getStatistics(query: StatisticsQuery, signal?: AbortSignal): Promise<StatisticsResponse> {
  return apiClient.get<StatisticsResponse>("/statistics", {
    params: query as unknown as Record<string, QueryParamValue>,
    signal,
  });
}
