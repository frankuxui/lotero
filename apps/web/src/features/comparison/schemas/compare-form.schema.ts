import { z } from "zod";
import { buildNumbersSchema } from "@/lib/validation/game-rules";
import type { GameConfig } from "@/types/game";

export function buildCompareFormSchema(config: GameConfig) {
  return z.object({
    numbers: buildNumbersSchema(config),
    source: z.enum(["draws", "bets"]),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    minMatches: z.number().int().min(0).optional(),
  });
}

export type CompareFormValues = z.infer<ReturnType<typeof buildCompareFormSchema>>;
