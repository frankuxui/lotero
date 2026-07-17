import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterBar } from "@/components/shared/FilterBar";
import { GameBadge } from "@/components/shared/GameBadge";
import { GameSelector } from "@/components/shared/GameSelector";
import { NumberBadge } from "@/components/shared/NumberBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { RecordTable, type RecordTableColumn } from "@/components/shared/RecordTable";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SuggestionCard } from "@/features/suggestions/components/SuggestionCard";
import { SuggestionOutcomeBadge } from "@/features/suggestions/components/SuggestionOutcomeBadge";
import { useSuggestionsList } from "@/features/suggestions/hooks/useSuggestionsList";
import { useGames } from "@/hooks/useGames";
import { formatPlainDate } from "@/lib/formatters/date";
import { gameLabel } from "@/lib/games";
import { useSettingsStore } from "@/store/settingsStore";
import type { SuggestionWithOutcome } from "@/types/suggestion";

export default function SuggestionsHistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = useSettingsStore((state) => state.itemsPerPage);
  const dateFormat = useSettingsStore((state) => state.dateFormat);

  const game = searchParams.get("game") ?? "";
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";
  const offset = Number(searchParams.get("offset") ?? "0");

  const gamesQuery = useGames();
  const games = useMemo(() => gamesQuery.data ?? [], [gamesQuery.data]);

  const suggestionsQuery = useSuggestionsList({
    game: game || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    limit: itemsPerPage,
    offset,
  });

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

  const columns: RecordTableColumn<SuggestionWithOutcome>[] = [
    {
      key: "game",
      header: "Juego",
      cell: (row) => <GameBadge game={row.game} label={gameLabel(games, row.game)} />,
    },
    {
      key: "date",
      header: "Fecha",
      cell: (row) => formatPlainDate(row.suggestionDate, dateFormat),
    },
    {
      key: "numbers",
      header: "Números sugeridos",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.numbers.map((n) => (
            <NumberBadge key={n} value={n} size="sm" />
          ))}
        </div>
      ),
    },
    {
      key: "outcome",
      header: "Resultado",
      cell: (row) => <SuggestionOutcomeBadge outcome={row.outcome} />,
    },
  ];

  return (
    <>
      <PageHeader title="Sugerencias" description="Histórico de las sugerencias diarias generadas por el sistema." />

      <FilterBar>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="suggestions-filter-game">Juego</Label>
          <GameSelector id="suggestions-filter-game" games={games} value={game} onChange={(value) => setParam("game", value)} allowAll className="w-48" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="suggestions-filter-from">Desde</Label>
          <Input id="suggestions-filter-from" type="date" value={dateFrom} max={dateTo || undefined} onChange={(event) => setParam("dateFrom", event.target.value)} className="w-40" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="suggestions-filter-to">Hasta</Label>
          <Input id="suggestions-filter-to" type="date" value={dateTo} min={dateFrom || undefined} onChange={(event) => setParam("dateTo", event.target.value)} className="w-40" />
        </div>
      </FilterBar>

      {suggestionsQuery.isPending && <SkeletonCard count={itemsPerPage} />}

      {suggestionsQuery.isError && <ErrorState message="No se pudieron cargar las sugerencias." onRetry={() => void suggestionsQuery.refetch()} />}

      {suggestionsQuery.data && suggestionsQuery.data.items.length === 0 && (
        <EmptyState
          title="Todavía no hay sugerencias"
          description="Se generan automáticamente al registrar un sorteo. Registra uno para ver la primera sugerencia."
        />
      )}

      {suggestionsQuery.data && suggestionsQuery.data.items.length > 0 && (
        <>
          <div className="hidden md:block">
            <RecordTable rows={suggestionsQuery.data.items} columns={columns} getRowKey={(row) => row.id} />
          </div>

          <div className="grid gap-3 md:hidden">
            {suggestionsQuery.data.items.map((row) => (
              <SuggestionCard key={row.id} suggestion={row} gameLabel={gameLabel(games, row.game)} dateFormat={dateFormat} />
            ))}
          </div>

          <Pagination total={suggestionsQuery.data.meta.total} limit={itemsPerPage} offset={offset} onOffsetChange={setOffset} />
        </>
      )}
    </>
  );
}
