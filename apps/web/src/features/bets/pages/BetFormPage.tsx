import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorState } from "@/components/shared/ErrorState";
import { GameSelector } from "@/components/shared/GameSelector";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Label } from "@/components/ui/label";
import { BetForm } from "@/features/bets/components/BetForm";
import { useBet } from "@/features/bets/hooks/useBet";
import { useCreateBet, useUpdateBet } from "@/features/bets/hooks/useBetMutations";
import { useGames } from "@/hooks/useGames";
import { ApiError } from "@/lib/api/client";
import { findGameConfig } from "@/lib/games";
import { useSettingsStore } from "@/store/settingsStore";
import { toast } from "@/store/toastStore";

export default function BetFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const defaultGameSetting = useSettingsStore((state) => state.defaultGame);

  const gamesQuery = useGames();
  const betQuery = useBet(id);
  const createMutation = useCreateBet();
  const updateMutation = useUpdateBet(id ?? "");

  const [gameOverride, setGameOverride] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<ApiError | null>(null);

  const games = useMemo(() => gamesQuery.data ?? [], [gamesQuery.data]);

  const initialGame = isEdit
    ? betQuery.data?.game
    : (defaultGameSetting && findGameConfig(games, defaultGameSetting) ? defaultGameSetting : games[0]?.id);
  const selectedGame = gameOverride ?? initialGame;

  const isPending = gamesQuery.isPending || (isEdit && betQuery.isPending);
  const isError = gamesQuery.isError || (isEdit && betQuery.isError);
  const config = selectedGame ? findGameConfig(games, selectedGame) : undefined;

  const defaultValues = useMemo(() => {
    if (!isEdit || !betQuery.data || !config) return undefined;
    return {
      label: betQuery.data.label ?? "",
      lines: betQuery.data.lines.map((line) => ({ numbers: line.numbers, extras: line.extras })),
    };
  }, [isEdit, betQuery.data, config]);

  const breadcrumbs = [{ label: "Mis apuestas", to: "/bets" }, { label: isEdit ? "Editar" : "Nueva" }];

  if (isPending) {
    return (
      <>
        <PageHeader title={isEdit ? "Editar apuesta" : "Nueva apuesta"} breadcrumbs={breadcrumbs} />
        <LoadingState />
      </>
    );
  }

  if (isError || !config) {
    return (
      <>
        <PageHeader title={isEdit ? "Editar apuesta" : "Nueva apuesta"} breadcrumbs={breadcrumbs} />
        <ErrorState
          message="No se pudo cargar el formulario."
          onRetry={() => {
            void gamesQuery.refetch();
            if (isEdit) void betQuery.refetch();
          }}
        />
      </>
    );
  }

  const handleSubmit = (payload: { label?: string; lines: { numbers: number[]; extras: Record<string, unknown> }[] }) => {
    setSubmitError(null);
    const onSuccess = (bet: { id: string }) => {
      toast({ title: isEdit ? "Apuesta actualizada" : "Apuesta creada", variant: "success" });
      navigate(`/bets/${bet.id}`);
    };
    const onError = (error: unknown) => {
      if (error instanceof ApiError) setSubmitError(error);
    };

    if (isEdit && id) {
      updateMutation.mutate({ game: config.id, ...payload }, { onSuccess, onError });
    } else {
      createMutation.mutate({ game: config.id, ...payload }, { onSuccess, onError });
    }
  };

  return (
    <>
      <PageHeader title={isEdit ? "Editar apuesta" : "Nueva apuesta"} breadcrumbs={breadcrumbs} />
      <div className="mb-6 flex flex-col gap-1.5 sm:max-w-xs">
        <Label htmlFor="bet-game">Juego</Label>
        <GameSelector id="bet-game" games={games} value={config.id} onChange={setGameOverride} />
      </div>
      <BetForm
        key={config.id}
        config={config}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        submitLabel={isEdit ? "Guardar cambios" : "Crear apuesta"}
        serverError={submitError}
      />
    </>
  );
}
