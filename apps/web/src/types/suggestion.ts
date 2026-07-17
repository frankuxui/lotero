export interface SignalBreakdown {
  proximity: number;
  calendarMatch: number;
  frequency: number;
  total: number;
}

export type SuggestionOutcome =
  | { status: "pending" }
  | { status: "resolved"; drawId: string; matches: number; totalNumbers: number };

export interface Suggestion {
  id: string;
  game: string;
  suggestionDate: string;
  numbers: number[];
  extras: Record<string, unknown>;
  algorithmVersion: string;
  signals: Record<string, SignalBreakdown>;
  createdAt: string;
  updatedAt: string;
}

export interface SuggestionWithOutcome extends Suggestion {
  outcome: SuggestionOutcome;
}

export interface ListSuggestionsQuery {
  game?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}
