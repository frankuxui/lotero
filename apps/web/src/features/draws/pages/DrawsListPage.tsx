import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ConfirmActionDialog } from "@/components/shared/ConfirmActionDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterBar } from "@/components/shared/FilterBar";
import { GameSelector } from "@/components/shared/GameSelector";
import { PageHeader } from "@/components/shared/PageHeader";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DrawActions } from "@/features/draws/components/DrawActions";
import { DrawCard } from "@/features/draws/components/DrawCard";
import { DrawsTable } from "@/features/draws/components/DrawsTable";
import { useDrawsList } from "@/features/draws/hooks/useDrawsList";
import { useDeleteDraw } from "@/features/draws/hooks/useDrawMutations";
import { useGames } from "@/hooks/useGames";
import { findGameConfig, gameLabel } from "@/lib/games";
import { useSettingsStore } from "@/store/settingsStore";
import { toast } from "@/store/toastStore";
import type { Draw } from "@/types/draw";
import { CircleMultipleHintCheckmark16 } from "@/components/icons";

// La paginación y el filtrado por columnas de la tabla de escritorio pasan a ser
// client-side (TanStack Table) sobre este lote; el máximo permitido por la API basta
// para el volumen de sorteos manejado y evita "cargar todo el historial" sin límite.
const TABLE_FETCH_LIMIT = 200;

export default function DrawsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = useSettingsStore((state) => state.itemsPerPage);
  const viewModeSetting = useSettingsStore((state) => state.viewMode);
  const dateFormat = useSettingsStore((state) => state.dateFormat);
  const confirmBeforeDelete = useSettingsStore((state) => state.confirmBeforeDelete);

  const game = searchParams.get("game") ?? "";
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";

  const gamesQuery = useGames();
  const drawsQuery = useDrawsList({
    game: game || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    limit: TABLE_FETCH_LIMIT,
    offset: 0
  });
  const deleteMutation = useDeleteDraw();

  const [pendingDelete, setPendingDelete] = useState<Draw | null>(null);

  const games = useMemo(() => gamesQuery.data ?? [], [gamesQuery.data]);
  const showCardsOnly = viewModeSetting === "cards";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const deleteDraw = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast({ title: "Sorteo eliminado", variant: "success" });
        setPendingDelete(null);
      },
      onError: () => toast({ title: "No se pudo eliminar el sorteo", variant: "error" })
    });
  };

  const requestDelete = (draw: Draw) => {
    if (confirmBeforeDelete) {
      setPendingDelete(draw);
    } else {
      deleteDraw(draw.id);
    }
  };

  const handleDelete = () => {
    if (!pendingDelete) return;
    deleteDraw(pendingDelete.id);
  };

  return (
    <div className="w-full mx-auto max-w-6xl">
      <PageHeader
        title="Sorteos"
        description="Gestiona los sorteos oficiales registrados."
        icon={<CircleMultipleHintCheckmark16 className="size-14" />}
        actions={
          <Link className={buttonVariants({ variant: "default" })} to="/draws/new">
            Nuevo sorteo
          </Link>
        }
      />

      <FilterBar>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="draws-filter-game">Juego</Label>
          <GameSelector id="draws-filter-game" games={games} value={game} onChange={(value) => setParam("game", value)} allowAll />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="draws-filter-from">Desde</Label>
          <Input id="draws-filter-from" type="date" value={dateFrom} max={dateTo || undefined} onChange={(event) => setParam("dateFrom", event.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="draws-filter-to">Hasta</Label>
          <Input id="draws-filter-to" type="date" value={dateTo} min={dateFrom || undefined} onChange={(event) => setParam("dateTo", event.target.value)} />
        </div>
      </FilterBar>

      {drawsQuery.isPending && <SkeletonCard count={itemsPerPage} />}

      {drawsQuery.isError && <ErrorState message="No se pudieron cargar los sorteos." onRetry={() => void drawsQuery.refetch()} />}

      {drawsQuery.data && drawsQuery.data.items.length === 0 && (
        <EmptyState
          title="Todavía no hay sorteos"
          description="Registra tu primer sorteo oficial para empezar a comparar."
          action={
            <Button asChild size="sm">
              <Link to="/draws/new">Nuevo sorteo</Link>
            </Button>
          }
        />
      )}

      {drawsQuery.data && drawsQuery.data.items.length > 0 && (
        <>
          {!showCardsOnly && (
            <div className="hidden lg:block bg-background rounded-2xl overflow-hidden border border-border mt-8">
              <DrawsTable draws={drawsQuery.data.items} games={games} dateFormat={dateFormat} onDeleteRequest={requestDelete} />
            </div>
          )}

          <div className={showCardsOnly ? "grid gap-3 sm:grid-cols-2" : "grid gap-3 lg:hidden"}>
            {drawsQuery.data.items.map((draw) => (
              <DrawCard
                key={draw.id}
                draw={draw}
                gameLabel={gameLabel(games, draw.game)}
                extrasConfig={findGameConfig(games, draw.game)?.extras}
                to={`/draws/${draw.id}`}
                actions={<DrawActions draw={draw} onDeleteRequest={() => requestDelete(draw)} />}
              />
            ))}
          </div>
        </>
      )}

      <ConfirmActionDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Eliminar sorteo"
        message="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
