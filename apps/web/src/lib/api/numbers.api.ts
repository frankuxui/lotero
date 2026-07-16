import { apiClient } from "@/lib/api/client";
import type { NumberDetailResponse } from "@/types/numbers";

export function getNumberDetail(
  number: number,
  game: string | undefined,
  signal?: AbortSignal,
): Promise<NumberDetailResponse> {
  return apiClient.get<NumberDetailResponse>(`/numbers/${number}`, { params: { game }, signal });
}
