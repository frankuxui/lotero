import { listGameConfigs } from "../../config/game-config.js";
import type { BetRepository } from "../bets/bet.repository.js";
import type { ComparisonService } from "../comparison/comparison.service.js";
import type { DrawRepository } from "../draws/draw.repository.js";
import { computeStatistics } from "../statistics/statistics.service.js";
import type { DashboardGameCount, DashboardGameNumbers, DashboardMatch, DashboardResponse } from "./dashboard.types.js";

const RECENT_LIMIT = 5;
const MATCH_LIMIT = 5;
const HOT_COLD_LIMIT = 5;

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
    }

    const recentMatches = await this.computeRecentMatches(recentBets);

    return {
      quickStats: { totalDraws, totalBets, byGame },
      recentDraws,
      recentBets,
      recentMatches,
      numbersByGame,
    };
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
