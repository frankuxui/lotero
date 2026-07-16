import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterBar } from "@/components/shared/FilterBar";
import { GameBadge } from "@/components/shared/GameBadge";
import { GameSelector } from "@/components/shared/GameSelector";
import { NumberBadge } from "@/components/shared/NumberBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DrawActions } from "@/features/draws/components/DrawActions";
import { DrawCard } from "@/features/draws/components/DrawCard";
import { useDrawsList } from "@/features/draws/hooks/useDrawsList";
import { useDeleteDraw } from "@/features/draws/hooks/useDrawMutations";
import { useGames } from "@/hooks/useGames";
import { formatPlainDate } from "@/lib/formatters/date";
import { findGameConfig, gameLabel } from "@/lib/games";
import { useSettingsStore } from "@/store/settingsStore";
import { toast } from "@/store/toastStore";
import type { Draw } from "@/types/draw";

export default function DrawsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = useSettingsStore((state) => state.itemsPerPage);
  const viewModeSetting = useSettingsStore((state) => state.viewMode);
  const dateFormat = useSettingsStore((state) => state.dateFormat);
  const confirmBeforeDelete = useSettingsStore((state) => state.confirmBeforeDelete);

  const game = searchParams.get("game") ?? "";
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";
  const offset = Number(searchParams.get("offset") ?? "0");

  const gamesQuery = useGames();
  const drawsQuery = useDrawsList({
    game: game || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    limit: itemsPerPage,
    offset,
  });
  const deleteMutation = useDeleteDraw();

  const [pendingDelete, setPendingDelete] = useState<Draw | null>(null);

  const games = useMemo(() => gamesQuery.data ?? [], [gamesQuery.data]);
  const useTable = viewModeSetting === "table" || viewModeSetting === "auto";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("offset");
    setSearchParams(next);
  };

  const setOffset = (value: number) => {
    const next = new URLSearchParams(searchParams);
    if (value > 0) next.set("offset", String(value));
    else next.delete("offset");
    setSearchParams(next);
  };

  const deleteDraw = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast({ title: "Sorteo eliminado", variant: "success" });
        setPendingDelete(null);
      },
      onError: () => toast({ title: "No se pudo eliminar el sorteo", variant: "error" }),
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
    <>
      <PageHeader
        title="Sorteos"
        description="Consulta y gestiona los sorteos oficiales registrados."
        actions={
          <Button asChild>
            <Link to="/draws/new">Nuevo sorteo</Link>
          </Button>
        }
      />

      <FilterBar>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="draws-filter-game">Juego</Label>
          <GameSelector
            id="draws-filter-game"
            games={games}
            value={game}
            onChange={(value) => setParam("game", value)}
            allowAll
            className="w-48"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="draws-filter-from">Desde</Label>
          <Input
            id="draws-filter-from"
            type="date"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(event) => setParam("dateFrom", event.target.value)}
            className="w-40"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="draws-filter-to">Hasta</Label>
          <Input
            id="draws-filter-to"
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(event) => setParam("dateTo", event.target.value)}
            className="w-40"
          />
        </div>
      </FilterBar>

      {drawsQuery.isPending && <SkeletonCard count={itemsPerPage} />}

      {drawsQuery.isError && (
        <ErrorState message="No se pudieron cargar los sorteos." onRetry={() => void drawsQuery.refetch()} />
      )}

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
          {useTable ? (
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Juego</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Números</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drawsQuery.data.items.map((draw) => (
                    <TableRow key={draw.id}>
                      <TableCell>
                        <GameBadge game={draw.game} label={gameLabel(games, draw.game)} />
                      </TableCell>
                      <TableCell>{formatPlainDate(draw.drawDate, dateFormat)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {draw.numbers.map((n) => (
                            <NumberBadge key={n} value={n} size="sm" />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DrawActions draw={draw} onDeleteRequest={() => requestDelete(draw)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}

          <div className={useTable ? "grid gap-3 md:hidden" : "grid gap-3 sm:grid-cols-2"}>
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

          <Pagination total={drawsQuery.data.meta.total} limit={itemsPerPage} offset={offset} onOffsetChange={setOffset} />
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Eliminar sorteo"
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        isPending={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
