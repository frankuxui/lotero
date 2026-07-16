import { z } from "zod";

export const numberParamSchema = z.object({
  number: z.coerce.number().int(),
});

export const numberQuerySchema = z.object({
  game: z.string().min(1).optional(),
});
