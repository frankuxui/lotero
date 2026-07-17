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
    <div className="w-full mx-auto max-w-full sm:max-w-xl">
      <PageHeader
        title="Buscador de números"
        description="Elige un número para ver sus apariciones y estadísticas y filtra por juego si lo deseas."
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Sound-Recognition-Search--Streamline-Flex-Gradient" className="size-14">
            <g id="sound-recognition-search">
              <path
                id="Union"
                fill="url(#paint0_linear_9371_8260)"
                fillRule="evenodd"
                d="M4.32129.75c0-.414214-.33579-.75-.75-.75s-.75.335786-.75.75v8.62499c0 .41421.33579.75001.75.75001s.75-.3358.75-.75001V.75ZM1.5 2.42847c0-.41422-.33579-.75-.75-.75-.414214 0-.75.33578-.75.75v5.3715c0 .41421.335786.75.75.75.41421 0 .75-.33579.75-.75v-5.3715Zm5.64233.05175c0-.41421-.33578-.75-.75-.75-.41421 0-.75.33579-.75.75v1.17603c0 .41421.33579.75.75.75.41422 0 .75-.33579.75-.75V2.48022Zm4.72017-.80175c.4143 0 .75.33578.75.75v1.22778c0 .41421-.3357.75-.75.75-.4142 0-.75-.33579-.75-.75V2.42847c0-.41422.3358-.75.75-.75ZM9.21338 0c.41421 0 .75.335786.75.75v2.3667c0 .41421-.33579.75-.75.75-.41422 0-.75-.33579-.75-.75V.75c0-.414214.33579-.75.75-.75ZM7.1243 7.12406c-.40491.40491-.67264 1.04915-.67264 2.00933 0 .96021.26773 1.60441.67264 2.00931.40492.4049 1.04915.6727 2.00933.6727.96017 0 1.60437-.2678 2.00937-.6727.4049-.4049.6726-1.0491.6726-2.00931 0-.96018-.2677-1.60442-.6726-2.00933-.405-.40491-1.0492-.67264-2.00937-.67264-.96018 0-1.60441.26773-2.00933.67264ZM6.06364 6.0634c.76196-.76196 1.83371-1.11198 3.06999-1.11198 1.23627 0 2.30807.35002 3.06997 1.11198.762.76196 1.112 1.83371 1.112 3.06999 0 .94461-.2043 1.79311-.6406 2.48081l1.1054 1.1055c.2929.2929.2929.7678 0 1.0606-.2929.2929-.7678.2929-1.0607 0l-1.1054-1.1055c-.6877.4363-1.5362.6406-2.48067.6406-1.23628 0-2.30803-.3501-3.06999-1.112-.76195-.762-1.11198-1.8337-1.11198-3.07001 0-1.23628.35003-2.30803 1.11198-3.06999Z"
                clipRule="evenodd"
              ></path>
            </g>
            <defs>
              <linearGradient id="paint0_linear_9371_8260" x1="2.288" x2="13.596" y1="2.692" y2="8.957" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffd600"></stop>
                <stop offset="1" stopColor="#00d078"></stop>
              </linearGradient>
            </defs>
          </svg>
        }
      />

      <div className="w-full max-w-full mb-6 flex flex-col md:flex-row gap-4 mt-8">
        <div className="flex flex-1 flex-col gap-4">
          <Label htmlFor="numbers-game">Juego (opcional)</Label>
          <GameSelector id="numbers-game" games={games} value={game} onChange={setGame} allowAll allowAllLabel="Cualquier juego" />
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <Label htmlFor="numbers-input">Número</Label>
          <Input
            id="numbers-input"
            type="number"
            placeholder="Ingrese un número"
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

      <NumberGrid min={min} max={max} mode="single" value={selected} onChange={setSelected} aria-label="Selector de número a buscar" />

      <div className="mt-6">
        <Button size="lg" onClick={handleSearch} disabled={selected.length === 0}>
          Buscar número {selected[0] !== undefined ? formatLotteryNumber(selected[0]) : ""}
        </Button>
      </div>
    </div>
  );
}
