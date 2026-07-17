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
    offset
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
      cell: (row) => <GameBadge game={row.game} label={gameLabel(games, row.game)} />
    },
    {
      key: "date",
      header: "Fecha",
      cell: (row) => formatPlainDate(row.suggestionDate, dateFormat)
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
      )
    },
    {
      key: "outcome",
      header: "Resultado",
      cell: (row) => <SuggestionOutcomeBadge outcome={row.outcome} />
    }
  ];

  return (
    <div className="w-full mx-auto max-w-4xl">
      <PageHeader
        title="Sugerencias"
        description="Histórico de las sugerencias diarias generadas por el sistema."
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="size-14" viewBox="0 0 36 36">
            <path
              fill="#dd2e44"
              d="M11.626 7.488a1.4 1.4 0 0 0-.268.395l-.008-.008L.134 33.141l.011.011c-.208.403.14 1.223.853 1.937c.713.713 1.533 1.061 1.936.853l.01.01L28.21 24.735l-.008-.009c.147-.07.282-.155.395-.269c1.562-1.562-.971-6.627-5.656-11.313c-4.687-4.686-9.752-7.218-11.315-5.656"
            />
            <path fill="#ea596e" d="M13 12L.416 32.506l-.282.635l.011.011c-.208.403.14 1.223.853 1.937c.232.232.473.408.709.557L17 17z" />
            <path
              fill="#a0041e"
              d="M23.012 13.066c4.67 4.672 7.263 9.652 5.789 11.124c-1.473 1.474-6.453-1.118-11.126-5.788c-4.671-4.672-7.263-9.654-5.79-11.127c1.474-1.473 6.454 1.119 11.127 5.791"
            />
            <path
              fill="#aa8dd8"
              d="M18.59 13.609a1 1 0 0 1-.734.215c-.868-.094-1.598-.396-2.109-.873c-.541-.505-.808-1.183-.735-1.862c.128-1.192 1.324-2.286 3.363-2.066c.793.085 1.147-.17 1.159-.292c.014-.121-.277-.446-1.07-.532c-.868-.094-1.598-.396-2.11-.873c-.541-.505-.809-1.183-.735-1.862c.13-1.192 1.325-2.286 3.362-2.065c.578.062.883-.057 1.012-.134c.103-.063.144-.123.148-.158c.012-.121-.275-.446-1.07-.532a1 1 0 0 1-.886-1.102a.997.997 0 0 1 1.101-.886c2.037.219 2.973 1.542 2.844 2.735c-.13 1.194-1.325 2.286-3.364 2.067c-.578-.063-.88.057-1.01.134c-.103.062-.145.123-.149.157c-.013.122.276.446 1.071.532c2.037.22 2.973 1.542 2.844 2.735s-1.324 2.286-3.362 2.065c-.578-.062-.882.058-1.012.134c-.104.064-.144.124-.148.158c-.013.121.276.446 1.07.532a1 1 0 0 1 .52 1.773"
            />
            <path
              fill="#77b255"
              d="M30.661 22.857c1.973-.557 3.334.323 3.658 1.478c.324 1.154-.378 2.615-2.35 3.17c-.77.216-1.001.584-.97.701c.034.118.425.312 1.193.095c1.972-.555 3.333.325 3.657 1.479c.326 1.155-.378 2.614-2.351 3.17c-.769.216-1.001.585-.967.702s.423.311 1.192.095a1 1 0 1 1 .54 1.925c-1.971.555-3.333-.323-3.659-1.479c-.324-1.154.379-2.613 2.353-3.169c.77-.217 1.001-.584.967-.702c-.032-.117-.422-.312-1.19-.096c-1.974.556-3.334-.322-3.659-1.479c-.325-1.154.378-2.613 2.351-3.17c.768-.215.999-.585.967-.701c-.034-.118-.423-.312-1.192-.096a1 1 0 1 1-.54-1.923"
            />
            <path fill="#aa8dd8" d="M23.001 20.16a1.001 1.001 0 0 1-.626-1.781c.218-.175 5.418-4.259 12.767-3.208a1 1 0 1 1-.283 1.979c-6.493-.922-11.187 2.754-11.233 2.791a1 1 0 0 1-.625.219" />
            <path
              fill="#77b255"
              d="M5.754 16a1 1 0 0 1-.958-1.287c1.133-3.773 2.16-9.794.898-11.364c-.141-.178-.354-.353-.842-.316c-.938.072-.849 2.051-.848 2.071a1 1 0 1 1-1.994.149c-.103-1.379.326-4.035 2.692-4.214c1.056-.08 1.933.287 2.552 1.057c2.371 2.951-.036 11.506-.542 13.192a1 1 0 0 1-.958.712"
            />
            <circle cx="25.5" cy="9.5" r="1.5" fill="#5c913b" />
            <circle cx="2" cy="18" r="2" fill="#9266cc" />
            <circle cx="32.5" cy="19.5" r="1.5" fill="#5c913b" />
            <circle cx="23.5" cy="31.5" r="1.5" fill="#5c913b" />
            <circle cx="28" cy="4" r="2" fill="#ffcc4d" />
            <circle cx="32.5" cy="8.5" r="1.5" fill="#ffcc4d" />
            <circle cx="29.5" cy="12.5" r="1.5" fill="#ffcc4d" />
            <circle cx="7.5" cy="23.5" r="1.5" fill="#ffcc4d" />
          </svg>
        }
      />

      <div className="w-full mt-8">
        <FilterBar>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="suggestions-filter-game">Juego</Label>
            <GameSelector id="suggestions-filter-game" games={games} value={game} onChange={(value) => setParam("game", value)} allowAll />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="suggestions-filter-from">Desde</Label>
            <Input id="suggestions-filter-from" type="date" value={dateFrom} max={dateTo || undefined} onChange={(event) => setParam("dateFrom", event.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="suggestions-filter-to">Hasta</Label>
            <Input id="suggestions-filter-to" type="date" value={dateTo} min={dateFrom || undefined} onChange={(event) => setParam("dateTo", event.target.value)} />
          </div>
        </FilterBar>
      </div>

      {suggestionsQuery.isPending && <SkeletonCard count={itemsPerPage} />}

      {suggestionsQuery.isError && <ErrorState message="No se pudieron cargar las sugerencias." onRetry={() => void suggestionsQuery.refetch()} />}

      {suggestionsQuery.data && suggestionsQuery.data.items.length === 0 && (
        <EmptyState title="Todavía no hay sugerencias" description="Se generan automáticamente al registrar un sorteo. Registra uno para ver la primera sugerencia." />
      )}

      {suggestionsQuery.data && suggestionsQuery.data.items.length > 0 && (
        <>
          <div className="hidden md:block bg-background rounded-2xl overflow-hidden  mt-8">
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
    </div>
  );
}
