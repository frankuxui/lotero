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
import { clearFormDraft } from "@/lib/storage/formDraft";
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
  // Refleja lo que se escribe en "Observaciones" mientras se teclea (vía BetForm.onLabelChange),
  // en vez de depender de betQuery.data.label, que solo se actualiza tras guardar y refetchear.
  const [liveLabel, setLiveLabel] = useState("");
  // Rastrea el último label de la API que ya sembramos en liveLabel, para sembrarlo una sola
  // vez por valor nuevo. Se ajusta durante el render (no en un efecto) siguiendo el patrón
  // recomendado por React para derivar estado a partir de datos externos sin causar un
  // renderizado en cascada: https://react.dev/learn/you-might-not-need-an-effect
  const [seededLabel, setSeededLabel] = useState<string | undefined>(undefined);

  const games = useMemo(() => gamesQuery.data ?? [], [gamesQuery.data]);

  const initialGame = isEdit ? betQuery.data?.game : defaultGameSetting && findGameConfig(games, defaultGameSetting) ? defaultGameSetting : games[0]?.id;
  const selectedGame = gameOverride ?? initialGame;

  const isPending = gamesQuery.isPending || (isEdit && betQuery.isPending);
  const isError = gamesQuery.isError || (isEdit && betQuery.isError);
  const config = selectedGame ? findGameConfig(games, selectedGame) : undefined;

  const defaultValues = useMemo(() => {
    if (!isEdit || !betQuery.data || !config) return undefined;
    return {
      label: betQuery.data.label ?? "",
      createdAt: betQuery.data.createdAt.slice(0, 10),
      lines: betQuery.data.lines.map((line) => ({ numbers: line.numbers, extras: line.extras }))
    };
  }, [isEdit, betQuery.data, config]);

  // Siembra el título con el nombre ya guardado en cuanto llega de la API, para que en modo
  // edición no aparezca "Editar apuesta" un instante antes de mostrar el nombre real. A partir
  // de ahí, BetForm.onLabelChange (más abajo) toma el relevo y lo mantiene en vivo mientras se teclea.
  if (betQuery.data?.label && betQuery.data.label !== seededLabel) {
    setSeededLabel(betQuery.data.label);
    setLiveLabel(betQuery.data.label);
  }

  const displayName = liveLabel.trim();
  const fallbackTitle = isEdit ? "Editar apuesta" : "Nueva apuesta";
  const breadcrumbs = [{ label: "Mis apuestas", to: "/bets" }, { label: displayName || fallbackTitle }];
  // Incluye el juego en creación (no hay id todavía) y el id en edición, para no mezclar el
  // borrador de una apuesta con el de otra ni con el de un juego distinto.
  const draftKey = isEdit ? `bet:edit:${id}` : `bet:new:${config?.id ?? "unknown"}`;

  if (isPending) {
    return (
      <>
        <PageHeader title={fallbackTitle} breadcrumbs={breadcrumbs} />
        <LoadingState />
      </>
    );
  }

  if (isError || !config) {
    return (
      <>
        <PageHeader title={fallbackTitle} breadcrumbs={breadcrumbs} />
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

  const handleSubmit = (payload: { label?: string; createdAt?: string; lines: { numbers: number[]; extras: Record<string, unknown> }[] }) => {
    setSubmitError(null);
    const onSuccess = (bet: { id: string }) => {
      clearFormDraft(draftKey);
      toast({ title: isEdit ? "Apuesta actualizada" : "Apuesta creada", variant: "success" });
      navigate(`/bets/${bet.id}`);
    };
    const onError = (error: unknown) => {
      if (error instanceof ApiError) {
        setSubmitError(error);
      } else {
        toast({ title: "No se pudo guardar la apuesta. Revisa tu conexión e inténtalo de nuevo.", variant: "error" });
      }
    };

    if (isEdit && id) {
      updateMutation.mutate({ game: config.id, ...payload }, { onSuccess, onError });
    } else {
      createMutation.mutate({ game: config.id, ...payload }, { onSuccess, onError });
    }
  };

  return (
    <div className="w-full mx-auto max-w-full sm:max-w-3xl">
      <PageHeader title={displayName || fallbackTitle} breadcrumbs={breadcrumbs} />
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
        onLabelChange={setLiveLabel}
        draftKey={draftKey}
      />
    </div>
  );
}
