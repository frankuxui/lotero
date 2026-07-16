import type { Draw } from "./draw";

export interface NumberGameAppearances {
  game: string;
  draws: number;
  bets: number;
}

export interface NumberDistributionByGame {
  game: string;
  count: number;
  percentage: number;
}

export interface RelatedBetLine {
  betId: string;
  betLabel: string | null;
  lineId: string;
  numbers: number[];
  extras: Record<string, unknown>;
  createdAt: string;
}

export interface NumberDetailResponse {
  number: number;
  resolvedGame: string;
  appearances: {
    draws: number;
    bets: number;
  };
  byGame: NumberGameAppearances[];
  frequency: number;
  lastAppearance: { drawId: string; game: string; drawDate: string } | null;
  delay: number;
  ranking: number;
  distributionByGame: NumberDistributionByGame[];
  relatedDraws: Draw[];
  relatedBets: RelatedBetLine[];
}
