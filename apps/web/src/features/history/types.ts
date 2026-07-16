import type { Bet } from "@/types/bet";
import type { Draw } from "@/types/draw";

export type HistoryEntry = { kind: "draw"; date: string; draw: Draw } | { kind: "bet"; date: string; bet: Bet };
