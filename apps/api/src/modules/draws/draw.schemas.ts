import { z } from "zod";
import { requireGameConfig } from "../../config/game-config.js";
import { buildExtrasSchema, buildNumbersSchema, gameIdSchema } from "../games/game.schemas.js";
import type { CreateDrawInput, UpdateDrawInput } from "./draw.types.js";

const numbersInputSchema = z.array(z.number());
const extrasInputSchema = z.record(z.string(), z.unknown());

const createDrawSchema = z.object({
  game: gameIdSchema,
  drawDate: z.string().min(1, "La fecha de sorteo es obligatoria"),
  numbers: numbersInputSchema,
  extras: extrasInputSchema.default({}),
});

export function parseCreateDraw(input: unknown): CreateDrawInput {
  const base = createDrawSchema.parse(input);
  const config = requireGameConfig(base.game);

  return {
    game: base.game,
    drawDate: base.drawDate,
    numbers: buildNumbersSchema(config).parse(base.numbers),
    extras: buildExtrasSchema(config).parse(base.extras),
  };
}

const updateDrawSchema = z.object({
  game: gameIdSchema.optional(),
  drawDate: z.string().min(1, "La fecha de sorteo es obligatoria").optional(),
  numbers: numbersInputSchema.optional(),
  extras: extrasInputSchema.optional(),
});

export function parseUpdateDraw(input: unknown, currentGame: string): UpdateDrawInput {
  const base = updateDrawSchema.parse(input);
  const config = requireGameConfig(base.game ?? currentGame);

  return {
    ...(base.game !== undefined && { game: base.game }),
    ...(base.drawDate !== undefined && { drawDate: base.drawDate }),
    ...(base.numbers !== undefined && { numbers: buildNumbersSchema(config).parse(base.numbers) }),
    ...(base.extras !== undefined && { extras: buildExtrasSchema(config).parse(base.extras) }),
  };
}

export const listDrawsQuerySchema = z.object({
  game: z.string().optional(),
  dateFrom: z.string().min(1).optional(),
  dateTo: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});
