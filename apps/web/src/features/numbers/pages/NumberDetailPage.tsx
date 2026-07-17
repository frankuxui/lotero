import { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { GameBadge } from "@/components/shared/GameBadge";
import { GameSelector } from "@/components/shared/GameSelector";
import { LoadingState } from "@/components/shared/LoadingState";
import { NumberBadge } from "@/components/shared/NumberBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DrawCard } from "@/features/draws/components/DrawCard";
import { useNumberDetail } from "@/features/numbers/hooks/useNumberDetail";
import { StatBar } from "@/features/statistics/components/StatBar";
import { StatisticCard } from "@/features/statistics/components/StatisticCard";
import { useGames } from "@/hooks/useGames";
import { formatPlainDate, formatTimestamp } from "@/lib/formatters/date";
import { formatLotteryNumber } from "@/lib/formatters/number";
import { gameLabel } from "@/lib/games";
import { useSettingsStore } from "@/store/settingsStore";

export default function NumberDetailPage() {
  const { number: numberParam } = useParams<{ number: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dateFormat = useSettingsStore((state) => state.dateFormat);

  const gamesQuery = useGames();
  const games = useMemo(() => gamesQuery.data ?? [], [gamesQuery.data]);
  const game = searchParams.get("game") ?? "";

  const parsedNumber = Number(numberParam);
  const isValidNumber = Number.isInteger(parsedNumber) && parsedNumber > 0;

  const detailQuery = useNumberDetail(isValidNumber ? parsedNumber : undefined, game || undefined);

  const [numberInput, setNumberInput] = useState(numberParam ?? "");

  const breadcrumbs = [{ label: "Buscador de números", to: "/numbers" }, { label: numberParam ?? "" }];

  if (!isValidNumber) {
    return (
      <>
        <PageHeader title="Número inválido" breadcrumbs={breadcrumbs} />
        <EmptyState
          title="El parámetro de la URL no es un número válido"
          description="Debe ser un entero positivo, por ejemplo /numbers/23."
          action={
            <Button asChild size="sm">
              <Link to="/numbers">Ir al buscador</Link>
            </Button>
          }
        />
      </>
    );
  }

  const handleJump = () => {
    const value = Number(numberInput);
    if (Number.isInteger(value) && value > 0) {
      navigate(`/numbers/${value}${game ? `?game=${encodeURIComponent(game)}` : ""}`);
    }
  };

  const isPending = gamesQuery.isPending || detailQuery.isPending;
  const isError = gamesQuery.isError || detailQuery.isError;

  return (
    <div className="w-full mx-auto max-w-full sm:max-w-4xl">
      <PageHeader title={`Número ${formatLotteryNumber(parsedNumber)}`} breadcrumbs={breadcrumbs} />

      <div className="w-full max-w-full mb-6 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="number-jump">Ir a otro número</Label>
          <div className="flex gap-2">
            <Input id="number-jump" type="number" min={1} value={numberInput} onChange={(event) => setNumberInput(event.target.value)} className="w-28" />
            <button className="size-12 bg-background border border-border rounded inline-flex items-center justify-center flex-none font-semibold" onClick={handleJump}>
              Ir
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="number-game">Juego</Label>
          <GameSelector
            id="number-game"
            games={games}
            value={game}
            onChange={(value) => {
              const next = new URLSearchParams(searchParams);
              if (value) next.set("game", value);
              else next.delete("game");
              setSearchParams(next);
            }}
            allowAll
            allowAllLabel="Resolver automáticamente"
            className="w-56"
          />
        </div>
      </div>

      {isPending && <LoadingState />}

      {isError && <ErrorState message="No se pudo cargar la información de este número." onRetry={() => void detailQuery.refetch()} />}

      {detailQuery.data && (
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <NumberBadge value={detailQuery.data.number} size="lg" variant="match" />
            <GameBadge game={detailQuery.data.resolvedGame} label={gameLabel(games, detailQuery.data.resolvedGame)} />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatisticCard label="Frecuencia" value={`${detailQuery.data.frequency}%`} />
            <StatisticCard label="Retraso" value={detailQuery.data.delay} description="sorteos desde la última vez" />
            <StatisticCard label="Ranking" value={`#${detailQuery.data.ranking}`} />
            <StatisticCard label="Última aparición" value={detailQuery.data.lastAppearance ? formatPlainDate(detailQuery.data.lastAppearance.drawDate, dateFormat) : "—"} className="" />
          </div>

          <section>
            <SectionHeader title="Apariciones" description="Sorteos y apuestas en las que aparece este número." />
            <div className="grid gap-3 sm:grid-cols-2 mt-8">
              <StatisticCard label="En sorteos" value={detailQuery.data.appearances.draws} />
              <StatisticCard label="En apuestas" value={detailQuery.data.appearances.bets} />
            </div>
          </section>

          {detailQuery.data.byGame.length > 1 && (
            <section>
              <SectionHeader title="Distribución por juego" description="Distribución de apariciones de este número por juego." />
              <Card className="mt-8">
                <CardContent className="flex flex-col gap-3 pt-4">
                  {detailQuery.data.distributionByGame.map((entry) => (
                    <StatBar key={entry.game} label={gameLabel(games, entry.game)} value={entry.count} total={detailQuery.data!.distributionByGame.reduce((acc, e) => acc + e.count, 0)} />
                  ))}
                </CardContent>
              </Card>
            </section>
          )}

          <section>
            <SectionHeader title="Sorteos relacionados" description="Sorteos y apuestas en las que aparece este número." />
            {detailQuery.data.relatedDraws.length === 0 ? (
              <EmptyState title="Sin sorteos con este número" />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 mt-8">
                {detailQuery.data.relatedDraws.map((draw) => (
                  <DrawCard key={draw.id} draw={draw} gameLabel={gameLabel(games, draw.game)} to={`/draws/${draw.id}`} />
                ))}
              </div>
            )}
          </section>

          <section>
            <SectionHeader title="Apuestas relacionadas" description="Sorteos y apuestas en las que aparece este número." />
            {detailQuery.data.relatedBets.length === 0 ? (
              <EmptyState title="Sin apuestas con este número" className="mt-8" />
            ) : (
              <div className="grid gap-2 mt-8">
                {detailQuery.data.relatedBets.map((line) => (
                  <Link
                    key={line.lineId}
                    to={`/bets/${line.betId}`}
                    className="flex flex-wrap p-4 gap-2 sm:gap-8 rounded-lg items-center justify-between bg-background transition-all duration-200 hover:shadow-sm hover:shadow-foreground/10"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      {line.numbers.map((n) => (
                        <NumberBadge key={n} value={n} size="md" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {line.betLabel || "Apuesta sin nombre"} · {formatTimestamp(line.createdAt)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
