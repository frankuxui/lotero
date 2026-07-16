/**
 * GameConfig es la única fuente de verdad sobre las reglas de cada juego de lotería.
 * Ningún módulo de negocio debe hardcodear rangos, cantidades de números o campos "extra":
 * todo se deriva de la configuración registrada aquí. Añadir un juego nuevo consiste en
 * registrar un GameConfig adicional, sin tocar servicios, repositorios ni validaciones.
 */

export type GameId = "BONOLOTO" | "PRIMITIVA" | "EUROMILLONES" | "EURODREAMS" | "EL_GORDO" | (string & {});

export interface NumberFieldConfig {
  /** Cantidad exacta de números principales que debe tener la combinación. */
  count: number;
  min: number;
  max: number;
  unique: boolean;
  /** Si true, el motor normaliza (ordena) los números de entrada automáticamente. */
  sortAutomatically: boolean;
}

export type ExtraFieldType = "number" | "string";

export interface ExtraFieldConfig {
  key: string;
  label: string;
  type: ExtraFieldType;
  required: boolean;
  min?: number;
  max?: number;
  /** Patrón opcional (regex en texto) para validar campos tipo string, p.ej. el Joker. */
  pattern?: string;
}

export interface GameConfig {
  id: GameId;
  label: string;
  numbers: NumberFieldConfig;
  extras: ExtraFieldConfig[];
}

const registry = new Map<GameId, GameConfig>();

export function registerGameConfig(config: GameConfig): void {
  registry.set(config.id, config);
}

export function getGameConfig(id: GameId): GameConfig | undefined {
  return registry.get(id);
}

export class GameNotFoundError extends Error {
  constructor(id: GameId) {
    super(`Juego no soportado: ${String(id)}`);
    this.name = "GameNotFoundError";
  }
}

export function requireGameConfig(id: GameId): GameConfig {
  const config = getGameConfig(id);
  if (!config) {
    throw new GameNotFoundError(id);
  }
  return config;
}

export function listGameConfigs(): GameConfig[] {
  return Array.from(registry.values());
}

// --- Juegos soportados inicialmente ---

registerGameConfig({
  id: "BONOLOTO",
  label: "Bonoloto",
  numbers: { count: 6, min: 1, max: 49, unique: true, sortAutomatically: true },
  extras: [
    { key: "complementario", label: "Complementario", type: "number", required: true, min: 1, max: 49 },
    { key: "reintegro", label: "Reintegro", type: "number", required: true, min: 0, max: 9 },
  ],
});

registerGameConfig({
  id: "PRIMITIVA",
  label: "La Primitiva",
  numbers: { count: 6, min: 1, max: 49, unique: true, sortAutomatically: true },
  extras: [
    { key: "complementario", label: "Complementario", type: "number", required: true, min: 1, max: 49 },
    { key: "reintegro", label: "Reintegro", type: "number", required: true, min: 0, max: 9 },
    { key: "joker", label: "Joker", type: "string", required: false, pattern: "^\\d{7}$" },
  ],
});

// --- Preparado para futuros juegos (deshabilitados hasta tener reglas confirmadas) ---
// registerGameConfig({ id: "EUROMILLONES", ... });
// registerGameConfig({ id: "EURODREAMS", ... });
// registerGameConfig({ id: "EL_GORDO", ... });
