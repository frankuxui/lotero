import { requireGameConfig, type GameConfig } from "../../config/game-config.js";
import type { Draw } from "../draws/draw.types.js";
import type { DrawRepository } from "../draws/draw.repository.js";
import { parseStatisticsQuery } from "./statistics.schemas.js";
import type {
  DecadeBucket,
  NumberDelay,
  NumberFrequency,
  NumberPair,
  NumberTrio,
  StatisticsResponse,
} from "./statistics.types.js";

const TOP_LIST_SIZE = 10;

function combinations<T>(items: T[], size: number): T[][] {
  if (size === 0) return [[]];
  if (items.length < size) return [];

  const [first, ...rest] = items;
  const withFirst = combinations(rest, size - 1).map((combo) => [first as T, ...combo]);
  const withoutFirst = combinations(rest, size);
  return [...withFirst, ...withoutFirst];
}

/** Motor puro de cálculo: reutilizable por el dashboard (calientes/fríos) sin duplicar lógica. */
export function computeStatistics(config: GameConfig, draws: Draw[]): StatisticsResponse {
  const { min, max } = config.numbers;
  const totalDraws = draws.length;
  // draws viene ordenado DESC por fecha (más reciente primero), garantizado por DrawRepository.listAllMatching.
  const dates = draws.map((draw) => draw.drawDate);

  const frequencyMap = new Map<number, number>();
  for (let n = min; n <= max; n += 1) frequencyMap.set(n, 0);

  let oddCount = 0;
  let evenCount = 0;
  let sumTotal = 0;
  const decadeMap = new Map<string, number>();
  const pairCounts = new Map<string, { numbers: [number, number]; count: number }>();
  const trioCounts = new Map<string, { numbers: [number, number, number]; count: number }>();
  let drawsWithConsecutive = 0;

  for (const draw of draws) {
    const sorted = [...draw.numbers].sort((a, b) => a - b);
    sumTotal += sorted.reduce((acc, n) => acc + n, 0);

    let hasConsecutive = false;
    for (let i = 0; i < sorted.length; i += 1) {
      const n = sorted[i]!;
      frequencyMap.set(n, (frequencyMap.get(n) ?? 0) + 1);
      if (n % 2 === 0) evenCount += 1;
      else oddCount += 1;

      const decadeStart = Math.floor((n - 1) / 10) * 10 + 1;
      const decadeEnd = Math.min(decadeStart + 9, max);
      const decadeLabel = `${String(decadeStart).padStart(2, "0")}-${String(decadeEnd).padStart(2, "0")}`;
      decadeMap.set(decadeLabel, (decadeMap.get(decadeLabel) ?? 0) + 1);

      if (i > 0 && sorted[i - 1] === n - 1) hasConsecutive = true;
    }
    if (hasConsecutive) drawsWithConsecutive += 1;

    for (const pair of combinations(sorted, 2)) {
      const key = pair.join("-");
      const existing = pairCounts.get(key);
      pairCounts.set(key, { numbers: pair as [number, number], count: (existing?.count ?? 0) + 1 });
    }
    for (const trio of combinations(sorted, 3)) {
      const key = trio.join("-");
      const existing = trioCounts.get(key);
      trioCounts.set(key, { numbers: trio as [number, number, number], count: (existing?.count ?? 0) + 1 });
    }
  }

  const frequencies: NumberFrequency[] = Array.from(frequencyMap.entries())
    .map(([number, count]) => ({
      number,
      count,
      percentage: totalDraws > 0 ? Math.round((count / totalDraws) * 1000) / 10 : 0,
    }))
    .sort((a, b) => a.number - b.number);

  const byCountDesc = [...frequencies].sort((a, b) => b.count - a.count || a.number - b.number);
  const hot = byCountDesc.slice(0, TOP_LIST_SIZE);
  const cold = [...frequencies].sort((a, b) => a.count - b.count || a.number - b.number).slice(0, TOP_LIST_SIZE);

  const delays: NumberDelay[] = [];
  for (let n = min; n <= max; n += 1) {
    const index = draws.findIndex((draw) => draw.numbers.includes(n));
    delays.push({
      number: n,
      delay: index === -1 ? totalDraws : index,
      lastAppearance: index === -1 ? null : (dates[index] ?? null),
    });
  }
  delays.sort((a, b) => a.number - b.number);

  const decadeStarts: string[] = [];
  for (let start = min; start <= max; start += 10) {
    const end = Math.min(start + 9, max);
    decadeStarts.push(`${String(start).padStart(2, "0")}-${String(end).padStart(2, "0")}`);
  }
  const decades: DecadeBucket[] = decadeStarts.map((decade) => ({ decade, count: decadeMap.get(decade) ?? 0 }));

  const topPairs: NumberPair[] = Array.from(pairCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_LIST_SIZE);
  const topTrios: NumberTrio[] = Array.from(trioCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_LIST_SIZE);

  return {
    game: config.id,
    totalDraws,
    dateRange: {
      from: dates.length > 0 ? dates[dates.length - 1]! : null,
      to: dates.length > 0 ? dates[0]! : null,
    },
    frequencies,
    hot,
    cold,
    delays,
    oddEven: { odd: oddCount, even: evenCount },
    decades,
    averageSum: totalDraws > 0 ? Math.round((sumTotal / totalDraws) * 100) / 100 : 0,
    topPairs,
    topTrios,
    consecutive: {
      drawsWithConsecutive,
      percentage: totalDraws > 0 ? Math.round((drawsWithConsecutive / totalDraws) * 1000) / 10 : 0,
    },
  };
}

export class StatisticsService {
  constructor(private readonly drawRepository: DrawRepository) {}

  async getStatistics(input: unknown): Promise<StatisticsResponse> {
    const query = parseStatisticsQuery(input);
    const config = requireGameConfig(query.game);
    const draws = await this.drawRepository.listAllMatching(query);
    return computeStatistics(config, draws);
  }
}
