import { sqliteTable, text } from "drizzle-orm/sqlite-core";
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

export type DrawRow = typeof draws.$inferSelect;
export type NewDrawRow = typeof draws.$inferInsert;
export type BetRow = typeof bets.$inferSelect;
export type NewBetRow = typeof bets.$inferInsert;
export type BetLineRow = typeof betLines.$inferSelect;
export type NewBetLineRow = typeof betLines.$inferInsert;
