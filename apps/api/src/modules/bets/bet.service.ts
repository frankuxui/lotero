import { requireGameConfig } from "../../config/game-config.js";
import { HttpError } from "../../utils/http-error.js";
import type { PageMeta } from "../../utils/response.js";
import type { BetRepository } from "./bet.repository.js";
import { parseCreateBet, parseUpdateBet } from "./bet.schemas.js";
import type { Bet, ListBetsQuery } from "./bet.types.js";

export class BetService {
  constructor(private readonly repository: BetRepository) {}

  async create(input: unknown): Promise<Bet> {
    const parsed = parseCreateBet(input);
    return this.repository.create(parsed);
  }

  async list(query: ListBetsQuery): Promise<{ data: Bet[]; meta: PageMeta }> {
    if (query.game) {
      requireGameConfig(query.game);
    }
    const [data, total] = await Promise.all([this.repository.list(query), this.repository.count(query)]);
    return { data, meta: { total, limit: query.limit ?? 50, offset: query.offset ?? 0 } };
  }

  async getById(id: string): Promise<Bet> {
    const bet = await this.repository.findById(id);
    if (!bet) {
      throw HttpError.notFound(`Apuesta no encontrada: ${id}`);
    }
    return bet;
  }

  async update(id: string, input: unknown): Promise<Bet> {
    const existing = await this.getById(id);
    const parsed = parseUpdateBet(input, existing.game);
    const updated = await this.repository.update(id, parsed);
    if (!updated) {
      throw HttpError.notFound(`Apuesta no encontrada: ${id}`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const removed = await this.repository.remove(id);
    if (!removed) {
      throw HttpError.notFound(`Apuesta no encontrada: ${id}`);
    }
  }
}
