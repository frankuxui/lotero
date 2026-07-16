export interface Draw {
  id: string;
  game: string;
  drawDate: string;
  numbers: number[];
  extras: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDrawInput {
  game: string;
  drawDate: string;
  numbers: number[];
  extras: Record<string, unknown>;
}

export type UpdateDrawInput = Partial<CreateDrawInput>;

export interface ListDrawsQuery {
  game?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}
