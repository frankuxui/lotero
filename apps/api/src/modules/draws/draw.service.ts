import { requireGameConfig } from "../../config/game-config.js";
import { HttpError } from "../../utils/http-error.js";
import type { PageMeta } from "../../utils/response.js";
import type { DrawRepository } from "./draw.repository.js";
import { parseCreateDraw, parseUpdateDraw } from "./draw.schemas.js";
import type { Draw, ListDrawsQuery } from "./draw.types.js";

export class DrawService {
  constructor(private readonly repository: DrawRepository) {}

  async create(input: unknown): Promise<Draw> {
    const parsed = parseCreateDraw(input);
    return this.repository.create(parsed);
  }

  async list(query: ListDrawsQuery): Promise<{ data: Draw[]; meta: PageMeta }> {
    if (query.game) {
      requireGameConfig(query.game);
    }
    const [data, total] = await Promise.all([this.repository.list(query), this.repository.count(query)]);
    return { data, meta: { total, limit: query.limit ?? 50, offset: query.offset ?? 0 } };
  }

  async getById(id: string): Promise<Draw> {
    const draw = await this.repository.findById(id);
    if (!draw) {
      throw HttpError.notFound(`Sorteo no encontrado: ${id}`);
    }
    return draw;
  }

  async update(id: string, input: unknown): Promise<Draw> {
    const existing = await this.getById(id);
    const parsed = parseUpdateDraw(input, existing.game);
    const updated = await this.repository.update(id, parsed);
    if (!updated) {
      throw HttpError.notFound(`Sorteo no encontrado: ${id}`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const removed = await this.repository.remove(id);
    if (!removed) {
      throw HttpError.notFound(`Sorteo no encontrado: ${id}`);
    }
  }
}
