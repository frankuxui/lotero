import { requireGameConfig } from "../../config/game-config.js";
import { HttpError } from "../../utils/http-error.js";
import type { PageMeta } from "../../utils/response.js";
import type { DrawRepository } from "./draw.repository.js";
import { parseCreateDraw, parseUpdateDraw } from "./draw.schemas.js";
import type { Draw, ListDrawsQuery } from "./draw.types.js";

export class DrawService {
  /**
   * onDrawChanged es opcional a propósito: mantiene DrawService desacoplado del módulo de
   * sugerencias (sin import circular ni acceso directo a otro repositorio) y testeable sin
   * esa dependencia. Quien construye el servicio (draw.routes.ts) decide qué reacciona a un
   * sorteo nuevo/editado. El fallo de ese callback nunca debe impedir guardar el sorteo.
   */
  constructor(
    private readonly repository: DrawRepository,
    private readonly onDrawChanged?: (game: string) => void,
  ) {}

  private notifyDrawChanged(game: string): void {
    try {
      this.onDrawChanged?.(game);
    } catch {
      // Intencional: un fallo al disparar la regeneración de la sugerencia no debe
      // afectar la respuesta de creación/edición del sorteo.
    }
  }

  async create(input: unknown): Promise<Draw> {
    const parsed = parseCreateDraw(input);
    const draw = await this.repository.create(parsed);
    this.notifyDrawChanged(draw.game);
    return draw;
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
    this.notifyDrawChanged(updated.game);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const removed = await this.repository.remove(id);
    if (!removed) {
      throw HttpError.notFound(`Sorteo no encontrado: ${id}`);
    }
  }
}
