import { z } from "zod";
import { requireGameConfig } from "../../config/game-config.js";
import { buildExtrasSchema, buildNumbersSchema, gameIdSchema } from "../games/game.schemas.js";
import type { ComparisonRequest } from "./comparison.types.js";

const baseComparisonSchema = z.object({
  game: gameIdSchema,
  numbers: z.array(z.number()),
  extras: z.record(z.string(), z.unknown()).optional(),
  source: z.enum(["draws", "bets"]).default("draws"),
  dateFrom: z.string().min(1).optional(),
  dateTo: z.string().min(1).optional(),
  minMatches: z.coerce.number().int().min(0).optional(),
});

export function parseComparisonRequest(input: unknown): ComparisonRequest {
  const base = baseComparisonSchema.parse(input);
  const config = requireGameConfig(base.game);
  const numbers = buildNumbersSchema(config).parse(base.numbers);
  const extras = base.extras !== undefined ? buildExtrasSchema(config).parse(base.extras) : undefined;

  return {
    game: base.game,
    numbers,
    ...(extras !== undefined && { extras }),
    source: base.source,
    ...(base.dateFrom !== undefined && { dateFrom: base.dateFrom }),
    ...(base.dateTo !== undefined && { dateTo: base.dateTo }),
    ...(base.minMatches !== undefined && { minMatches: base.minMatches }),
  };
}
