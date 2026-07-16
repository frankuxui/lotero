import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { GameBadge } from "@/components/shared/GameBadge";
import { NumberBadge } from "@/components/shared/NumberBadge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPlainDate } from "@/lib/formatters/date";
import { useSettingsStore } from "@/store/settingsStore";
import type { Draw } from "@/types/draw";
import type { ExtraFieldConfig } from "@/types/game";

export function DrawCard({
  draw,
  gameLabel,
  extrasConfig,
  to,
  actions,
}: {
  draw: Draw;
  gameLabel?: string;
  extrasConfig?: ExtraFieldConfig[];
  to?: string;
  actions?: ReactNode;
}) {
  const dateFormat = useSettingsStore((state) => state.dateFormat);

  const content = (
    <>
      <div className="flex items-center justify-between gap-2">
        <GameBadge game={draw.game} label={gameLabel} />
        <span className="text-sm text-slate-500 dark:text-slate-400">{formatPlainDate(draw.drawDate, dateFormat)}</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {draw.numbers.map((n) => (
          <NumberBadge key={n} value={n} />
        ))}
        {extrasConfig?.map((extra) => {
          const raw = draw.extras[extra.key];
          if (raw === undefined || raw === null || raw === "") return null;
          return (
            <span key={extra.key} className="ml-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">{extra.label}:</span>
              {typeof raw === "number" ? (
                <NumberBadge value={raw} size="sm" variant="extra" />
              ) : (
                <span>{String(raw)}</span>
              )}
            </span>
          );
        })}
      </div>
    </>
  );

  return (
    <Card>
      <CardContent className="pt-4">
        {to ? (
          <Link
            to={to}
            className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            {content}
          </Link>
        ) : (
          content
        )}
        {actions && <div className="mt-3 flex items-center gap-2">{actions}</div>}
      </CardContent>
    </Card>
  );
}
