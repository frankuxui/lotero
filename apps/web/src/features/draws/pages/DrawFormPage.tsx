import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorState } from "@/components/shared/ErrorState";
import { GameSelector } from "@/components/shared/GameSelector";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Label } from "@/components/ui/label";
import { DrawForm } from "@/features/draws/components/DrawForm";
import { useDraw } from "@/features/draws/hooks/useDraw";
import { useCreateDraw, useUpdateDraw } from "@/features/draws/hooks/useDrawMutations";
import { useGames } from "@/hooks/useGames";
import { ApiError } from "@/lib/api/client";
import { findGameConfig } from "@/lib/games";
import { clearFormDraft } from "@/lib/storage/formDraft";
import { useSettingsStore } from "@/store/settingsStore";
import { toast } from "@/store/toastStore";

export default function DrawFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const defaultGameSetting = useSettingsStore((state) => state.defaultGame);

  const gamesQuery = useGames();
  const drawQuery = useDraw(id);
  const createMutation = useCreateDraw();
  const updateMutation = useUpdateDraw(id ?? "");

  const [gameOverride, setGameOverride] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<ApiError | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const games = useMemo(() => gamesQuery.data ?? [], [gamesQuery.data]);

  const initialGame = isEdit ? drawQuery.data?.game : defaultGameSetting && findGameConfig(games, defaultGameSetting) ? defaultGameSetting : games[0]?.id;
  const selectedGame = gameOverride ?? initialGame;

  const isPending = gamesQuery.isPending || (isEdit && drawQuery.isPending);
  const isError = gamesQuery.isError || (isEdit && drawQuery.isError);
  const config = selectedGame ? findGameConfig(games, selectedGame) : undefined;

  const defaultValues = useMemo(() => {
    if (!isEdit || !drawQuery.data || !config) return undefined;
    return {
      drawDate: drawQuery.data.drawDate,
      numbers: drawQuery.data.numbers,
      extras: drawQuery.data.extras
    };
  }, [isEdit, drawQuery.data, config]);

  const breadcrumbs = [{ label: "Sorteos", to: "/draws" }, { label: isEdit ? "Editar" : "Nuevo" }];
  // En creación no incluye `resetKey`: el borrador debe sobrevivir mientras se sigue
  // escribiendo el mismo sorteo, y se limpia explícitamente al guardar con éxito (más abajo).
  const draftKey = isEdit ? `draw:edit:${id}` : `draw:new:${config?.id ?? "unknown"}`;

  if (isPending) {
    return (
      <>
        <PageHeader title={isEdit ? "Editar sorteo" : "Nuevo sorteo"} breadcrumbs={breadcrumbs} />
        <LoadingState />
      </>
    );
  }

  if (isError || !config) {
    return (
      <>
        <PageHeader title={isEdit ? "Editar sorteo" : "Nuevo sorteo"} breadcrumbs={breadcrumbs} />
        <ErrorState
          message="No se pudo cargar el formulario."
          onRetry={() => {
            void gamesQuery.refetch();
            if (isEdit) void drawQuery.refetch();
          }}
        />
      </>
    );
  }

  const handleSubmit = (payload: { drawDate: string; numbers: number[]; extras: Record<string, unknown> }) => {
    setSubmitError(null);
    const onSuccess = (draw: { id: string }) => {
      clearFormDraft(draftKey);
      if (isEdit) {
        toast({ title: "Sorteo actualizado", variant: "success" });
        navigate(`/draws/${draw.id}`);
        return;
      }
      toast({ title: "Sorteo creado", variant: "success" });
      setResetKey((key) => key + 1);
    };
    const onError = (error: unknown) => {
      if (error instanceof ApiError) {
        setSubmitError(error);
      } else {
        toast({ title: "No se pudo guardar el sorteo. Revisa tu conexión e inténtalo de nuevo.", variant: "error" });
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
      <PageHeader title={isEdit ? "Editar sorteo" : "Nuevo sorteo"} breadcrumbs={breadcrumbs} />
      <div className="mb-6 flex flex-col gap-1.5 sm:max-w-xs">
        <Label htmlFor="draw-game">Juego</Label>
        <GameSelector id="draw-game" games={games} value={config.id} onChange={setGameOverride} />
      </div>
      <DrawForm
        key={`${config.id}-${resetKey}`}
        config={config}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        submitLabel={isEdit ? "Guardar cambios" : "Crear sorteo"}
        serverError={submitError}
        draftKey={draftKey}
      />
    </div>
  );
}
