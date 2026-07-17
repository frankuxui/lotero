import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { GameBadge } from "@/components/shared/GameBadge";
import { Card, CardContent } from "@/components/ui/card";
import { BetLineCard } from "@/features/bets/components/BetLineCard";
import { formatTimestamp } from "@/lib/formatters/date";
import type { Bet } from "@/types/bet";
import type { ExtraFieldConfig } from "@/types/game";

export function BetCard({
  bet,
  gameLabel,
  extrasConfig,
  to,
  actions,
  compact
}: {
  bet: Bet;
  gameLabel?: string;
  extrasConfig?: ExtraFieldConfig[];
  to?: string;
  actions?: ReactNode;
  compact?: boolean;
}) {
  const header = (
    <div className="flex items-start w-full justify-between flex-col gap-2">
      <div className="flex items-center w-full justify-between gap-2">
        <GameBadge game={bet.game} label={gameLabel} className="py-1 px-3" />
        <span className="font-medium text-xs text-foreground/60">{formatTimestamp(bet.createdAt)}</span>
      </div>
      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{bet.label || "Apuesta sin nombre"}</span>
    </div>
  );

  return (
    <Card>
      <CardContent className="w-full">
        {to ? (
          <Link to={to} className="block w-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
            {header}
          </Link>
        ) : (
          header
        )}
        {compact ? (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {bet.lines.length} {bet.lines.length === 1 ? "línea" : "líneas"}
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {bet.lines.map((line) => (
              <BetLineCard key={line.id} line={line} extrasConfig={extrasConfig} />
            ))}
          </div>
        )}
        {actions && <div className="mt-3 flex items-center gap-2 w-full">{actions}</div>}
      </CardContent>
    </Card>
  );
}
