import { z } from "zod";
import { buildExtrasSchema, buildNumbersSchema } from "@/lib/validation/game-rules";
import type { GameConfig } from "@/types/game";

export function buildDrawFormSchema(config: GameConfig) {
  return z.object({
    drawDate: z.string().min(1, "La fecha de sorteo es obligatoria"),
    numbers: buildNumbersSchema(config),
    extras: buildExtrasSchema(config),
  });
}

export type DrawFormValues = z.infer<ReturnType<typeof buildDrawFormSchema>>;
