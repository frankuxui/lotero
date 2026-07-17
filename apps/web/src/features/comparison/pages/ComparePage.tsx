import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { GameSelector } from "@/components/shared/GameSelector";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Label } from "@/components/ui/label";
import { CompareForm } from "@/features/comparison/components/CompareForm";
import { ComparisonResultCard } from "@/features/comparison/components/ComparisonResultCard";
import { useCompare } from "@/features/comparison/hooks/useCompare";
import type { CompareFormValues } from "@/features/comparison/schemas/compare-form.schema";
import { useGames } from "@/hooks/useGames";
import { parseCombinationText } from "@/lib/formatters/number";
import { findGameConfig, gameLabel } from "@/lib/games";
import { useSettingsStore } from "@/store/settingsStore";

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const defaultGameSetting = useSettingsStore((state) => state.defaultGame);

  const gamesQuery = useGames();
  const games = useMemo(() => gamesQuery.data ?? [], [gamesQuery.data]);

  const urlGame = searchParams.get("game");
  const urlNumbers = searchParams.get("numbers");

  const [gameOverride, setGameOverride] = useState<string | null>(null);
  const initialGame = (urlGame && findGameConfig(games, urlGame) ? urlGame : undefined) ?? (defaultGameSetting && findGameConfig(games, defaultGameSetting) ? defaultGameSetting : games[0]?.id);
  const selectedGame = gameOverride ?? initialGame;
  const config = selectedGame ? findGameConfig(games, selectedGame) : undefined;

  const compareMutation = useCompare();

  if (gamesQuery.isPending) {
    return (
      <>
        <PageHeader title="Comparador" description="Compara una combinación contra el histórico." />
        <LoadingState />
      </>
    );
  }

  if (gamesQuery.isError || !config) {
    return (
      <>
        <PageHeader title="Comparador" description="Compara una combinación contra el histórico." />
        <ErrorState message="No se pudieron cargar los juegos." onRetry={() => void gamesQuery.refetch()} />
      </>
    );
  }

  const defaultValues: Partial<CompareFormValues> | undefined = urlGame === config.id && urlNumbers ? { numbers: parseCombinationText(urlNumbers) } : undefined;

  const handleSubmit = (values: CompareFormValues) => {
    compareMutation.mutate({
      game: config.id,
      numbers: values.numbers,
      source: values.source,
      dateFrom: values.dateFrom || undefined,
      dateTo: values.dateTo || undefined,
      minMatches: values.minMatches
    });
  };

  const results = compareMutation.data?.results ?? [];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <PageHeader
        title="Comparador"
        description="Compara una combinación contra el histórico de sorteos y apuestas."
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Horizontal-Toggle-Button--Streamline-Flex-Gradient" className="size-14">
            <g id="horizontal-toggle-button--toggle-adjustment-adjust-button-off-on-horizontal-settings-controls">
              <path
                id="Union"
                fill="url(#98fujedr)"
                fillRule="evenodd"
                d="M0 3.075c0 .85819.238378 1.60078.750274 2.1403.512386.54005 1.238816.81342 2.088816.85163 2.46388.11076 5.85793.11076 8.32181 0 .85-.03821 1.5764-.31158 2.0888-.85163C13.7616 4.67578 14 3.93319 14 3.075c0-.8582-.2384-1.60078-.7503-2.14031-.5124-.540042-1.2388-.81341-2.0888-.85162-2.46388-.1107601-5.85793-.11076-8.32181 3e-7C1.98909.121281 1.26266.394648.750275.934691.238378 1.47422 0 2.2168 0 3.075Zm9.60889-1.15141c.30229-.3023.71431-.42676 1.15141-.42676l.0031.00001.0032-.00001c.437 0 .849.12446 1.1513.42676.3023.30229.4268.71433.4268 1.15136 0 .43704-.1245.84907-.4268 1.15137-.3023.30229-.7143.42676-1.1513.42676l-.0032-.00001-.0031.00001c-.4371 0-.84912-.12447-1.15141-.42676-.3023-.3023-.42676-.71433-.42676-1.15137 0-.43703.12446-.84907.42676-1.15136ZM14 10.9251c0-.8582-.2384-1.60078-.7503-2.14031-.5124-.54004-1.2388-.81341-2.0888-.85162-2.46388-.11076-5.85793-.11076-8.32181 0-.85.03821-1.57643.31158-2.088815.85162C.238378 9.32432 0 10.0669 0 10.9251c0 .8582.238378 1.6008.750276 2.1403.512384.54 1.238814.8134 2.088814.8516 2.46388.1108 5.85793.1108 8.32181 0 .85-.0382 1.5764-.3116 2.0888-.8516.5119-.5395.7503-1.2821.7503-2.1403ZM3.23339 12.5033c-.43704 0-.84907-.1245-1.15137-.4268-.30229-.3023-.42676-.7143-.42676-1.1514 0-.437.12447-.849.42676-1.15132.3023-.30229.71433-.42676 1.15137-.42676l.00316.00001.00316-.00001c.43703 0 .84907.12447 1.15136.42676.3023.30232.42676.71432.42676 1.15132 0 .4371-.12446.8491-.42676 1.1514-.30229.3023-.71433.4268-1.15136.4268h-.00632Z"
                clipRule="evenodd"
              ></path>
            </g>
            <defs>
              <linearGradient id="98fujedr" x1=".538" x2="16.494" y1="1.131" y2="10.125" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00d078"></stop>
                <stop offset="1" stopColor="#007df0"></stop>
              </linearGradient>
            </defs>
          </svg>
        }
      />

      <div className="mt-8 mb-6 flex flex-col gap-1.5 p-8 rounded-2xl bg-card w-full">
        <div className="grid gap-4">
          <Label htmlFor="compare-game">Juego</Label>
          <GameSelector id="compare-game" games={games} value={config.id} onChange={setGameOverride} />
        </div>
      </div>

      <CompareForm key={config.id} config={config} defaultValues={defaultValues} onSubmit={handleSubmit} isSubmitting={compareMutation.isPending} />

      <div className="mt-8">
        {compareMutation.isError && <ErrorState message="No se pudo completar la comparación. Revisa la combinación e inténtalo de nuevo." />}

        {compareMutation.isSuccess && results.length === 0 && <EmptyState title="Sin coincidencias" description="No hay registros que cumplan los filtros indicados." />}

        {compareMutation.isSuccess && results.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {results.map((result) => (
              <ComparisonResultCard
                key={`${result.recordType}-${result.recordId}`}
                result={result}
                gameLabel={gameLabel(games, result.game)}
                to={result.recordType === "draw" ? `/draws/${result.recordId}` : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
