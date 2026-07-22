import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
import { formatDateLong, formatPlainDate } from "@/lib/formatters/date";
import { findGameConfig } from "@/lib/games";
import { useSettingsStore } from "@/store/settingsStore";
import { CalendarDays } from "lucide-react";

export default function StatisticsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultGameSetting = useSettingsStore((state) => state.defaultGame);
  const dateFormat = useSettingsStore((state) => state.dateFormat);
  const [gameOverride, setGameOverride] = useState<string | null>(null);

  const gamesQuery = useGames();
  const games = useMemo(() => gamesQuery.data ?? [], [gamesQuery.data]);

  const urlGame = searchParams.get("game");
  const initialGame = (urlGame && findGameConfig(games, urlGame) ? urlGame : undefined) ?? (defaultGameSetting && findGameConfig(games, defaultGameSetting) ? defaultGameSetting : games[0]?.id);
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
    <div className="w-full max-w-5xl mx-auto">
      <PageHeader
        title="Estadísticas"
        description="Frecuencias, calientes/fríos y patrones más comunes de los sorteos."
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Graph-Bar-Increase-Square--Streamline-Flex-Gradient" className="size-14">
            <g>
              <path
                id="Subtract"
                fill="url(#7634xs)"
                fillRule="evenodd"
                d="M3.65727.474686C4.73112.35499 5.85168.25 7 .25s2.26888.10499 3.3427.224686c1.672.186363 3.0154 1.528614 3.1946 3.203594.1143 1.0683.2127 2.18136.2127 3.32172 0 1.14035-.0984 2.25341-.2127 3.3217-.1792 1.675-1.5226 3.0173-3.1946 3.2036C9.26888 13.645 8.14832 13.75 7 13.75c-1.14832 0-2.26888-.105-3.34273-.2247C1.98532 13.339.641908 11.9967.462704 10.3217.348408 9.25341.25 8.14035.25 7c0-1.14036.098408-2.25342.212704-3.32172C.641907 2.0033 1.98532.661049 3.65727.474686Zm5.7262 9.748414c-.22644-.0404-.38303-.24299-.38308-.47301C9.00025 9.10172 9 7.79641 9 7.00005c0-.77088.03095-1.52305.06081-2.24863l.00558-.13583c.01834-.44736.32726-.84997.77316-.8905.19335-.01757.37785-.01757.57115 0 .4459.04053.7548.44314.7731.8905l.0056.13572c.0299.72558.0608 1.47786.0608 2.24874 0 .77093-.0309 1.52313-.0608 2.24875-.0071.17276-.0142.34427-.0207.5139-.0086.2237-.1634.4181-.3837.4581-.4915.0891-.91125.0899-1.40153.0023Zm-3.50838-.45795c-.00005.24445.17655.45505.41951.48225.48264.0542.92879.0542 1.41143 0 .24291-.0272.4195-.2377.4195-.48216v-1.6994c0-.45001-.02309-.89058-.04862-1.31828-.02803-.46951-.37675-.87463-.8465-.89812-.15488-.00775-.3051-.00775-.45998 0-.46975.02349-.81846.42861-.8465.89812-.02553.4277-.04862.86827-.04862 1.31828l-.00022 1.69931Zm-2.61533.49755c-.2405-.0175-.42916-.2116-.45238-.45161-.02875-.29723-.05738-.60479-.05738-.9197 0-.17071.00841-.33926.0207-.50518.03561-.48095.42243-.87546.90451-.88869.13429-.00369.26551-.00369.39981 0 .48208.01323.86889.40774.90451.88869.01228.16592.0207.33447.0207.50518v.8838c0 .25601-.19335.47211-.44872.49001-.44789.0312-.84102.0304-1.29175-.0025Z"
                clipRule="evenodd"
              ></path>
            </g>
            <defs>
              <linearGradient id="7634xs" x1="2.457" x2="13.36" y1="2.846" y2="8.887" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffd600"></stop>
                <stop offset="1" stopColor="#00d078"></stop>
              </linearGradient>
            </defs>
          </svg>
        }
      />

      <div className="w-full mt-8">
        <FilterBar>
          <div className="flex flex-col gap-4">
            <Label htmlFor="stats-game">Juego</Label>
            <GameSelector id="stats-game" games={games} value={game} onChange={setGameOverride} />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="stats-from">Desde</Label>
            <Input id="stats-from" type="date" value={dateFrom} max={dateTo || undefined} onChange={(event) => setParam("dateFrom", event.target.value)} />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="stats-to">Hasta</Label>
            <Input id="stats-to" type="date" value={dateTo} min={dateFrom || undefined} onChange={(event) => setParam("dateTo", event.target.value)} />
          </div>
        </FilterBar>
      </div>

      {statsQuery.isPending && <LoadingState />}

      {statsQuery.isError && <ErrorState message="No se pudieron cargar las estadísticas." onRetry={() => void statsQuery.refetch()} />}

      {data && data.totalDraws === 0 && <EmptyState title="Sin sorteos para este juego" description="Registra sorteos para ver estadísticas." />}

      {data && data.totalDraws > 0 && (
        <div className="flex flex-col">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-12">
            <StatisticCard className="col-span-1 xl:col-span-2" label="Sorteos analizados" value={data.totalDraws} />
            <StatisticCard className="col-span-1 xl:col-span-2" label="Suma media" value={data.averageSum} />
            <StatisticCard className="col-span-2 xl:col-span-3" label="Con consecutivos" value={`${data.consecutive.percentage}%`} description={`${data.consecutive.drawsWithConsecutive} sorteos`} />
            <StatisticCard
              className="col-span-2 xl:col-span-5"
              label="Rango"
              value={
                <div className="flex w-full items-center justify-between gap-4 mt-3">
                  <div className="flex items-center gap-4">
                    <span className="size-11 rounded-full inline-flex items-center justify-center flex-none bg-foreground/10">
                      <CalendarDays className="size-5" strokeWidth="1.5" />
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-foreground/80">Desde</span>
                      <span className="text-xs font-semibold text-foreground/80">{formatPlainDate(data.dateRange.from ?? "", dateFormat)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="size-11 rounded-full inline-flex items-center justify-center flex-none bg-foreground/10">
                      <CalendarDays className="size-5" strokeWidth="1.5" />
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-foreground/80">Hasta</span>
                      <span className="text-xs font-semibold text-foreground/80">{formatPlainDate(data.dateRange.to ?? "", dateFormat)}</span>
                    </div>
                  </div>
                </div>
              }
            />
          </div>

          <section className="mt-8">
            <SectionHeader title="Mapa de frecuencias" description="Cuántas veces salió cada número." />
            <div className="mt-4">
              <FrequencyLegend />
            </div>
            <div className="w-full mt-8">
              <FrequencyHeatmap frequencies={data.frequencies} />
            </div>
          </section>

          <section className="mt-8">
            <SectionHeader title="Números calientes y fríos" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Card>
                <CardContent className="w-full">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">🔥 Calientes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.hot.map((item) => (
                      <NumberBadge key={item.number} value={item.number} variant="match" />
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="w-full">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">🧊 Fríos</p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.cold.map((item) => (
                      <NumberBadge key={item.number} value={item.number} variant="muted" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mt-8">
            <SectionHeader title="Más atrasados" description="Números con más sorteos desde su última aparición." />
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {topDelays.map((item) => (
                <div key={item.number} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 dark:border-slate-800">
                  <NumberBadge value={item.number} size="sm" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">{item.delay} sorteos</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <SectionHeader title="Distribución" />
            <div className="grid gap-6 sm:grid-cols-2">
              <Card>
                <CardContent className="flex flex-col gap-3 pt-4">
                  <StatBar label="Pares" value={data.oddEven.even} total={data.oddEven.odd + data.oddEven.even} />
                  <StatBar label="Impares" value={data.oddEven.odd} total={data.oddEven.odd + data.oddEven.even} />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col gap-3">
                  {data.decades.map((decade) => (
                    <StatBar key={decade.decade} label={decade.decade} value={decade.count} total={data.decades.reduce((acc, d) => acc + d.count, 0)} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>

          {data.extraFrequencies.length > 0 && (
            <section className="mt-8">
              <SectionHeader title="Extras más frecuentes" description="Complementario, reintegro y joker con más apariciones." />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.extraFrequencies.map((extra) => (
                  <Card key={extra.key}>
                    <CardContent className="flex flex-col gap-2 ">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{extra.label}</p>
                      {extra.top.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">Sin datos.</p>}
                      {extra.top.map((item) => (
                        <div key={item.value} className="flex items-center justify-between">
                          {extra.type === "number" ? <NumberBadge value={item.value as number} size="sm" variant="extra" /> : <span className="text-sm font-medium tabular-nums">{item.value}</span>}
                          <span className="text-sm text-slate-500 dark:text-slate-400">{item.count} veces</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <section className="mt-8">
            <SectionHeader title="Pares y tríos más frecuentes" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Card>
                <CardContent className="flex flex-col gap-2 ">
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

          <section className="mt-8">
            <SectionHeader
              title="Tus combinaciones más cercanas a su sorteo"
              description="Números completos que jugaste y su acierto frente al sorteo más próximo en fecha para el que se jugaron."
            />
            {data.closestBetMatches.length === 0 ? (
              <EmptyState title="Sin apuestas para comparar" description="Registra apuestas de este juego para ver aquí tus combinaciones más cercanas." />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 mt-8">
                {data.closestBetMatches.map((match) => {
                  const matchSet = new Set(match.matches);
                  return (
                    <Link key={`${match.betId}-${match.lineId}`} to={`/bets/${match.betId}`} className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
                      <Card>
                        <CardContent className="w-full">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {match.betLabel || "Apuesta sin nombre"} · {formatDateLong(match.playedAt, dateFormat)}
                            </span>
                            <span className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-xs font-semibold">
                              {match.totalMatches}/{match.numbers.length}
                            </span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {match.numbers.map((n) => (
                              <NumberBadge key={n} value={n} variant={matchSet.has(n) ? "match" : "muted"} size="sm" />
                            ))}
                          </div>
                          <p className="mt-2 text-xs text-foreground/80">
                            {match.percentage}% de aciertos frente al sorteo del {formatPlainDate(match.drawDate, dateFormat)}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
