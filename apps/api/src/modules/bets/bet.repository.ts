import { and, eq, desc, count as countRows, gte, lte } from "drizzle-orm";
import type { Database } from "../../db/client.js";
import { betLines, bets } from "../../db/schema.js";
import { createId } from "../../utils/id.js";
import type { Bet, CreateBetInput, ListBetsQuery, UpdateBetInput } from "./bet.types.js";

interface DateRangeQuery {
  game?: string;
  dateFrom?: string;
  dateTo?: string;
}

/** bets.createdAt es un timestamp ISO completo; dateTo se trata como fin de ese día (inclusive). */
function buildConditions(query: DateRangeQuery) {
  const conditions = [];
  if (query.game) conditions.push(eq(bets.game, query.game));
  if (query.dateFrom) conditions.push(gte(bets.createdAt, query.dateFrom));
  if (query.dateTo) conditions.push(lte(bets.createdAt, `${query.dateTo}T23:59:59.999Z`));
  return conditions;
}

export class BetRepository {
  constructor(private readonly db: Database) {}

  async create(input: CreateBetInput): Promise<Bet> {
    const now = new Date().toISOString();
    const betId = createId();

    return this.db.transaction(async (tx) => {
      await tx.insert(bets).values({
        id: betId,
        game: input.game,
        label: input.label ?? null,
        createdAt: now,
        updatedAt: now,
      });

      const lineRows = input.lines.map((line) => ({
        id: createId(),
        betId,
        numbers: line.numbers,
        extras: line.extras,
        createdAt: now,
      }));

      await tx.insert(betLines).values(lineRows);

      return {
        id: betId,
        game: input.game,
        label: input.label ?? null,
        lines: lineRows.map((line) => ({ id: line.id, numbers: line.numbers, extras: line.extras })),
        createdAt: now,
        updatedAt: now,
      };
    });
  }

  async findById(id: string): Promise<Bet | undefined> {
    const [betRow] = await this.db.select().from(bets).where(eq(bets.id, id)).limit(1);
    if (!betRow) return undefined;

    const lineRows = await this.db.select().from(betLines).where(eq(betLines.betId, id));

    return {
      id: betRow.id,
      game: betRow.game,
      label: betRow.label,
      lines: lineRows.map((line) => ({ id: line.id, numbers: line.numbers, extras: line.extras })),
      createdAt: betRow.createdAt,
      updatedAt: betRow.updatedAt,
    };
  }

  async list(query: ListBetsQuery): Promise<Bet[]> {
    const conditions = buildConditions(query);

    const betRows = await this.db
      .select()
      .from(bets)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(bets.createdAt))
      .limit(query.limit ?? 50)
      .offset(query.offset ?? 0);

    const results: Bet[] = [];
    for (const betRow of betRows) {
      const lineRows = await this.db.select().from(betLines).where(eq(betLines.betId, betRow.id));
      results.push({
        id: betRow.id,
        game: betRow.game,
        label: betRow.label,
        lines: lineRows.map((line) => ({ id: line.id, numbers: line.numbers, extras: line.extras })),
        createdAt: betRow.createdAt,
        updatedAt: betRow.updatedAt,
      });
    }
    return results;
  }

  async count(query: ListBetsQuery): Promise<number> {
    const conditions = buildConditions(query);
    const [row] = await this.db
      .select({ value: countRows() })
      .from(bets)
      .where(conditions.length ? and(...conditions) : undefined);
    return row?.value ?? 0;
  }

  /** Sin límite/offset: uso interno para análisis (comparison, numbers, dashboard). */
  async listAllMatching(query: { game?: string } = {}): Promise<Bet[]> {
    const conditions = query.game ? [eq(bets.game, query.game)] : [];

    const betRows = await this.db
      .select()
      .from(bets)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(bets.createdAt));

    const results: Bet[] = [];
    for (const betRow of betRows) {
      const lineRows = await this.db.select().from(betLines).where(eq(betLines.betId, betRow.id));
      results.push({
        id: betRow.id,
        game: betRow.game,
        label: betRow.label,
        lines: lineRows.map((line) => ({ id: line.id, numbers: line.numbers, extras: line.extras })),
        createdAt: betRow.createdAt,
        updatedAt: betRow.updatedAt,
      });
    }
    return results;
  }

  async update(id: string, input: UpdateBetInput): Promise<Bet | undefined> {
    const existing = await this.findById(id);
    if (!existing) return undefined;

    const now = new Date().toISOString();

    return this.db.transaction(async (tx) => {
      await tx
        .update(bets)
        .set({
          game: input.game ?? existing.game,
          label: input.label ?? existing.label,
          updatedAt: now,
        })
        .where(eq(bets.id, id));

      if (input.lines) {
        await tx.delete(betLines).where(eq(betLines.betId, id));
        const lineRows = input.lines.map((line) => ({
          id: createId(),
          betId: id,
          numbers: line.numbers,
          extras: line.extras,
          createdAt: now,
        }));
        await tx.insert(betLines).values(lineRows);
      }

      const [betRow] = await tx.select().from(bets).where(eq(bets.id, id)).limit(1);
      if (!betRow) {
        throw new Error(`No se pudo leer la apuesta actualizada: ${id}`);
      }
      const lineRows = await tx.select().from(betLines).where(eq(betLines.betId, id));

      return {
        id: betRow.id,
        game: betRow.game,
        label: betRow.label,
        lines: lineRows.map((line) => ({ id: line.id, numbers: line.numbers, extras: line.extras })),
        createdAt: betRow.createdAt,
        updatedAt: betRow.updatedAt,
      };
    });
  }

  async remove(id: string): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) return false;

    await this.db.delete(bets).where(eq(bets.id, id));
    return true;
  }
}
