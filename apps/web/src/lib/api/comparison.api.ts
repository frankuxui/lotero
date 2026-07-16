import { apiClient } from "@/lib/api/client";
import type { ComparisonRequest, ComparisonResponse } from "@/types/comparison";

export function compare(input: ComparisonRequest, signal?: AbortSignal): Promise<ComparisonResponse> {
  return apiClient.post<ComparisonResponse>("/comparison", input, { signal });
}
