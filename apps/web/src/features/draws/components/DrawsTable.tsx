import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type FilterFn,
  type SortingState
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { GameBadge } from "@/components/shared/GameBadge";
import { NumberBadge } from "@/components/shared/NumberBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DrawActions } from "@/features/draws/components/DrawActions";
import { formatPlainDate, type DateFormatPreference } from "@/lib/formatters/date";
import { formatLotteryNumber } from "@/lib/formatters/number";
import { gameLabel } from "@/lib/games";
import type { Draw } from "@/types/draw";
import type { GameConfig } from "@/types/game";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper<Draw>();
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

function matchesNumberQuery(numbers: number[], query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return numbers.some((n) => formatLotteryNumber(n).includes(needle) || String(n) === needle);
}

export function DrawsTable({ draws, games, dateFormat, onDeleteRequest }: { draws: Draw[]; games: GameConfig[]; dateFormat: DateFormatPreference; onDeleteRequest: (draw: Draw) => void }) {
  "use no memo";

  const [sorting, setSorting] = useState<SortingState>([{ id: "drawDate", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const globalFilterFn: FilterFn<Draw> = (row, _columnId, filterValue) => {
    const needle = String(filterValue).trim().toLowerCase();
    if (!needle) return true;
    const draw = row.original;
    return matchesNumberQuery(draw.numbers, needle) || gameLabel(games, draw.game).toLowerCase().includes(needle) || draw.drawDate.includes(needle);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor((draw) => gameLabel(games, draw.game), {
        id: "game",
        header: "Juego",
        cell: (info) => <GameBadge game={info.row.original.game} label={info.getValue()} />,
        filterFn: "includesString"
      }),
      columnHelper.accessor("drawDate", {
        id: "drawDate",
        header: "Fecha",
        cell: (info) => formatPlainDate(info.getValue(), dateFormat),
        filterFn: "includesString"
      }),
      columnHelper.accessor("numbers", {
        id: "numbers",
        header: "Números",
        cell: (info) => (
          <div className="flex flex-wrap gap-1">
            {info.getValue().map((n) => (
              <NumberBadge key={n} value={n} size="sm" />
            ))}
          </div>
        ),
        filterFn: (row, columnId, filterValue) => matchesNumberQuery(row.getValue(columnId), String(filterValue)),
        enableSorting: false
      }),
      columnHelper.display({
        id: "actions",
        header: "Acciones",
        enableSorting: false,
        cell: (info) => <DrawActions draw={info.row.original} onDeleteRequest={() => onDeleteRequest(info.row.original)} className="text-right flex items-center justify-end" />
      })
    ],
    [games, dateFormat, onDeleteRequest]
  );

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table expone funciones no memoizables; este componente está marcado con "use no memo".
  const table = useReactTable({
    data: draws,
    columns,
    state: { sorting, columnFilters, globalFilter, pagination },
    getRowId: (draw) => draw.id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const totalFiltered = table.getFilteredRowModel().rows.length;
  const columnCount = columns.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="p-6 w-full">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <Input
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder="Buscar número, juego o fecha…"
            className="w-full pl-9"
            aria-label="Buscador global de sorteos"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sortState = header.column.getIsSorted();
                return (
                  <TableHead key={header.id} className={cn("py-4 px-6", header.column.id === "actions" ? "text-right" : undefined)}>
                    {header.isPlaceholder ? null : (
                      <div className="flex flex-col gap-1.5">
                        {header.column.getCanSort() ? (
                          <button type="button" className="flex items-center gap-1 text-left uppercase tracking-wide" onClick={header.column.getToggleSortingHandler()}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {sortState === "asc" && <ArrowUp className="size-3" aria-hidden="true" />}
                            {sortState === "desc" && <ArrowDown className="size-3" aria-hidden="true" />}
                            {!sortState && <ArrowUpDown className="size-3 opacity-40" aria-hidden="true" />}
                          </button>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                        {header.column.getCanFilter() && (
                          <Input
                            value={(header.column.getFilterValue() as string) ?? ""}
                            onChange={(event) => header.column.setFilterValue(event.target.value)}
                            placeholder="Filtrar…"
                            aria-label={`Filtrar por ${typeof header.column.columnDef.header === "string" ? header.column.columnDef.header : header.column.id}`}
                            className="h-9 text-xs font-normal normal-case"
                          />
                        )}
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columnCount} className="py-8 px-6 text-center text-slate-500 dark:text-slate-400">
                Sin resultados para estos filtros.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={cn("py-2 px-6", cell.column.id === "actions" ? "text-right" : undefined)}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columnCount} className="text-xs text-slate-500 dark:text-slate-400">
              {totalFiltered} {totalFiltered === 1 ? "sorteo" : "sorteos"}
              {totalFiltered !== draws.length ? ` (de ${draws.length} cargados)` : ""}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-3 p-6">
        <div className="flex items-center gap-2 flex-1">
          <Label htmlFor="draws-page-size" className="text-xs">
            Filas por página
          </Label>
          <Select id="draws-page-size" value={String(table.getState().pagination.pageSize)} onChange={(event) => table.setPageSize(Number(event.target.value))} className="w-20">
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm ">
            Página {table.getState().pagination.pageIndex + 1} de {Math.max(1, table.getPageCount())}
          </span>
          <Button type="button" variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Página anterior">
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Página siguiente">
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
