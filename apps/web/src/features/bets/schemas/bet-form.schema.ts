import { z } from "zod";
import { buildExtrasSchema, buildNumbersSchema } from "@/lib/validation/game-rules";
import type { GameConfig } from "@/types/game";

export function buildBetFormSchema(config: GameConfig) {
  const numbersSchema = buildNumbersSchema(config);
  const extrasSchema = buildExtrasSchema(config);

  return z.object({
    label: z.string().trim().optional(),
    lines: z
      .array(
        z.object({
          numbers: numbersSchema,
          extras: extrasSchema,
        }),
      )
      .min(1, "La apuesta debe tener al menos una línea"),
  });
}

export type BetFormValues = z.infer<ReturnType<typeof buildBetFormSchema>>;
