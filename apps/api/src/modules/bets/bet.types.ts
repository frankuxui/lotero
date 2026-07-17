export interface BetLine {
  id: string;
  numbers: number[];
  extras: Record<string, unknown>;
}

export interface Bet {
  id: string;
  game: string;
  label?: string | null;
  lines: BetLine[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBetLineInput {
  numbers: number[];
  extras: Record<string, unknown>;
}

export interface CreateBetInput {
  game: string;
  label?: string;
  /** Fecha de creación elegida por el usuario (AAAA-MM-DD); si se omite, se usa el momento actual. */
  createdAt?: string;
  lines: CreateBetLineInput[];
}

export type UpdateBetInput = Partial<CreateBetInput>;

export interface ListBetsQuery {
  game?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}
