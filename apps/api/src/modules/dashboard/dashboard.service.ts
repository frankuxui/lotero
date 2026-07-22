import { listGameConfigs } from "../../config/game-config.js";
import type { Bet } from "../bets/bet.types.js";
import type { BetRepository } from "../bets/bet.repository.js";
import type { ComparisonService } from "../comparison/comparison.service.js";
import type { DrawRepository } from "../draws/draw.repository.js";
import { computeStatistics } from "../statistics/statistics.service.js";
import type { NumberFrequency } from "../statistics/statistics.types.js";
import type { DashboardGameCount, DashboardGameMostPlayed, DashboardGameNumbers, DashboardMatch, DashboardResponse } from "./dashboard.types.js";

const RECENT_LIMIT = 5;
const MATCH_LIMIT = 5;
const HOT_COLD_LIMIT = 5;
const MOST_PLAYED_LIMIT = 5;

export class DashboardService {
  constructor(
    private readonly drawRepository: DrawRepository,
    private readonly betRepository: BetRepository,
    private readonly comparisonService: ComparisonService,
  ) {}

  async getDashboard(): Promise<DashboardResponse> {
    const games = listGameConfigs();

    const [totalDraws, totalBets, recentDraws, recentBets] = await Promise.all([
      this.drawRepository.count({}),
      this.betRepository.count({}),
      this.drawRepository.list({ limit: RECENT_LIMIT, offset: 0 }),
      this.betRepository.list({ limit: RECENT_LIMIT, offset: 0 }),
    ]);

    const byGame: DashboardGameCount[] = [];
    const numbersByGame: DashboardGameNumbers[] = [];
    const mostPlayedByGame: DashboardGameMostPlayed[] = [];

    for (const config of games) {
      const [gameDraws, gameBets] = await Promise.all([
        this.drawRepository.count({ game: config.id }),
        this.betRepository.count({ game: config.id }),
      ]);
      byGame.push({ game: config.id, draws: gameDraws, bets: gameBets });

      if (gameDraws > 0) {
        const draws = await this.drawRepository.listAllMatching({ game: config.id });
        const stats = computeStatistics(config, draws);
        numbersByGame.push({
          game: config.id,
          hot: stats.hot.slice(0, HOT_COLD_LIMIT),
          cold: stats.cold.slice(0, HOT_COLD_LIMIT),
        });
      }

      if (gameBets > 0) {
        const bets = await this.betRepository.listAllMatching({ game: config.id });
        mostPlayedByGame.push({ game: config.id, numbers: this.computeMostPlayedNumbers(bets) });
      }
    }

    const recentMatches = await this.computeRecentMatches(recentBets);

    return {
      quickStats: { totalDraws, totalBets, byGame },
      recentDraws,
      recentBets,
      recentMatches,
      numbersByGame,
      mostPlayedByGame,
    };
  }

  /** Frecuencia de números dentro de las líneas de apuesta de un juego (no de los sorteos). */
  private computeMostPlayedNumbers(bets: Bet[]): NumberFrequency[] {
    const counts = new Map<number, number>();
    let totalLines = 0;

    for (const bet of bets) {
      for (const line of bet.lines) {
        totalLines += 1;
        for (const number of line.numbers) {
          counts.set(number, (counts.get(number) ?? 0) + 1);
        }
      }
    }

    return Array.from(counts.entries())
      .map(([number, count]) => ({
        number,
        count,
        percentage: totalLines > 0 ? Math.round((count / totalLines) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.count - a.count || a.number - b.number)
      .slice(0, MOST_PLAYED_LIMIT);
  }

  private async computeRecentMatches(
    recentBets: Awaited<ReturnType<BetRepository["list"]>>,
  ): Promise<DashboardMatch[]> {
    const bestPerLine: DashboardMatch[] = [];

    for (const bet of recentBets) {
      for (const line of bet.lines) {
        const { results } = await this.comparisonService.compareRequest({
          game: bet.game,
          numbers: line.numbers,
          source: "draws",
        });
        const best = results[0];
        if (best && best.totalMatches > 0) {
          bestPerLine.push({ ...best, betId: bet.id, betLabel: bet.label ?? null });
        }
      }
    }

    return bestPerLine.sort((a, b) => b.totalMatches - a.totalMatches || b.percentage - a.percentage).slice(0, MATCH_LIMIT);
  }
}
