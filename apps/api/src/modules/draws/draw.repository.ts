import { eq, and, desc, count as countRows, gte, lte } from "drizzle-orm";
import type { Database } from "../../db/client.js";
import { draws } from "../../db/schema.js";
import { createId } from "../../utils/id.js";
import type { CreateDrawInput, Draw, ListDrawsQuery, UpdateDrawInput } from "./draw.types.js";

function toDraw(row: typeof draws.$inferSelect): Draw {
  return {
    id: row.id,
    game: row.game,
    drawDate: row.drawDate,
    numbers: row.numbers,
    extras: row.extras,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export interface ListAllDrawsQuery {
  game?: string;
  dateFrom?: string;
  dateTo?: string;
}

function buildConditions(query: ListAllDrawsQuery) {
  const conditions = [];
  if (query.game) conditions.push(eq(draws.game, query.game));
  if (query.dateFrom) conditions.push(gte(draws.drawDate, query.dateFrom));
  if (query.dateTo) conditions.push(lte(draws.drawDate, query.dateTo));
  return conditions;
}

export class DrawRepository {
  constructor(private readonly db: Database) {}

  async create(input: CreateDrawInput): Promise<Draw> {
    const now = new Date().toISOString();
    const row = {
      id: createId(),
      game: input.game,
      drawDate: input.drawDate,
      numbers: input.numbers,
      extras: input.extras,
      createdAt: now,
      updatedAt: now,
    };

    await this.db.insert(draws).values(row);
    return toDraw(row);
  }

  async findById(id: string): Promise<Draw | undefined> {
    const [row] = await this.db.select().from(draws).where(eq(draws.id, id)).limit(1);
    return row ? toDraw(row) : undefined;
  }

  async list(query: ListDrawsQuery): Promise<Draw[]> {
    const conditions = buildConditions(query);

    const rows = await this.db
      .select()
      .from(draws)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(draws.drawDate))
      .limit(query.limit ?? 50)
      .offset(query.offset ?? 0);

    return rows.map(toDraw);
  }

  async count(query: ListDrawsQuery): Promise<number> {
    const conditions = buildConditions(query);
    const [row] = await this.db
      .select({ value: countRows() })
      .from(draws)
      .where(conditions.length ? and(...conditions) : undefined);
    return row?.value ?? 0;
  }

  /** Sin límite/offset: uso interno para análisis (statistics, comparison, numbers, dashboard). */
  async listAllMatching(query: ListAllDrawsQuery = {}): Promise<Draw[]> {
    const conditions = buildConditions(query);
    const rows = await this.db
      .select()
      .from(draws)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(draws.drawDate));
    return rows.map(toDraw);
  }

  async update(id: string, input: UpdateDrawInput): Promise<Draw | undefined> {
    const existing = await this.findById(id);
    if (!existing) return undefined;

    const updated = {
      game: input.game ?? existing.game,
      drawDate: input.drawDate ?? existing.drawDate,
      numbers: input.numbers ?? existing.numbers,
      extras: input.extras ?? existing.extras,
      updatedAt: new Date().toISOString(),
    };

    await this.db.update(draws).set(updated).where(eq(draws.id, id));
    return { ...existing, ...updated };
  }

  async remove(id: string): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) return false;

    await this.db.delete(draws).where(eq(draws.id, id));
    return true;
  }
}
