import type { GameConfig } from "../../config/game-config.js";
import type { Draw } from "../draws/draw.types.js";
import { computeStatistics } from "../statistics/statistics.service.js";
import type { SignalBreakdown } from "./suggestion.types.js";

/**
 * Motor puro (sin acceso a datos) de la sugerencia diaria. Recibe el historial de sorteos ya
 * cargado y devuelve números + desglose de señales; quien llama decide qué hacer con el
 * resultado (persistirlo, compararlo, etc.). Etiquetado con ALGORITHM_VERSION para que un
 * cambio futuro de pesos no reinterprete sugerencias históricas generadas con otras reglas.
 */
export const ALGORITHM_VERSION = "v1";

const WEIGHTS = {
  proximity: 0.4,
  calendarMatch: 0.35,
  frequency: 0.25,
} as const;

/** Cuántos sorteos recientes alimentan la señal de proximidad numérica. */
const RECENT_DRAWS_FOR_PROXIMITY = 10;
/** Distancia máxima considerada "cercana" a un número que salió recientemente. */
const PROXIMITY_RADIUS = 2;
/** Ventana en días (antes/después, ignorando el año) para la coincidencia de fecha calendario. */
const CALENDAR_WINDOW_DAYS = 3;

function emptyScoreMap(config: GameConfig): Map<number, number> {
  const scores = new Map<number, number>();
  for (let n = config.numbers.min; n <= config.numbers.max; n += 1) scores.set(n, 0);
  return scores;
}

function normalize(scores: Map<number, number>): Map<number, number> {
  const max = Math.max(0, ...scores.values());
  if (max <= 0) return scores;
  const out = new Map<number, number>();
  for (const [number, value] of scores) out.set(number, value / max);
  return out;
}

/**
 * Distancia en días entre dos fechas del calendario ignorando el año (para detectar "un día
 * como hoy" en años anteriores), manejando el cruce de fin/inicio de año.
 */
function calendarDayDistance(dateStr: string, targetMonth: number, targetDay: number): number | null {
  const match = /^\d{4}-(\d{2})-(\d{2})/.exec(dateStr);
  if (!match) return null;
  const month = Number(match[1]);
  const day = Number(match[2]);

  const oneDay = 86_400_000;
  const daysInYear = 366;
  const base = Date.UTC(2000, targetMonth - 1, targetDay);
  const candidate = Date.UTC(2000, month - 1, day);
  let diff = Math.round((candidate - base) / oneDay);
  diff = ((diff % daysInYear) + daysInYear) % daysInYear;
  if (diff > daysInYear / 2) diff -= daysInYear;
  return Math.abs(diff);
}

/** Señal 1: cercanía a números de los sorteos más recientes, con más peso a lo más reciente. */
function computeProximityScores(config: GameConfig, drawsDesc: Draw[]): Map<number, number> {
  const scores = emptyScoreMap(config);
  const recent = drawsDesc.slice(0, RECENT_DRAWS_FOR_PROXIMITY);

  recent.forEach((draw, index) => {
    const recencyWeight = (recent.length - index) / recent.length;
    for (const drawnNumber of draw.numbers) {
      for (let offset = -PROXIMITY_RADIUS; offset <= PROXIMITY_RADIUS; offset += 1) {
        const candidate = drawnNumber + offset;
        if (candidate < config.numbers.min || candidate > config.numbers.max) continue;
        const proximityWeight = 1 / (1 + Math.abs(offset));
        scores.set(candidate, (scores.get(candidate) ?? 0) + recencyWeight * proximityWeight);
      }
    }
  });

  return normalize(scores);
}

/** Señal 2: números que salieron en fechas cercanas al mismo día/mes en años anteriores. */
function computeCalendarScores(config: GameConfig, allDraws: Draw[], targetDate: Date): Map<number, number> {
  const scores = emptyScoreMap(config);
  const targetMonth = targetDate.getUTCMonth() + 1;
  const targetDay = targetDate.getUTCDate();

  for (const draw of allDraws) {
    const distance = calendarDayDistance(draw.drawDate, targetMonth, targetDay);
    if (distance === null || distance > CALENDAR_WINDOW_DAYS) continue;
    const weight = 1 / (1 + distance);
    for (const number of draw.numbers) {
      scores.set(number, (scores.get(number) ?? 0) + weight);
    }
  }

  return normalize(scores);
}

/** Señal 3: frecuencia histórica combinada con "frialdad" (mucho sin salir); reutiliza computeStatistics. */
function computeFrequencyScores(config: GameConfig, allDraws: Draw[]): Map<number, number> {
  const stats = computeStatistics(config, allDraws);
  const scores = emptyScoreMap(config);

  const maxDelay = Math.max(1, ...stats.delays.map((entry) => entry.delay));
  const delayByNumber = new Map(stats.delays.map((entry) => [entry.number, entry.delay]));

  for (const entry of stats.frequencies) {
    const frequencyPart = entry.percentage / 100;
    const delayPart = (delayByNumber.get(entry.number) ?? 0) / maxDelay;
    scores.set(entry.number, 0.6 * frequencyPart + 0.4 * delayPart);
  }

  return normalize(scores);
}

/** Elige el valor de un campo extra con mayor frecuencia histórica; si no hay datos, un valor por defecto válido. */
function suggestExtraValue(config: GameConfig, allDraws: Draw[], extraKey: string): unknown {
  const extraConfig = config.extras.find((extra) => extra.key === extraKey);
  if (!extraConfig) return undefined;

  const stats = computeStatistics(config, allDraws);
  const extraStats = stats.extraFrequencies.find((entry) => entry.key === extraKey);
  const top = extraStats?.top[0]?.value;
  if (top !== undefined) return top;

  // Sin histórico todavía: valor por defecto válido para no dejar el campo vacío.
  if (extraConfig.type === "number") return extraConfig.min ?? 0;
  return undefined;
}

export interface SuggestionEngineResult {
  numbers: number[];
  extras: Record<string, unknown>;
  signals: Record<string, SignalBreakdown>;
}

/**
 * Genera la sugerencia para un juego en una fecha dada, a partir de su historial de sorteos.
 * `allDraws` debe venir ordenado desc por fecha (mismo contrato que DrawRepository.listAllMatching).
 */
export function generateSuggestion(config: GameConfig, allDraws: Draw[], targetDate: Date): SuggestionEngineResult {
  const proximity = computeProximityScores(config, allDraws);
  const calendarMatch = computeCalendarScores(config, allDraws, targetDate);
  const frequency = computeFrequencyScores(config, allDraws);

  const totals = new Map<number, number>();
  const signals: Record<string, SignalBreakdown> = {};

  for (let n = config.numbers.min; n <= config.numbers.max; n += 1) {
    const p = proximity.get(n) ?? 0;
    const c = calendarMatch.get(n) ?? 0;
    const f = frequency.get(n) ?? 0;
    const total = WEIGHTS.proximity * p + WEIGHTS.calendarMatch * c + WEIGHTS.frequency * f;
    totals.set(n, total);
    signals[String(n)] = { proximity: p, calendarMatch: c, frequency: f, total };
  }

  let numbers = Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .slice(0, config.numbers.count)
    .map(([number]) => number);

  if (config.numbers.sortAutomatically) {
    numbers = [...numbers].sort((a, b) => a - b);
  }

  const extras: Record<string, unknown> = {};
  for (const extraConfig of config.extras) {
    const value = suggestExtraValue(config, allDraws, extraConfig.key);
    if (value !== undefined) extras[extraConfig.key] = value;
  }

  return { numbers, extras, signals };
}
