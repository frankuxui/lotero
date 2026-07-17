import { and, desc, eq, gte, lte, count as countRows } from "drizzle-orm";
import type { Database } from "../../db/client.js";
import { suggestions } from "../../db/schema.js";
import { createId } from "../../utils/id.js";
import type { CreateSuggestionInput, ListSuggestionsQuery, Suggestion } from "./suggestion.types.js";

function toSuggestion(row: typeof suggestions.$inferSelect): Suggestion {
  return {
    id: row.id,
    game: row.game,
    suggestionDate: row.suggestionDate,
    numbers: row.numbers,
    extras: row.extras,
    algorithmVersion: row.algorithmVersion,
    signals: row.signals as Suggestion["signals"],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function buildConditions(query: { game?: string; dateFrom?: string; dateTo?: string }) {
  const conditions = [];
  if (query.game) conditions.push(eq(suggestions.game, query.game));
  if (query.dateFrom) conditions.push(gte(suggestions.suggestionDate, query.dateFrom));
  if (query.dateTo) conditions.push(lte(suggestions.suggestionDate, query.dateTo));
  return conditions;
}

export class SuggestionRepository {
  constructor(private readonly db: Database) {}

  async findByGameAndDate(game: string, suggestionDate: string): Promise<Suggestion | undefined> {
    const [row] = await this.db
      .select()
      .from(suggestions)
      .where(and(eq(suggestions.game, game), eq(suggestions.suggestionDate, suggestionDate)))
      .limit(1);
    return row ? toSuggestion(row) : undefined;
  }

  /** Upsert por (game, suggestionDate): regenerar la sugerencia de un día reemplaza la anterior. */
  async upsert(input: CreateSuggestionInput): Promise<Suggestion> {
    const existing = await this.findByGameAndDate(input.game, input.suggestionDate);
    const now = new Date().toISOString();

    if (existing) {
      const updated = {
        numbers: input.numbers,
        extras: input.extras,
        algorithmVersion: input.algorithmVersion,
        signals: input.signals,
        updatedAt: now,
      };
      await this.db.update(suggestions).set(updated).where(eq(suggestions.id, existing.id));
      return { ...existing, ...updated };
    }

    const row = {
      id: createId(),
      game: input.game,
      suggestionDate: input.suggestionDate,
      numbers: input.numbers,
      extras: input.extras,
      algorithmVersion: input.algorithmVersion,
      signals: input.signals,
      createdAt: now,
      updatedAt: now,
    };
    await this.db.insert(suggestions).values(row);
    return toSuggestion(row as typeof suggestions.$inferSelect);
  }

  async list(query: ListSuggestionsQuery): Promise<Suggestion[]> {
    const conditions = buildConditions(query);
    const rows = await this.db
      .select()
      .from(suggestions)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(suggestions.suggestionDate))
      .limit(query.limit ?? 50)
      .offset(query.offset ?? 0);
    return rows.map(toSuggestion);
  }

  async count(query: ListSuggestionsQuery): Promise<number> {
    const conditions = buildConditions(query);
    const [row] = await this.db
      .select({ value: countRows() })
      .from(suggestions)
      .where(conditions.length ? and(...conditions) : undefined);
    return row?.value ?? 0;
  }
}
