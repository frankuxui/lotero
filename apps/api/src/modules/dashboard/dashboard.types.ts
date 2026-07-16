import type { Bet } from "../bets/bet.types.js";
import type { ComparisonResult } from "../comparison/comparison.types.js";
import type { Draw } from "../draws/draw.types.js";
import type { NumberFrequency } from "../statistics/statistics.types.js";

export interface DashboardGameCount {
  game: string;
  draws: number;
  bets: number;
}

export interface DashboardGameNumbers {
  game: string;
  hot: NumberFrequency[];
  cold: NumberFrequency[];
}

export interface DashboardMatch extends ComparisonResult {
  betId: string;
  betLabel: string | null;
}

export interface DashboardResponse {
  quickStats: {
    totalDraws: number;
    totalBets: number;
    byGame: DashboardGameCount[];
  };
  recentDraws: Draw[];
  recentBets: Bet[];
  recentMatches: DashboardMatch[];
  numbersByGame: DashboardGameNumbers[];
}
