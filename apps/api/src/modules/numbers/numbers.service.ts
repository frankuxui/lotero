import { listGameConfigs, requireGameConfig, type GameConfig } from "../../config/game-config.js";
import { HttpError } from "../../utils/http-error.js";
import type { BetRepository } from "../bets/bet.repository.js";
import type { DrawRepository } from "../draws/draw.repository.js";
import { computeStatistics } from "../statistics/statistics.service.js";
import { numberParamSchema, numberQuerySchema } from "./numbers.schemas.js";
import type { NumberDetailResponse, NumberGameAppearances, RelatedBetLine } from "./numbers.types.js";

const RELATED_LIMIT = 10;

export class NumberService {
  constructor(
    private readonly drawRepository: DrawRepository,
    private readonly betRepository: BetRepository,
  ) {}

  async getDetail(paramsInput: unknown, queryInput: unknown): Promise<NumberDetailResponse> {
    const { number } = numberParamSchema.parse(paramsInput);
    const { game } = numberQuerySchema.parse(queryInput);

    const allGames = listGameConfigs();
    const resolvedGame = this.resolveGame(number, game, allGames);

    const byGame: NumberGameAppearances[] = [];
    let totalDraws = 0;
    let totalBets = 0;
    let resolvedGameDraws: Awaited<ReturnType<DrawRepository["listAllMatching"]>> = [];
    let resolvedGameBets: Awaited<ReturnType<BetRepository["listAllMatching"]>> = [];

    for (const config of allGames) {
      if (number < config.numbers.min || number > config.numbers.max) continue;

      const [draws, bets] = await Promise.all([
        this.drawRepository.listAllMatching({ game: config.id }),
        this.betRepository.listAllMatching({ game: config.id }),
      ]);

      const drawsCount = draws.filter((draw) => draw.numbers.includes(number)).length;
      const betsCount = bets.reduce(
        (acc, bet) => acc + bet.lines.filter((line) => line.numbers.includes(number)).length,
        0,
      );

      byGame.push({ game: config.id, draws: drawsCount, bets: betsCount });
      totalDraws += drawsCount;
      totalBets += betsCount;

      if (config.id === resolvedGame.id) {
        resolvedGameDraws = draws;
        resolvedGameBets = bets;
      }
    }

    const stats = computeStatistics(resolvedGame, resolvedGameDraws);
    const frequencyEntry = stats.frequencies.find((f) => f.number === number);
    const delayEntry = stats.delays.find((d) => d.number === number);
    const rankingOrder = [...stats.frequencies].sort((a, b) => b.count - a.count || a.number - b.number);
    const ranking = rankingOrder.findIndex((f) => f.number === number) + 1;

    const lastDrawWithNumber = resolvedGameDraws.find((draw) => draw.numbers.includes(number));
    const lastAppearance = lastDrawWithNumber
      ? { drawId: lastDrawWithNumber.id, game: lastDrawWithNumber.game, drawDate: lastDrawWithNumber.drawDate }
      : null;

    const grandTotal = totalDraws + totalBets;
    const distributionByGame = byGame.map((entry) => ({
      game: entry.game,
      count: entry.draws + entry.bets,
      percentage: grandTotal > 0 ? Math.round(((entry.draws + entry.bets) / grandTotal) * 1000) / 10 : 0,
    }));

    const relatedDraws = resolvedGameDraws.filter((draw) => draw.numbers.includes(number)).slice(0, RELATED_LIMIT);

    const relatedBets: RelatedBetLine[] = [];
    outer: for (const bet of resolvedGameBets) {
      for (const line of bet.lines) {
        if (line.numbers.includes(number)) {
          relatedBets.push({
            betId: bet.id,
            betLabel: bet.label ?? null,
            lineId: line.id,
            numbers: line.numbers,
            extras: line.extras,
            createdAt: bet.createdAt,
          });
          if (relatedBets.length >= RELATED_LIMIT) break outer;
        }
      }
    }

    return {
      number,
      resolvedGame: resolvedGame.id,
      appearances: { draws: totalDraws, bets: totalBets },
      byGame,
      frequency: frequencyEntry?.percentage ?? 0,
      lastAppearance,
      delay: delayEntry?.delay ?? resolvedGameDraws.length,
      ranking,
      distributionByGame,
      relatedDraws,
      relatedBets,
    };
  }

  private resolveGame(number: number, gameParam: string | undefined, allGames: GameConfig[]): GameConfig {
    if (gameParam) {
      const config = requireGameConfig(gameParam);
      if (number < config.numbers.min || number > config.numbers.max) {
        throw HttpError.badRequest(`El número ${number} está fuera de rango para ${config.label}`);
      }
      return config;
    }

    const found = allGames.find((config) => number >= config.numbers.min && number <= config.numbers.max);
    if (!found) {
      throw HttpError.badRequest(`El número ${number} no está soportado por ningún juego registrado`);
    }
    return found;
  }
}
