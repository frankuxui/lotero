import { apiClient } from "@/lib/api/client";
import type { QueryParamValue } from "@/lib/api/client";
import type { Bet, CreateBetInput, ListBetsQuery, UpdateBetInput } from "@/types/bet";
import type { Paginated } from "@/types/api";

export function listBets(query: ListBetsQuery, signal?: AbortSignal): Promise<Paginated<Bet>> {
  return apiClient.getPaged<Bet>("/bets", { params: query as Record<string, QueryParamValue>, signal });
}

export function getBet(id: string, signal?: AbortSignal): Promise<Bet> {
  return apiClient.get<Bet>(`/bets/${encodeURIComponent(id)}`, { signal });
}

export function createBet(input: CreateBetInput): Promise<Bet> {
  return apiClient.post<Bet>("/bets", input);
}

export function updateBet(id: string, input: UpdateBetInput): Promise<Bet> {
  return apiClient.patch<Bet>(`/bets/${encodeURIComponent(id)}`, input);
}

export function deleteBet(id: string): Promise<void> {
  return apiClient.delete<void>(`/bets/${encodeURIComponent(id)}`);
}
