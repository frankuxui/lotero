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
    <>
      <PageHeader title="Comparador" description="Compara una combinación contra el histórico de sorteos o apuestas." />

      <div className="mb-6 flex flex-col gap-1.5 sm:max-w-xs">
        <Label htmlFor="compare-game">Juego</Label>
        <GameSelector id="compare-game" games={games} value={config.id} onChange={setGameOverride} />
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
    </>
  );
}
