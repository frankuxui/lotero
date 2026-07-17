import { z } from "zod";
import { requireGameConfig } from "../../config/game-config.js";
import { buildExtrasSchema, buildNumbersSchema, gameIdSchema } from "../games/game.schemas.js";
import type { CreateBetInput, UpdateBetInput } from "./bet.types.js";

const numbersInputSchema = z.array(z.number());
const extrasInputSchema = z.record(z.string(), z.unknown());

const lineInputSchema = z.object({
  numbers: numbersInputSchema,
  extras: extrasInputSchema.default({}),
});

const createdAtInputSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha de creación debe tener formato AAAA-MM-DD");

const createBetSchema = z.object({
  game: gameIdSchema,
  label: z.string().trim().min(1).optional(),
  createdAt: createdAtInputSchema.optional(),
  lines: z.array(lineInputSchema).min(1, "La apuesta debe tener al menos una línea"),
});

export function parseCreateBet(input: unknown): CreateBetInput {
  const base = createBetSchema.parse(input);
  const config = requireGameConfig(base.game);
  const numbersSchema = buildNumbersSchema(config);
  const extrasSchema = buildExtrasSchema(config);

  return {
    game: base.game,
    ...(base.label !== undefined && { label: base.label }),
    ...(base.createdAt !== undefined && { createdAt: base.createdAt }),
    lines: base.lines.map((line) => ({
      numbers: numbersSchema.parse(line.numbers),
      extras: extrasSchema.parse(line.extras),
    })),
  };
}

const updateBetSchema = z.object({
  game: gameIdSchema.optional(),
  label: z.string().trim().min(1).optional(),
  createdAt: createdAtInputSchema.optional(),
  lines: z.array(lineInputSchema).min(1).optional(),
});

export function parseUpdateBet(input: unknown, currentGame: string): UpdateBetInput {
  const base = updateBetSchema.parse(input);
  const config = requireGameConfig(base.game ?? currentGame);
  const numbersSchema = buildNumbersSchema(config);
  const extrasSchema = buildExtrasSchema(config);

  return {
    ...(base.game !== undefined && { game: base.game }),
    ...(base.label !== undefined && { label: base.label }),
    ...(base.createdAt !== undefined && { createdAt: base.createdAt }),
    ...(base.lines !== undefined && {
      lines: base.lines.map((line) => ({
        numbers: numbersSchema.parse(line.numbers),
        extras: extrasSchema.parse(line.extras),
      })),
    }),
  };
}

export const listBetsQuerySchema = z.object({
  game: z.string().optional(),
  dateFrom: z.string().min(1).optional(),
  dateTo: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});
