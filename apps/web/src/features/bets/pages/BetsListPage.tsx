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
import { BetActions } from "@/features/bets/components/BetActions";
import { BetCard } from "@/features/bets/components/BetCard";
import { useBetsList } from "@/features/bets/hooks/useBetsList";
import { useCreateBet, useDeleteBet } from "@/features/bets/hooks/useBetMutations";
import { useGames } from "@/hooks/useGames";
import { formatTimestamp } from "@/lib/formatters/date";
import { findGameConfig, gameLabel } from "@/lib/games";
import { useSettingsStore } from "@/store/settingsStore";
import { toast } from "@/store/toastStore";
import type { Bet } from "@/types/bet";

export default function BetsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = useSettingsStore((state) => state.itemsPerPage);
  const viewModeSetting = useSettingsStore((state) => state.viewMode);
  const confirmBeforeDelete = useSettingsStore((state) => state.confirmBeforeDelete);

  const game = searchParams.get("game") ?? "";
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";
  const offset = Number(searchParams.get("offset") ?? "0");

  const gamesQuery = useGames();
  const betsQuery = useBetsList({
    game: game || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    limit: itemsPerPage,
    offset
  });
  const createMutation = useCreateBet();
  const deleteMutation = useDeleteBet();

  const [pendingDelete, setPendingDelete] = useState<Bet | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

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

  const hasActiveFilters = Boolean(game || dateFrom || dateTo);
  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("game");
    next.delete("dateFrom");
    next.delete("dateTo");
    next.delete("offset");
    setSearchParams(next);
  };

  const handleDuplicate = (bet: Bet) => {
    setDuplicatingId(bet.id);
    createMutation.mutate(
      { game: bet.game, label: bet.label ? `${bet.label} (copia)` : undefined, lines: bet.lines.map((line) => ({ numbers: line.numbers, extras: line.extras })) },
      {
        onSuccess: () => {
          toast({ title: "Apuesta duplicada", variant: "success" });
          setDuplicatingId(null);
        },
        onError: () => {
          toast({ title: "No se pudo duplicar la apuesta", variant: "error" });
          setDuplicatingId(null);
        }
      }
    );
  };

  const deleteBet = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast({ title: "Apuesta eliminada", variant: "success" });
        setPendingDelete(null);
      },
      onError: () => {
        toast({ title: "No se pudo eliminar la apuesta", variant: "error" });
      }
    });
  };

  const requestDelete = (bet: Bet) => {
    if (confirmBeforeDelete) {
      setPendingDelete(bet);
    } else {
      deleteBet(bet.id);
    }
  };

  const handleDelete = () => {
    if (!pendingDelete) return;
    deleteBet(pendingDelete.id);
  };

  return (
    <>
      <PageHeader
        title="Mis apuestas"
        description="Consulta y gestiona tus apuestas registradas."
        actions={
          <Button asChild>
            <Link to="/bets/new">Nueva apuesta</Link>
          </Button>
        }
      />

      <FilterBar hasActiveFilters={hasActiveFilters} onClearFilters={clearFilters}>
        <div className="grid w-full gap-4">
          <Label htmlFor="bets-filter-game">Juego</Label>
          <GameSelector id="bets-filter-game" games={games} value={game} onChange={(value) => setParam("game", value)} allowAll />
        </div>
        <div className="grid w-full gap-4">
          <Label htmlFor="bets-filter-from">Desde</Label>
          <Input id="bets-filter-from" type="date" value={dateFrom} max={dateTo || undefined} onChange={(event) => setParam("dateFrom", event.target.value)} />
        </div>
        <div className="grid w-full gap-4">
          <Label htmlFor="bets-filter-to">Hasta</Label>
          <Input id="bets-filter-to" type="date" value={dateTo} min={dateFrom || undefined} onChange={(event) => setParam("dateTo", event.target.value)} />
        </div>
      </FilterBar>

      {betsQuery.isPending && <SkeletonCard count={itemsPerPage} />}

      {betsQuery.isError && <ErrorState message="No se pudieron cargar las apuestas." onRetry={() => void betsQuery.refetch()} />}

      {betsQuery.data && betsQuery.data.items.length === 0 && (
        <EmptyState
          title="Todavía no hay apuestas"
          description="Registra tu primera apuesta para empezar a hacer seguimiento."
          action={
            <Button asChild size="sm">
              <Link to="/bets/new">Nueva apuesta</Link>
            </Button>
          }
        />
      )}

      {betsQuery.data && betsQuery.data.items.length > 0 && (
        <>
          {useTable ? (
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Juego</TableHead>
                    <TableHead>Etiqueta</TableHead>
                    <TableHead>Primera línea</TableHead>
                    <TableHead>Líneas</TableHead>
                    <TableHead>Creada</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {betsQuery.data.items.map((bet) => (
                    <TableRow key={bet.id}>
                      <TableCell>
                        <GameBadge game={bet.game} label={gameLabel(games, bet.game)} />
                      </TableCell>
                      <TableCell>{bet.label || "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {bet.lines[0]?.numbers.map((n) => (
                            <NumberBadge key={n} value={n} size="sm" />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{bet.lines.length}</TableCell>
                      <TableCell>{formatTimestamp(bet.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <BetActions bet={bet} onDuplicate={() => handleDuplicate(bet)} onDeleteRequest={() => requestDelete(bet)} isDuplicating={duplicatingId === bet.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}

          <div className={useTable ? "grid gap-3 md:hidden" : "grid gap-3 sm:grid-cols-2"}>
            {betsQuery.data.items.map((bet) => (
              <BetCard
                key={bet.id}
                bet={bet}
                gameLabel={gameLabel(games, bet.game)}
                extrasConfig={findGameConfig(games, bet.game)?.extras}
                to={`/bets/${bet.id}`}
                compact
                actions={<BetActions bet={bet} onDuplicate={() => handleDuplicate(bet)} onDeleteRequest={() => requestDelete(bet)} isDuplicating={duplicatingId === bet.id} />}
              />
            ))}
          </div>

          <Pagination total={betsQuery.data.meta.total} limit={itemsPerPage} offset={offset} onOffsetChange={setOffset} />
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Eliminar apuesta"
        description={`¿Seguro que quieres eliminar "${pendingDelete?.label || "esta apuesta"}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        isPending={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
