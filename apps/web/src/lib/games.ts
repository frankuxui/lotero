import type { GameConfig } from "@/types/game";

export function findGameConfig(games: GameConfig[], id: string): GameConfig | undefined {
  return games.find((game) => game.id === id);
}

export function gameLabel(games: GameConfig[], id: string): string {
  return findGameConfig(games, id)?.label ?? id;
}
