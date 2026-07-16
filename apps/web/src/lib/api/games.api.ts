import { apiClient } from "@/lib/api/client";
import type { GameConfig } from "@/types/game";

export function listGames(signal?: AbortSignal): Promise<GameConfig[]> {
  return apiClient.get<GameConfig[]>("/games", { signal });
}

export function getGame(id: string, signal?: AbortSignal): Promise<GameConfig> {
  return apiClient.get<GameConfig>(`/games/${encodeURIComponent(id)}`, { signal });
}
