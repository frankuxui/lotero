import { z } from "zod";
import { gameIdSchema } from "../games/game.schemas.js";
import type { StatisticsQuery } from "./statistics.types.js";

export const statisticsQuerySchema = z.object({
  game: gameIdSchema,
  dateFrom: z.string().min(1).optional(),
  dateTo: z.string().min(1).optional(),
});

export function parseStatisticsQuery(input: unknown): StatisticsQuery {
  return statisticsQuerySchema.parse(input);
}
