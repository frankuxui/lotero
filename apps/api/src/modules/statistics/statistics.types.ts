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
}
