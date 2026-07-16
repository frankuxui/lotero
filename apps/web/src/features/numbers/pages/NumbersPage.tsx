import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorState } from "@/components/shared/ErrorState";
import { GameSelector } from "@/components/shared/GameSelector";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { NumberGrid } from "@/components/shared/number-selector/NumberGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGames } from "@/hooks/useGames";
import { formatLotteryNumber } from "@/lib/formatters/number";

export default function NumbersPage() {
  const navigate = useNavigate();
  const gamesQuery = useGames();
  const games = useMemo(() => gamesQuery.data ?? [], [gamesQuery.data]);

  const [game, setGame] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const min = games.length > 0 ? Math.min(...games.map((g) => g.numbers.min)) : 1;
  const max = games.length > 0 ? Math.max(...games.map((g) => g.numbers.max)) : 49;

  if (gamesQuery.isPending) {
    return (
      <>
        <PageHeader title="Buscador de números" description="Consulta apariciones y estadísticas de un número." />
        <LoadingState />
      </>
    );
  }

  if (gamesQuery.isError) {
    return (
      <>
        <PageHeader title="Buscador de números" description="Consulta apariciones y estadísticas de un número." />
        <ErrorState message="No se pudieron cargar los juegos." onRetry={() => void gamesQuery.refetch()} />
      </>
    );
  }

  const handleSearch = () => {
    const number = selected[0];
    if (number === undefined) return;
    const query = game ? `?game=${encodeURIComponent(game)}` : "";
    navigate(`/numbers/${number}${query}`);
  };

  return (
    <>
      <PageHeader title="Buscador de números" description="Elige un número para ver sus apariciones y estadísticas." />

      <div className="mb-6 flex flex-col md:flex-row gap-4 sm:max-w-xl">
        <div className="flex flex-1 flex-col gap-4">
          <Label htmlFor="numbers-game">Juego (opcional)</Label>
          <GameSelector id="numbers-game" games={games} value={game} onChange={setGame} allowAll allowAllLabel="Cualquier juego" />
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <Label htmlFor="numbers-input">Número</Label>
          <Input
            id="numbers-input"
            type="number"
            min={min}
            max={max}
            value={selected[0] !== undefined ? formatLotteryNumber(selected[0]) : ""}
            onChange={(event) => {
              const value = Number(event.target.value);
              setSelected(Number.isInteger(value) && value >= min && value <= max ? [value] : []);
            }}
          />
        </div>
      </div>

      <NumberGrid min={min} max={max} mode="single" value={selected} onChange={setSelected} aria-label="Selector de número a buscar" className="max-w-xl" />

      <div className="mt-6">
        <Button onClick={handleSearch} disabled={selected.length === 0}>
          Buscar número {selected[0] !== undefined ? formatLotteryNumber(selected[0]) : ""}
        </Button>
      </div>
    </>
  );
}
