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
  compact,
}: {
  bet: Bet;
  gameLabel?: string;
  extrasConfig?: ExtraFieldConfig[];
  to?: string;
  actions?: ReactNode;
  compact?: boolean;
}) {
  const header = (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <GameBadge game={bet.game} label={gameLabel} />
        <span className="font-medium text-slate-900 dark:text-slate-100">{bet.label || "Apuesta sin nombre"}</span>
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400">{formatTimestamp(bet.createdAt)}</span>
    </div>
  );

  return (
    <Card>
      <CardContent className="pt-4">
        {to ? (
          <Link
            to={to}
            className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
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
        {actions && <div className="mt-3 flex items-center gap-2">{actions}</div>}
      </CardContent>
    </Card>
  );
}
