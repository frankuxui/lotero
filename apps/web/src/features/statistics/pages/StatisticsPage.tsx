import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterBar } from "@/components/shared/FilterBar";
import { GameSelector } from "@/components/shared/GameSelector";
import { LoadingState } from "@/components/shared/LoadingState";
import { NumberBadge } from "@/components/shared/NumberBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FrequencyHeatmap } from "@/features/statistics/components/FrequencyHeatmap";
import { FrequencyLegend } from "@/features/statistics/components/FrequencyLegend";
import { StatBar } from "@/features/statistics/components/StatBar";
import { StatisticCard } from "@/features/statistics/components/StatisticCard";
import { useStatistics } from "@/features/statistics/hooks/useStatistics";
import { useGames } from "@/hooks/useGames";
import { formatPlainDate } from "@/lib/formatters/date";
import { findGameConfig } from "@/lib/games";
import { useSettingsStore } from "@/store/settingsStore";

export default function StatisticsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultGameSetting = useSettingsStore((state) => state.defaultGame);
  const dateFormat = useSettingsStore((state) => state.dateFormat);
  const [gameOverride, setGameOverride] = useState<string | null>(null);

  const gamesQuery = useGames();
  const games = useMemo(() => gamesQuery.data ?? [], [gamesQuery.data]);

  const urlGame = searchParams.get("game");
  const initialGame =
    (urlGame && findGameConfig(games, urlGame) ? urlGame : undefined) ??
    (defaultGameSetting && findGameConfig(games, defaultGameSetting) ? defaultGameSetting : games[0]?.id);
  const game = gameOverride ?? initialGame;

  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";

  const statsQuery = useStatistics({ game: game ?? "", dateFrom: dateFrom || undefined, dateTo: dateTo || undefined }, { enabled: Boolean(game) });

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  if (gamesQuery.isPending) {
    return (
      <>
        <PageHeader title="Estadísticas" description="Frecuencias, calientes/fríos y patrones de los sorteos." />
        <LoadingState />
      </>
    );
  }

  if (gamesQuery.isError || !game) {
    return (
      <>
        <PageHeader title="Estadísticas" description="Frecuencias, calientes/fríos y patrones de los sorteos." />
        <ErrorState message="No se pudieron cargar los juegos." onRetry={() => void gamesQuery.refetch()} />
      </>
    );
  }

  const data = statsQuery.data;
  const topDelays = data ? [...data.delays].sort((a, b) => b.delay - a.delay).slice(0, 15) : [];

  return (
    <>
      <PageHeader title="Estadísticas" description="Frecuencias, calientes/fríos y patrones de los sorteos." />

      <FilterBar>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stats-game">Juego</Label>
          <GameSelector id="stats-game" games={games} value={game} onChange={setGameOverride} className="w-48" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stats-from">Desde</Label>
          <Input
            id="stats-from"
            type="date"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(event) => setParam("dateFrom", event.target.value)}
            className="w-40"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stats-to">Hasta</Label>
          <Input
            id="stats-to"
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(event) => setParam("dateTo", event.target.value)}
            className="w-40"
          />
        </div>
      </FilterBar>

      {statsQuery.isPending && <LoadingState />}

      {statsQuery.isError && (
        <ErrorState message="No se pudieron cargar las estadísticas." onRetry={() => void statsQuery.refetch()} />
      )}

      {data && data.totalDraws === 0 && (
        <EmptyState title="Sin sorteos para este juego" description="Registra sorteos para ver estadísticas." />
      )}

      {data && data.totalDraws > 0 && (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatisticCard label="Sorteos analizados" value={data.totalDraws} />
            <StatisticCard label="Suma media" value={data.averageSum} />
            <StatisticCard label="Con consecutivos" value={`${data.consecutive.percentage}%`} description={`${data.consecutive.drawsWithConsecutive} sorteos`} />
            <StatisticCard label="Rango" value={`${formatPlainDate(data.dateRange.from ?? "", dateFormat)} – ${formatPlainDate(data.dateRange.to ?? "", dateFormat)}`} />
          </div>

          <section>
            <SectionHeader title="Mapa de frecuencias" description="Cuántas veces salió cada número." />
            <div className="mb-3">
              <FrequencyLegend />
            </div>
            <FrequencyHeatmap frequencies={data.frequencies} />
          </section>

          <section>
            <SectionHeader title="Números calientes y fríos" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Card>
                <CardContent className="pt-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Calientes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.hot.map((item) => (
                      <NumberBadge key={item.number} value={item.number} variant="match" />
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Fríos</p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.cold.map((item) => (
                      <NumberBadge key={item.number} value={item.number} variant="muted" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <SectionHeader title="Más atrasados" description="Números con más sorteos desde su última aparición." />
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {topDelays.map((item) => (
                <div
                  key={item.number}
                  className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 dark:border-slate-800"
                >
                  <NumberBadge value={item.number} size="sm" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">{item.delay} sorteos</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Distribución" />
            <div className="grid gap-6 sm:grid-cols-2">
              <Card>
                <CardContent className="flex flex-col gap-3 pt-4">
                  <StatBar label="Pares" value={data.oddEven.even} total={data.oddEven.odd + data.oddEven.even} />
                  <StatBar label="Impares" value={data.oddEven.odd} total={data.oddEven.odd + data.oddEven.even} />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col gap-3 pt-4">
                  {data.decades.map((decade) => (
                    <StatBar
                      key={decade.decade}
                      label={decade.decade}
                      value={decade.count}
                      total={data.decades.reduce((acc, d) => acc + d.count, 0)}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <SectionHeader title="Pares y tríos más frecuentes" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Card>
                <CardContent className="flex flex-col gap-2 pt-4">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Pares</p>
                  {data.topPairs.map((pair) => (
                    <div key={pair.numbers.join("-")} className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {pair.numbers.map((n) => (
                          <NumberBadge key={n} value={n} size="sm" />
                        ))}
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{pair.count} veces</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col gap-2 pt-4">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Tríos</p>
                  {data.topTrios.map((trio) => (
                    <div key={trio.numbers.join("-")} className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {trio.numbers.map((n) => (
                          <NumberBadge key={n} value={n} size="sm" />
                        ))}
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{trio.count} veces</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
