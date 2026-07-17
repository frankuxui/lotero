import type { BetRepository } from "../bets/bet.repository.js";
import type { DrawRepository } from "../draws/draw.repository.js";
import { parseComparisonRequest } from "./comparison.schemas.js";
import type { ComparisonRecordType, ComparisonRequest, ComparisonResponse, ComparisonResult } from "./comparison.types.js";

interface Candidate {
  recordId: string;
  recordType: ComparisonRecordType;
  betId?: string;
  game: string;
  date: string;
  numbers: number[];
  extras: Record<string, unknown>;
}

export class ComparisonService {
  constructor(
    private readonly drawRepository: DrawRepository,
    private readonly betRepository: BetRepository,
  ) {}

  async compare(input: unknown): Promise<ComparisonResponse> {
    const request = parseComparisonRequest(input);
    return this.compareRequest(request);
  }

  /** Uso interno (p. ej. dashboard) con un request ya validado, sin volver a parsear. */
  async compareRequest(request: ComparisonRequest): Promise<ComparisonResponse> {
    const candidates = await this.loadCandidates(request);
    const scored = candidates.map((candidate) => this.score(request, candidate));

    const filtered =
      request.minMatches !== undefined ? scored.filter((result) => result.totalMatches >= request.minMatches!) : scored;

    filtered.sort((a, b) => b.totalMatches - a.totalMatches || b.percentage - a.percentage);
    const ranked = filtered.map((result, index) => ({ ...result, ranking: index + 1 }));

    return {
      results: ranked,
      meta: { total: ranked.length, game: request.game, numbers: request.numbers, source: request.source },
    };
  }

  private async loadCandidates(request: ComparisonRequest): Promise<Candidate[]> {
    if (request.source === "bets") {
      const bets = await this.betRepository.listAllMatching({ game: request.game });
      const candidates = bets.flatMap((bet) =>
        bet.lines.map((line) => ({
          recordId: line.id,
          recordType: "bet-line" as const,
          betId: bet.id,
          game: bet.game,
          date: bet.createdAt,
          numbers: line.numbers,
          extras: line.extras,
        })),
      );
      return candidates.filter((candidate) => this.withinDateRange(candidate.date, request));
    }

    const draws = await this.drawRepository.listAllMatching({
      game: request.game,
      dateFrom: request.dateFrom,
      dateTo: request.dateTo,
    });
    return draws.map((draw) => ({
      recordId: draw.id,
      recordType: "draw" as const,
      game: draw.game,
      date: draw.drawDate,
      numbers: draw.numbers,
      extras: draw.extras,
    }));
  }

  private withinDateRange(date: string, request: ComparisonRequest): boolean {
    if (request.dateFrom && date < request.dateFrom) return false;
    if (request.dateTo && date > request.dateTo) return false;
    return true;
  }

  private score(request: ComparisonRequest, candidate: Candidate): ComparisonResult {
    const inputSet = new Set(request.numbers);
    const matches = candidate.numbers.filter((n) => inputSet.has(n)).sort((a, b) => a - b);
    const matchSet = new Set(matches);
    const nonMatches = request.numbers.filter((n) => !matchSet.has(n)).sort((a, b) => a - b);
    const inputSum = request.numbers.reduce((a, b) => a + b, 0);
    const candidateSum = candidate.numbers.reduce((a, b) => a + b, 0);

    return {
      recordId: candidate.recordId,
      recordType: candidate.recordType,
      ...(candidate.betId !== undefined && { betId: candidate.betId }),
      game: candidate.game,
      date: candidate.date,
      numbers: candidate.numbers,
      extras: candidate.extras,
      matches,
      nonMatches,
      totalMatches: matches.length,
      percentage: Math.round((matches.length / request.numbers.length) * 1000) / 10,
      sumDifference: inputSum - candidateSum,
      ranking: 0,
    };
  }
}
