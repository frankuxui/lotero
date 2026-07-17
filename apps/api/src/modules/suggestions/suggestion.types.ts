export interface SignalBreakdown {
  proximity: number;
  calendarMatch: number;
  frequency: number;
  total: number;
}

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

/** Sugerencia enriquecida con el resultado real de esa fecha, calculado al leer (no persistido). */
export interface SuggestionWithOutcome extends Suggestion {
  outcome: SuggestionOutcome;
}

export type SuggestionOutcome =
  | { status: "pending" }
  | { status: "resolved"; drawId: string; matches: number; totalNumbers: number };

export interface ListSuggestionsQuery {
  game?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface CreateSuggestionInput {
  game: string;
  suggestionDate: string;
  numbers: number[];
  extras: Record<string, unknown>;
  algorithmVersion: string;
  signals: Record<string, SignalBreakdown>;
}
