import type { ComparisonRequest } from "@/types/comparison";
import type { ListBetsQuery } from "@/types/bet";
import type { ListDrawsQuery } from "@/types/draw";
import type { StatisticsQuery } from "@/types/statistics";
import type { ListSuggestionsQuery } from "@/types/suggestion";

export const queryKeys = {
  games: {
    all: ["games"] as const,
    detail: (id: string) => ["games", "detail", id] as const,
  },
  draws: {
    all: ["draws"] as const,
    list: (query: ListDrawsQuery) => ["draws", "list", query] as const,
    detail: (id: string) => ["draws", "detail", id] as const,
  },
  bets: {
    all: ["bets"] as const,
    list: (query: ListBetsQuery) => ["bets", "list", query] as const,
    detail: (id: string) => ["bets", "detail", id] as const,
  },
  statistics: {
    all: ["statistics"] as const,
    detail: (query: StatisticsQuery) => ["statistics", "detail", query] as const,
  },
  numbers: {
    all: ["numbers"] as const,
    detail: (number: number, game?: string) => ["numbers", "detail", number, game ?? null] as const,
  },
  comparison: {
    all: ["comparison"] as const,
    result: (request: ComparisonRequest) => ["comparison", "result", request] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
  },
  suggestions: {
    all: ["suggestions"] as const,
    today: ["suggestions", "today"] as const,
    list: (query: ListSuggestionsQuery) => ["suggestions", "list", query] as const,
  },
};
