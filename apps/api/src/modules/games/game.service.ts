import { listGameConfigs, requireGameConfig, type GameConfig } from "../../config/game-config.js";

export function listGames(): GameConfig[] {
  return listGameConfigs();
}

export function getGame(id: string): GameConfig {
  return requireGameConfig(id);
}
