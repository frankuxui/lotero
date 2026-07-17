import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * numbers y extras se guardan como JSON serializado en columnas de texto.
 * SQLite no tiene un tipo JSON nativo con validación; la validación real de forma
 * (cantidad de números, rango, campos extra) vive en las capas de schema (Zod) y
 * se apoya siempre en GameConfig, nunca en reglas fijas por juego dentro del acceso a datos.
 */

export const draws = sqliteTable("draws", {
  id: text("id").primaryKey(),
  game: text("game").notNull(),
  drawDate: text("draw_date").notNull(),
  numbers: text("numbers", { mode: "json" }).$type<number[]>().notNull(),
  extras: text("extras", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const bets = sqliteTable("bets", {
  id: text("id").primaryKey(),
  game: text("game").notNull(),
  label: text("label"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const betLines = sqliteTable("bet_lines", {
  id: text("id").primaryKey(),
  betId: text("bet_id")
    .notNull()
    .references(() => bets.id, { onDelete: "cascade" }),
  numbers: text("numbers", { mode: "json" }).$type<number[]>().notNull(),
  extras: text("extras", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

/**
 * Una fila por (game, suggestionDate): la sugerencia del día se regenera (upsert) cuando se
 * registra/edita un sorteo de ese juego, o de forma perezosa si se consulta sin que exista
 * fila para hoy. algorithmVersion evita reinterpretar sugerencias pasadas con pesos que no
 * se usaron en su momento; signals guarda el desglose por señal para transparencia y ajuste.
 */
export const suggestions = sqliteTable(
  "suggestions",
  {
    id: text("id").primaryKey(),
    game: text("game").notNull(),
    suggestionDate: text("suggestion_date").notNull(),
    numbers: text("numbers", { mode: "json" }).$type<number[]>().notNull(),
    extras: text("extras", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
    algorithmVersion: text("algorithm_version").notNull(),
    signals: text("signals", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [uniqueIndex("suggestions_game_date_unique").on(table.game, table.suggestionDate)],
);

export type DrawRow = typeof draws.$inferSelect;
export type NewDrawRow = typeof draws.$inferInsert;
export type BetRow = typeof bets.$inferSelect;
export type NewBetRow = typeof bets.$inferInsert;
export type BetLineRow = typeof betLines.$inferSelect;
export type NewBetLineRow = typeof betLines.$inferInsert;
export type SuggestionRow = typeof suggestions.$inferSelect;
export type NewSuggestionRow = typeof suggestions.$inferInsert;
