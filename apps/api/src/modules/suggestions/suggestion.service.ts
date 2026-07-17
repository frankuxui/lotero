import { listGameConfigs, requireGameConfig } from "../../config/game-config.js";
import type { PageMeta } from "../../utils/response.js";
import type { DrawRepository } from "../draws/draw.repository.js";
import { ALGORITHM_VERSION, generateSuggestion } from "./suggestion.engine.js";
import { listSuggestionsQuerySchema } from "./suggestion.schemas.js";
import type { SuggestionRepository } from "./suggestion.repository.js";
import type { ListSuggestionsQuery, Suggestion, SuggestionOutcome, SuggestionWithOutcome } from "./suggestion.types.js";

/** Fecha "de hoy" en formato plano (YYYY-MM-DD, UTC) para que coincida con el formato de drawDate. */
function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export class SuggestionService {
  constructor(
    private readonly repository: SuggestionRepository,
    private readonly drawRepository: DrawRepository,
  ) {}

  /** Regenera (upsert) la sugerencia de un juego para una fecha. No lanza si el juego no existe con datos: sí valida que el juego esté registrado. */
  async regenerateFor(game: string, date: Date = new Date()): Promise<Suggestion> {
    const config = requireGameConfig(game);
    const allDraws = await this.drawRepository.listAllMatching({ game });
    const { numbers, extras, signals } = generateSuggestion(config, allDraws, date);
    const suggestionDate = date.toISOString().slice(0, 10);

    return this.repository.upsert({
      game,
      suggestionDate,
      numbers,
      extras,
      algorithmVersion: ALGORITHM_VERSION,
      signals,
    });
  }

  /** Devuelve la sugerencia vigente de un juego, generándola de forma perezosa si falta la de hoy. */
  async ensureToday(game: string): Promise<Suggestion> {
    const today = todayDateString();
    const existing = await this.repository.findByGameAndDate(game, today);
    if (existing) return existing;
    return this.regenerateFor(game, new Date());
  }

  /** Sugerencia de hoy para todos los juegos registrados (usado por el Dashboard). */
  async getTodayAll(): Promise<Suggestion[]> {
    const games = listGameConfigs();
    return Promise.all(games.map((config) => this.ensureToday(config.id)));
  }

  private async withOutcome(suggestion: Suggestion): Promise<SuggestionWithOutcome> {
    const draws = await this.drawRepository.listAllMatching({
      game: suggestion.game,
      dateFrom: suggestion.suggestionDate,
      dateTo: suggestion.suggestionDate,
    });
    const draw = draws[0];

    const outcome: SuggestionOutcome = draw
      ? {
          status: "resolved",
          drawId: draw.id,
          matches: suggestion.numbers.filter((n) => draw.numbers.includes(n)).length,
          totalNumbers: suggestion.numbers.length,
        }
      : { status: "pending" };

    return { ...suggestion, outcome };
  }

  async list(input: unknown): Promise<{ data: SuggestionWithOutcome[]; meta: PageMeta }> {
    const query: ListSuggestionsQuery = listSuggestionsQuerySchema.parse(input);
    if (query.game) requireGameConfig(query.game);

    const [rows, total] = await Promise.all([this.repository.list(query), this.repository.count(query)]);
    const data = await Promise.all(rows.map((row) => this.withOutcome(row)));

    return { data, meta: { total, limit: query.limit ?? 50, offset: query.offset ?? 0 } };
  }
}
