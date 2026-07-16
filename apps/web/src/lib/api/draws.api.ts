import { apiClient } from "@/lib/api/client";
import type { QueryParamValue } from "@/lib/api/client";
import type { CreateDrawInput, Draw, ListDrawsQuery, UpdateDrawInput } from "@/types/draw";
import type { Paginated } from "@/types/api";

export function listDraws(query: ListDrawsQuery, signal?: AbortSignal): Promise<Paginated<Draw>> {
  return apiClient.getPaged<Draw>("/draws", { params: query as Record<string, QueryParamValue>, signal });
}

export function getDraw(id: string, signal?: AbortSignal): Promise<Draw> {
  return apiClient.get<Draw>(`/draws/${encodeURIComponent(id)}`, { signal });
}

export function createDraw(input: CreateDrawInput): Promise<Draw> {
  return apiClient.post<Draw>("/draws", input);
}

export function updateDraw(id: string, input: UpdateDrawInput): Promise<Draw> {
  return apiClient.patch<Draw>(`/draws/${encodeURIComponent(id)}`, input);
}

export function deleteDraw(id: string): Promise<void> {
  return apiClient.delete<void>(`/draws/${encodeURIComponent(id)}`);
}
