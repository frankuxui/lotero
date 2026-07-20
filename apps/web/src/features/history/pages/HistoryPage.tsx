import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterBar } from "@/components/shared/FilterBar";
import { GameBadge } from "@/components/shared/GameBadge";
import { GameSelector } from "@/components/shared/GameSelector";
import { NumberBadge } from "@/components/shared/NumberBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { RecordTable, type RecordTableColumn } from "@/components/shared/RecordTable";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { Button, buttonVariants, Badge, Input, Select, Label } from "@/components/ui";
import { BetCard } from "@/features/bets/components/BetCard";
import { useBetsList } from "@/features/bets/hooks/useBetsList";
import { DrawCard } from "@/features/draws/components/DrawCard";
import { useDrawsList } from "@/features/draws/hooks/useDrawsList";
import type { HistoryEntry } from "@/features/history/types";
import { useGames } from "@/hooks/useGames";
import { formatPlainDate, formatTimestamp } from "@/lib/formatters/date";
import { gameLabel } from "@/lib/games";
import { useSettingsStore } from "@/store/settingsStore";

type TypeFilter = "all" | "bets" | "draws";

export default function HistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = useSettingsStore((state) => state.itemsPerPage);
  const dateFormat = useSettingsStore((state) => state.dateFormat);

  const type = (searchParams.get("type") as TypeFilter | null) ?? "all";
  const game = searchParams.get("game") ?? "";
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";
  const numberFilter = searchParams.get("number") ?? "";

  const [batchSize, setBatchSize] = useState(itemsPerPage);

  const gamesQuery = useGames();
  const games = useMemo(() => gamesQuery.data ?? [], [gamesQuery.data]);

  const commonQuery = { game: game || undefined, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined };

  const drawsQuery = useDrawsList({ ...commonQuery, limit: batchSize, offset: 0 }, { enabled: type === "all" || type === "draws" });
  const betsQuery = useBetsList({ ...commonQuery, limit: batchSize, offset: 0 }, { enabled: type === "all" || type === "bets" });

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
    setBatchSize(itemsPerPage);
  };

  const isPending = gamesQuery.isPending || (drawsQuery.fetchStatus !== "idle" && drawsQuery.isPending) || (betsQuery.fetchStatus !== "idle" && betsQuery.isPending);
  const isError = gamesQuery.isError || drawsQuery.isError || betsQuery.isError;

  const parsedNumber = numberFilter ? Number(numberFilter) : undefined;
  const hasValidNumberFilter = parsedNumber !== undefined && Number.isInteger(parsedNumber) && parsedNumber > 0;

  const entries: HistoryEntry[] = useMemo(() => {
    const list: HistoryEntry[] = [];
    if ((type === "all" || type === "draws") && drawsQuery.data) {
      for (const draw of drawsQuery.data.items) {
        if (hasValidNumberFilter && !draw.numbers.includes(parsedNumber!)) continue;
        list.push({ kind: "draw", date: draw.drawDate, draw });
      }
    }
    if ((type === "all" || type === "bets") && betsQuery.data) {
      for (const bet of betsQuery.data.items) {
        if (hasValidNumberFilter && !bet.lines.some((line) => line.numbers.includes(parsedNumber!))) continue;
        list.push({ kind: "bet", date: bet.createdAt, bet });
      }
    }
    return list.sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));
  }, [type, drawsQuery.data, betsQuery.data, hasValidNumberFilter, parsedNumber]);

  const canLoadMore = (type !== "bets" && (drawsQuery.data?.meta.total ?? 0) > batchSize) || (type !== "draws" && (betsQuery.data?.meta.total ?? 0) > batchSize);

  const columns: RecordTableColumn<HistoryEntry>[] = [
    {
      key: "type",
      header: "Tipo",
      cell: (entry) => <Badge variant={entry.kind === "draw" ? "default" : "secondary"}>{entry.kind === "draw" ? "Sorteo" : "Apuesta"}</Badge>
    },
    {
      key: "game",
      header: "Juego",
      cell: (entry) => {
        const g = entry.kind === "draw" ? entry.draw.game : entry.bet.game;
        return <GameBadge game={g} label={gameLabel(games, g)} />;
      }
    },
    {
      key: "date",
      header: "Fecha",
      cell: (entry) => (entry.kind === "draw" ? formatPlainDate(entry.draw.drawDate, dateFormat) : formatTimestamp(entry.bet.createdAt))
    },
    {
      key: "numbers",
      header: "Números",
      cell: (entry) => (
        <div className="flex flex-wrap gap-1">
          {(entry.kind === "draw" ? entry.draw.numbers : (entry.bet.lines[0]?.numbers ?? [])).map((n) => (
            <NumberBadge key={n} value={n} size="sm" />
          ))}
        </div>
      )
    },
    {
      key: "view",
      header: "",
      className: "text-right",
      cell: (entry) => (
        <Link to={entry.kind === "draw" ? `/draws/${entry.draw.id}` : `/bets/${entry.bet.id}`} className={buttonVariants({ variant: "inverse", size: "sm" })}>
          Ver
        </Link>
      )
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <PageHeader
        title="Historial"
        description="Historial unificado de sorteos y apuestas."
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="size-14" viewBox="0 0 16 16">
            <g fill="none">
              <path fill="url(#SVGX47HbbxR)" d="M7.698 5a.75.75 0 0 1 .75.75V7.5h1.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 1 .75-.75" />
              <path
                fill="url(#fref78)"
                d="M7.947 3.5a4.5 4.5 0 1 1-4.454 5.14a.75.75 0 1 0-1.485.212a6.001 6.001 0 1 0 1.94-5.324V2.75a.75.75 0 1 0-1.5 0v3c0 .414.335.75.75.75h2.5a.75.75 0 1 0 0-1.5H4.592a4.5 4.5 0 0 1 3.354-1.5"
              />
              <defs>
                <linearGradient id="SVGX47HbbxR" x1="6.357" x2="14.586" y1="12.633" y2="8.988" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#d373fc" />
                  <stop offset="1" stopColor="#6d37cd" />
                </linearGradient>
                <linearGradient id="fref78" x1="2" x2="5.234" y1="2.706" y2="16.186" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0fafff" />
                  <stop offset="1" stopColor="#0067bf" />
                </linearGradient>
              </defs>
            </g>
          </svg>
        }
      />

      <div className="mt-8 w-full">
        <FilterBar>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="history-type">Tipo</Label>
            <Select id="history-type" value={type} onChange={(event) => setParam("type", event.target.value)}>
              <option value="all">Todos</option>
              <option value="draws">Sorteos</option>
              <option value="bets">Apuestas</option>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="history-game">Juego</Label>
            <GameSelector id="history-game" games={games} value={game} onChange={(value) => setParam("game", value)} allowAll />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="history-from">Desde</Label>
            <Input id="history-from" type="date" value={dateFrom} max={dateTo || undefined} onChange={(event) => setParam("dateFrom", event.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="history-to">Hasta</Label>
            <Input id="history-to" type="date" value={dateTo} min={dateFrom || undefined} onChange={(event) => setParam("dateTo", event.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="history-number">Número (en lo cargado)</Label>
            <Input id="history-number" type="number" min={1} value={numberFilter} onChange={(event) => setParam("number", event.target.value)} placeholder="Ej. 23" className="w-32" />
          </div>
        </FilterBar>
      </div>

      <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
        El filtro por número solo busca dentro de los registros ya cargados. Para una búsqueda exhaustiva usa el{" "}
        <Link to="/numbers" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          buscador de números
        </Link>
        .
      </p>

      {isPending && <SkeletonCard count={itemsPerPage} />}

      {isError && !isPending && (
        <ErrorState
          message="No se pudo cargar el historial."
          onRetry={() => {
            void drawsQuery.refetch();
            void betsQuery.refetch();
          }}
        />
      )}

      {!isPending && !isError && entries.length === 0 && <EmptyState title="Sin registros" description="No hay sorteos ni apuestas que coincidan con estos filtros." />}

      {!isPending && !isError && entries.length > 0 && (
        <>
          <div className="hidden md:block bg-card rounded-2xl overflow-hidden">
            <RecordTable rows={entries} columns={columns} getRowKey={(entry) => `${entry.kind}-${entry.kind === "draw" ? entry.draw.id : entry.bet.id}`} />
          </div>

          <div className="grid gap-3 md:hidden">
            {entries.map((entry) =>
              entry.kind === "draw" ? (
                <DrawCard key={`draw-${entry.draw.id}`} draw={entry.draw} gameLabel={gameLabel(games, entry.draw.game)} to={`/draws/${entry.draw.id}`} />
              ) : (
                <BetCard key={`bet-${entry.bet.id}`} bet={entry.bet} gameLabel={gameLabel(games, entry.bet.game)} to={`/bets/${entry.bet.id}`} compact />
              )
            )}
          </div>

          {canLoadMore && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline" onClick={() => setBatchSize((size) => size + itemsPerPage)}>
                Cargar más
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
