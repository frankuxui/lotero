export interface StatisticsQuery {
  game: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface NumberFrequency {
  number: number;
  count: number;
  percentage: number;
}

export interface NumberDelay {
  number: number;
  delay: number;
  lastAppearance: string | null;
}

export interface DecadeBucket {
  decade: string;
  count: number;
}

export interface NumberPair {
  numbers: [number, number];
  count: number;
}

export interface NumberTrio {
  numbers: [number, number, number];
  count: number;
}

export interface ExtraValueFrequency {
  value: number | string;
  count: number;
  percentage: number;
}

export interface ExtraFrequency {
  key: string;
  label: string;
  type: "number" | "string";
  top: ExtraValueFrequency[];
}

export interface ClosestBetMatch {
  betId: string;
  betLabel: string | null;
  lineId: string;
  numbers: number[];
  playedAt: string;
  drawId: string;
  drawDate: string;
  drawNumbers: number[];
  matches: number[];
  totalMatches: number;
  percentage: number;
}

export interface StatisticsResponse {
  game: string;
  totalDraws: number;
  dateRange: { from: string | null; to: string | null };
  frequencies: NumberFrequency[];
  hot: NumberFrequency[];
  cold: NumberFrequency[];
  delays: NumberDelay[];
  oddEven: { odd: number; even: number };
  decades: DecadeBucket[];
  averageSum: number;
  topPairs: NumberPair[];
  topTrios: NumberTrio[];
  consecutive: { drawsWithConsecutive: number; percentage: number };
  extraFrequencies: ExtraFrequency[];
  closestBetMatches: ClosestBetMatch[];
}

/** Lo que calcula `computeStatistics` a partir de sorteos únicamente, sin `closestBetMatches` (requiere apuestas). */
export type DrawStatistics = Omit<StatisticsResponse, "closestBetMatches">;
