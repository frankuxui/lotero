import type { Bet } from "./bet";
import type { ComparisonResult } from "./comparison";
import type { Draw } from "./draw";
import type { NumberFrequency } from "./statistics";

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

export interface DashboardGameMostPlayed {
  game: string;
  numbers: NumberFrequency[];
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
  mostPlayedByGame: DashboardGameMostPlayed[];
}
