import { Ticket, Boxes, PackageCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { GameBadge } from "@/components/shared/GameBadge";
import { NumberBadge } from "@/components/shared/NumberBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui";
import { BetCard } from "@/features/bets/components/BetCard";
import { ComparisonResultCard } from "@/features/comparison/components/ComparisonResultCard";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { DrawCard } from "@/features/draws/components/DrawCard";
import { StatisticCard } from "@/features/statistics/components/StatisticCard";
import { TodaySuggestionCard } from "@/features/suggestions/components/TodaySuggestionCard";
import { useTodaySuggestions } from "@/features/suggestions/hooks/useTodaySuggestions";
import { findGameConfig, gameLabel } from "@/lib/games";
import { useGames } from "@/hooks/useGames";
import { AddCircle16, CalendarCheckmark16, Home16, Org48, SearchSparkle16 } from "@/components/icons";

const QUICK_ACTIONS = [
  { to: "/bets/new", label: "Nueva apuesta", icon: AddCircle16 },
  { to: "/draws/new", label: "Nuevo sorteo", icon: CalendarCheckmark16 },
  { to: "/compare", label: "Comparar combinación", icon: Org48 },
  { to: "/numbers", label: "Buscar número", icon: SearchSparkle16 }
];

export default function DashboardPage() {
  const gamesQuery = useGames();
  const dashboardQuery = useDashboard();
  const suggestionsQuery = useTodaySuggestions();

  const games = gamesQuery.data ?? [];
  const isPending = dashboardQuery.isPending || gamesQuery.isPending;
  const isError = dashboardQuery.isError || gamesQuery.isError;

  return (
    <div className="flex flex-col mx-auto w-full max-w-5xl">
      <PageHeader title="Inicio" description="Resumen de toda la actividad reciente en Lotero, incluyendo sorteos, apuestas y sugerencias." icon={<Home16 className="size-14" />} />

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 mt-8">
        {QUICK_ACTIONS.map((action) => (
          <Button key={action.to} asChild variant="outline" className="h-auto flex-col gap-1 py-3 px-6 min-h-22 rounded-xl border-0 bg-foreground/4 text-foreground hover:bg-foreground/10">
            <Link to={action.to}>
              <action.icon className="size-7" aria-hidden="true" />
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          </Button>
        ))}
      </div>

      {isPending && <SkeletonCard count={4} />}

      {isError && !isPending && (
        <ErrorState
          message="No se pudo cargar el panel de inicio."
          onRetry={() => {
            void dashboardQuery.refetch();
            void gamesQuery.refetch();
          }}
        />
      )}

      {!isPending && !isError && dashboardQuery.data && (
        <div className="flex flex-col gap-10">
          <section>
            <SectionHeader
              title="Sugerencia del día"
              description="Generada por el sistema a partir de sorteos recientes, coincidencias de fecha y frecuencia histórica."
              actions={
                <Link to="/suggestions" className="text-sm font-medium rounded-full inline-flex items-center justify-baseline bg-foreground text-background h-9 px-4">
                  Ver histórico
                </Link>
              }
            />
            {suggestionsQuery.isPending && <SkeletonCard count={2} />}
            {suggestionsQuery.isError && !suggestionsQuery.isPending && <ErrorState message="No se pudo cargar la sugerencia del día." onRetry={() => void suggestionsQuery.refetch()} />}
            {suggestionsQuery.data && suggestionsQuery.data.length === 0 && (
              <EmptyState title="Todavía no hay sugerencia" description="Se genera automáticamente en cuanto haya sorteos registrados." />
            )}
            {suggestionsQuery.data && suggestionsQuery.data.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 mt-6">
                {suggestionsQuery.data.map((suggestion) => (
                  <TodaySuggestionCard key={suggestion.game} suggestion={suggestion} gameLabel={gameLabel(games, suggestion.game)} extrasConfig={findGameConfig(games, suggestion.game)?.extras} />
                ))}
              </div>
            )}
          </section>

          <section>
            <SectionHeader title="Resumen" description="Estadísticas rápidas de tu actividad en Lotero." />
            <div className="grid gap-3 sm:grid-cols-3 mt-8">
              <StatisticCard
                label="Sorteos registrados"
                description="Número total de sorteos registrados"
                value={dashboardQuery.data.quickStats.totalDraws}
                icon={<Boxes className="size-7" strokeWidth="1" aria-hidden="true" />}
              />
              <StatisticCard
                label="Apuestas registradas"
                description="Número total de apuestas registradas"
                value={dashboardQuery.data.quickStats.totalBets}
                icon={<PackageCheck className="size-7" strokeWidth="1" aria-hidden="true" />}
              />
              <Card>
                <CardContent className="flex items-start flex-col justify-between gap-3">
                  <div className="w-full flex items-center justify-between gap-6">
                    <div className="flex-1 grid gap-0.5">
                      <h3 className="text-xs font-medium uppercase tracking-wide">Por juego</h3>
                      <p className="text-xs">Sorteos y apuestas registrados por juego</p>
                    </div>
                    <div className="flex-none text-indigo-600 dark:text-indigo-400">
                      <Ticket className="size-7" strokeWidth="1" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    {dashboardQuery.data.quickStats.byGame.map((entry) => (
                      <div key={entry.game} className="flex items-center justify-between gap-2 text-sm">
                        <GameBadge game={entry.game} label={gameLabel(games, entry.game)} />
                        <span className="text-slate-600 dark:text-slate-300">
                          {entry.draws} sorteos · {entry.bets} apuestas
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <SectionHeader
              title="Últimos sorteos"
              description="Sorteos registrados recientemente en el sistema."
              actions={
                <Link to="/draws" className="text-sm font-medium rounded-full inline-flex items-center justify-baseline bg-foreground text-background h-9 px-4">
                  Ver todos
                </Link>
              }
            />
            {dashboardQuery.data.recentDraws.length === 0 ? (
              <EmptyState title="Todavía no hay sorteos registrados" />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 mt-8">
                {dashboardQuery.data.recentDraws.map((draw) => (
                  <DrawCard key={draw.id} draw={draw} gameLabel={gameLabel(games, draw.game)} to={`/draws/${draw.id}`} />
                ))}
              </div>
            )}
          </section>

          <section>
            <SectionHeader
              title="Últimas apuestas"
              description="Apuestas registradas recientemente en el sistema."
              actions={
                <Link to="/bets" className="text-sm font-medium rounded-full inline-flex items-center justify-baseline bg-foreground text-background h-9 px-4">
                  Ver todas
                </Link>
              }
            />
            {dashboardQuery.data.recentBets.length === 0 ? (
              <EmptyState title="Todavía no has registrado apuestas" description="Las apuestas que realices aparecerán aquí al registrarlas." />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 mt-8">
                {dashboardQuery.data.recentBets.map((bet) => (
                  <BetCard key={bet.id} bet={bet} gameLabel={gameLabel(games, bet.game)} to={`/bets/${bet.id}`} compact />
                ))}
              </div>
            )}
          </section>

          <section>
            <SectionHeader title="Coincidencias recientes" description="Mejores aciertos entre tus apuestas y los últimos sorteos." />
            {dashboardQuery.data.recentMatches.length === 0 ? (
              <EmptyState title="Sin coincidencias todavía" description="Registra sorteos y apuestas para ver comparaciones aquí." />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 mt-8">
                {dashboardQuery.data.recentMatches.map((match, index) => (
                  <ComparisonResultCard key={`${match.betId}-${match.recordId}-${index}`} result={match} gameLabel={gameLabel(games, match.game)} to={`/bets/${match.betId}`} />
                ))}
              </div>
            )}
          </section>

          <section>
            <SectionHeader title="Números calientes y fríos" description="Análisis de los números más frecuentes y menos frecuentes en los últimos sorteos." />
            {dashboardQuery.data.numbersByGame.length === 0 ? (
              <EmptyState title="Aún no hay datos suficientes" />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 mt-8">
                {dashboardQuery.data.numbersByGame.map((entry) => (
                  <Card key={entry.game}>
                    <CardContent className="w-full">
                      <GameBadge game={entry.game} label={gameLabel(games, entry.game)} />
                      <p className="mt-3 mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">🔥 Calientes</p>
                      <div className="flex flex-wrap gap-1.5">
                        {entry.hot.map((item) => (
                          <NumberBadge key={item.number} value={item.number} variant="match" size="sm" />
                        ))}
                      </div>
                      <p className="mt-3 mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">🧊 Fríos</p>
                      <div className="flex flex-wrap gap-1.5">
                        {entry.cold.map((item) => (
                          <NumberBadge key={item.number} value={item.number} variant="muted" size="sm" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
