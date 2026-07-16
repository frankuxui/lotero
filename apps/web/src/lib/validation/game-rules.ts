import { z } from "zod";
import type { GameConfig } from "@/types/game";

/**
 * Replica en el cliente, en Zod, exactamente las reglas que aplica la API
 * (apps/api/src/modules/games/game.schemas.ts) — parametrizadas siempre por el
 * GameConfig recibido de GET /api/games, nunca hardcodeadas por juego.
 */
export function buildNumbersSchema(config: GameConfig) {
  const { count, min, max, unique } = config.numbers;

  let schema = z
    .array(
      z
        .number({ error: "Debe ser un número" })
        .int("Debe ser un número entero")
        .min(min, `Debe ser mayor o igual a ${min}`)
        .max(max, `Debe ser menor o igual a ${max}`),
    )
    .length(count, `Debe indicar exactamente ${count} números`);

  if (unique) {
    schema = schema.refine((numbers) => new Set(numbers).size === numbers.length, {
      message: "Los números no pueden repetirse",
    });
  }

  // El selector de casillas se rellena de izquierda a derecha: cada número debe ser mayor
  // que el anterior para detectar errores de tecleo (p. ej. 01, 13, 24, 19 → el 19 está fuera de orden).
  schema = schema.refine((numbers) => numbers.every((n, i) => i === 0 || n > numbers[i - 1]!), {
    message: "Cada número debe ser mayor que el anterior (orden ascendente, de izquierda a derecha)",
  });

  return schema;
}

export function buildExtrasSchema(config: GameConfig) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const extra of config.extras) {
    let field: z.ZodTypeAny =
      extra.type === "number"
        ? z
            .number({ error: `${extra.label} debe ser un número` })
            .int()
            .min(extra.min ?? Number.MIN_SAFE_INTEGER, `${extra.label} debe ser mayor o igual a ${extra.min}`)
            .max(extra.max ?? Number.MAX_SAFE_INTEGER, `${extra.label} debe ser menor o igual a ${extra.max}`)
        : extra.pattern
          ? z.string().regex(new RegExp(extra.pattern), `${extra.label} tiene un formato inválido`)
          : z.string();

    if (!extra.required) {
      // Un campo string opcional vacío ("") equivale a "no indicado", no a un formato inválido.
      field = extra.type === "string" ? z.preprocess((v) => (v === "" ? undefined : v), field.optional()) : field.optional();
    }

    shape[extra.key] = field;
  }

  return z.object(shape).strict();
}

export function randomValidCombination(config: GameConfig): number[] {
  const { count, min, max } = config.numbers;
  const pool: number[] = [];
  for (let n = min; n <= max; n += 1) pool.push(n);

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = pool[i]!;
    pool[i] = pool[j]!;
    pool[j] = tmp;
  }

  return pool.slice(0, count).sort((a, b) => a - b);
}

export function defaultExtrasFor(config: GameConfig): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  for (const extra of config.extras) {
    if (!extra.required) continue;
    defaults[extra.key] = extra.type === "number" ? (extra.min ?? 0) : "";
  }
  return defaults;
}
