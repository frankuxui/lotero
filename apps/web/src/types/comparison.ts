export type ComparisonSource = "draws" | "bets";

export interface ComparisonRequest {
  game: string;
  numbers: number[];
  extras?: Record<string, unknown>;
  source?: ComparisonSource;
  dateFrom?: string;
  dateTo?: string;
  minMatches?: number;
}

export type ComparisonRecordType = "draw" | "bet-line";

export interface ComparisonResult {
  recordId: string;
  recordType: ComparisonRecordType;
  betId?: string;
  game: string;
  date: string;
  numbers: number[];
  extras: Record<string, unknown>;
  matches: number[];
  nonMatches: number[];
  totalMatches: number;
  percentage: number;
  sumDifference: number;
  ranking: number;
}

export interface ComparisonResponse {
  results: ComparisonResult[];
  meta: {
    total: number;
    game: string;
    numbers: number[];
    source: ComparisonSource;
  };
}
