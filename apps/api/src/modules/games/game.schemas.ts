import { z } from "zod";
import type { GameConfig } from "../../config/game-config.js";

/**
 * Construye dinámicamente los esquemas de validación de números y extras
 * a partir de un GameConfig. Ningún módulo debe definir un esquema fijo
 * (p. ej. "6 números entre 1 y 49"): siempre se deriva de la configuración
 * del juego para poder incorporar nuevos juegos sin tocar esta lógica.
 */
export function buildNumbersSchema(config: GameConfig) {
  const { count, min, max, unique } = config.numbers;

  let schema = z
    .array(z.number().int().min(min).max(max))
    .length(count, `Debe indicar exactamente ${count} números`);

  if (unique) {
    schema = schema.refine((numbers) => new Set(numbers).size === numbers.length, {
      message: "Los números no pueden repetirse",
    });
  }

  return schema.transform((numbers) => (config.numbers.sortAutomatically ? [...numbers].sort((a, b) => a - b) : numbers));
}

export function buildExtrasSchema(config: GameConfig) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const extra of config.extras) {
    let field: z.ZodTypeAny =
      extra.type === "number"
        ? z.number().int().min(extra.min ?? Number.MIN_SAFE_INTEGER).max(extra.max ?? Number.MAX_SAFE_INTEGER)
        : extra.pattern
          ? z.string().regex(new RegExp(extra.pattern), `${extra.label} tiene un formato inválido`)
          : z.string();

    if (!extra.required) {
      field = field.optional();
    }

    shape[extra.key] = field;
  }

  return z.object(shape).strict();
}

export const gameIdSchema = z.string().min(1, "El juego es obligatorio");
