import { BarChart3, Hash, GitCompare, PlusCircle, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { GameBadge } from "@/components/shared/GameBadge";
import { NumberBadge } from "@/components/shared/NumberBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BetCard } from "@/features/bets/components/BetCard";
import { ComparisonResultCard } from "@/features/comparison/components/ComparisonResultCard";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { DrawCard } from "@/features/draws/components/DrawCard";
import { StatisticCard } from "@/features/statistics/components/StatisticCard";
import { gameLabel } from "@/lib/games";
import { useGames } from "@/hooks/useGames";

const QUICK_ACTIONS = [
  { to: "/bets/new", label: "Nueva apuesta", icon: PlusCircle },
  { to: "/draws/new", label: "Nuevo sorteo", icon: Ticket },
  { to: "/compare", label: "Comparar combinación", icon: GitCompare },
  { to: "/numbers", label: "Buscar número", icon: Hash },
];

export default function DashboardPage() {
  const gamesQuery = useGames();
  const dashboardQuery = useDashboard();

  const games = gamesQuery.data ?? [];
  const isPending = dashboardQuery.isPending || gamesQuery.isPending;
  const isError = dashboardQuery.isError || gamesQuery.isError;

  return (
    <>
      <PageHeader title="Inicio" description="Resumen de tu actividad en Lotero." />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_ACTIONS.map((action) => (
          <Button key={action.to} asChild variant="outline" className="h-auto flex-col gap-2 py-4">
            <Link to={action.to}>
              <action.icon className="size-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              <span className="text-xs font-medium">{action.label}</span>
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
        <div className="flex flex-col gap-8">
          <section>
            <SectionHeader title="Resumen" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatisticCard
                label="Sorteos registrados"
                value={dashboardQuery.data.quickStats.totalDraws}
                icon={<BarChart3 className="size-5" aria-hidden="true" />}
              />
              <StatisticCard
                label="Apuestas registradas"
                value={dashboardQuery.data.quickStats.totalBets}
                icon={<Ticket className="size-5" aria-hidden="true" />}
              />
              <Card className="col-span-2 sm:col-span-1">
                <CardContent className="pt-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Por juego
                  </p>
                  <div className="flex flex-col gap-1.5">
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
            <SectionHeader title="Últimos sorteos" actions={<Link to="/draws" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">Ver todos</Link>} />
            {dashboardQuery.data.recentDraws.length === 0 ? (
              <EmptyState title="Todavía no hay sorteos registrados" />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {dashboardQuery.data.recentDraws.map((draw) => (
                  <DrawCard
                    key={draw.id}
                    draw={draw}
                    gameLabel={gameLabel(games, draw.game)}
                    to={`/draws/${draw.id}`}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <SectionHeader title="Últimas apuestas" actions={<Link to="/bets" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">Ver todas</Link>} />
            {dashboardQuery.data.recentBets.length === 0 ? (
              <EmptyState title="Todavía no has registrado apuestas" />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
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
              <div className="grid gap-3 sm:grid-cols-2">
                {dashboardQuery.data.recentMatches.map((match) => (
                  <ComparisonResultCard
                    key={`${match.betId}-${match.recordId}`}
                    result={match}
                    gameLabel={gameLabel(games, match.game)}
                    to={`/bets/${match.betId}`}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <SectionHeader title="Números calientes y fríos" />
            {dashboardQuery.data.numbersByGame.length === 0 ? (
              <EmptyState title="Aún no hay datos suficientes" />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {dashboardQuery.data.numbersByGame.map((entry) => (
                  <Card key={entry.game}>
                    <CardContent className="pt-4">
                      <GameBadge game={entry.game} label={gameLabel(games, entry.game)} />
                      <p className="mt-3 mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">Calientes</p>
                      <div className="flex flex-wrap gap-1.5">
                        {entry.hot.map((item) => (
                          <NumberBadge key={item.number} value={item.number} variant="match" size="sm" />
                        ))}
                      </div>
                      <p className="mt-3 mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">Fríos</p>
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
    </>
  );
}
