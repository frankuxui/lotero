import { useState } from "react";
import { GitCompare, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BackButton } from "@/components/shared/BackButton";
import { ConfirmActionDialog } from "@/components/shared/ConfirmActionDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { GameBadge } from "@/components/shared/GameBadge";
import { LoadingState } from "@/components/shared/LoadingState";
import { NumberBadge } from "@/components/shared/NumberBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ComparisonResultCard } from "@/features/comparison/components/ComparisonResultCard";
import { useComparisonResult } from "@/features/comparison/hooks/useComparisonResult";
import { useDraw } from "@/features/draws/hooks/useDraw";
import { useDeleteDraw } from "@/features/draws/hooks/useDrawMutations";
import { useGames } from "@/hooks/useGames";
import { formatPlainDate, formatTimestamp } from "@/lib/formatters/date";
import { formatCombination } from "@/lib/formatters/number";
import { findGameConfig, gameLabel } from "@/lib/games";
import { useSettingsStore } from "@/store/settingsStore";
import { toast } from "@/store/toastStore";

export default function DrawDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const drawQuery = useDraw(id);
  const gamesQuery = useGames();
  const deleteMutation = useDeleteDraw();
  const dateFormat = useSettingsStore((state) => state.dateFormat);
  const confirmBeforeDelete = useSettingsStore((state) => state.confirmBeforeDelete);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const games = gamesQuery.data ?? [];
  const isPending = drawQuery.isPending || gamesQuery.isPending;
  const isError = drawQuery.isError || gamesQuery.isError;

  const matchesQuery = useComparisonResult(
    {
      game: drawQuery.data?.game ?? "",
      numbers: drawQuery.data?.numbers ?? [],
      extras: drawQuery.data?.extras ?? {},
      source: "bets",
      minMatches: 1
    },
    { enabled: Boolean(drawQuery.data) }
  );

  const breadcrumbs = [{ label: "Sorteos", to: "/draws" }, { label: "Detalle" }];

  if (isPending) {
    return (
      <>
        <PageHeader title="Detalle de sorteo" breadcrumbs={breadcrumbs} />
        <LoadingState />
      </>
    );
  }

  if (isError || !drawQuery.data) {
    return (
      <>
        <PageHeader title="Detalle de sorteo" breadcrumbs={breadcrumbs} />
        <ErrorState message="No se pudo cargar el sorteo." onRetry={() => void drawQuery.refetch()} />
      </>
    );
  }

  const draw = drawQuery.data;
  const config = findGameConfig(games, draw.game);
  const compareHref = `/compare?game=${encodeURIComponent(draw.game)}&numbers=${encodeURIComponent(formatCombination(draw.numbers))}`;
  const topMatches = (matchesQuery.data?.results ?? []).slice(0, 3);

  const handleDelete = () => {
    deleteMutation.mutate(draw.id, {
      onSuccess: () => {
        toast({ title: "Sorteo eliminado", variant: "success" });
        setConfirmOpen(false);
        navigate("/draws");
      },
      onError: () => toast({ title: "No se pudo eliminar el sorteo", variant: "error" })
    });
  };

  const requestDelete = () => {
    if (confirmBeforeDelete) {
      setConfirmOpen(true);
    } else {
      handleDelete();
    }
  };

  return (
    <>
      <PageHeader
        title={`Sorteo ${formatPlainDate(draw.drawDate, dateFormat)}`}
        breadcrumbs={breadcrumbs}
        actions={
          <div className="w-full flex items-center justify-between gap-2">
            <Button asChild variant="outline" size="default" className="flex-1">
              <Link to={compareHref}>
                <GitCompare aria-hidden="true" />
                Comparar
              </Link>
            </Button>
            <Button asChild variant="outline" size="default" className="flex-1">
              <Link to={`/draws/${draw.id}/edit`}>
                <Pencil aria-hidden="true" />
                Editar
              </Link>
            </Button>
            <Button variant="destructive" size="default" className="flex-1" onClick={requestDelete}>
              <Trash2 aria-hidden="true" />
              Eliminar
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <GameBadge game={draw.game} label={gameLabel(games, draw.game)} className="px-4 py-1.5" />
        <span className="text-sm text-slate-500 dark:text-slate-400">Creado el {formatTimestamp(draw.createdAt)}</span>
        <span className="text-sm text-slate-500 dark:text-slate-400">Actualizado el {formatTimestamp(draw.updatedAt)}</span>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-2">
            {draw.numbers.map((n) => (
              <NumberBadge key={n} value={n} size="lg" />
            ))}
          </div>
          {config && config.extras.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {config.extras.map((extra) => {
                const raw = draw.extras[extra.key];
                if (raw === undefined || raw === null || raw === "") return null;
                return (
                  <div key={extra.key} className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{extra.label.charAt(0).toUpperCase()}:</span>
                    {typeof raw === "number" ? <NumberBadge value={raw} variant="extra" /> : <span className="text-sm text-slate-700 dark:text-slate-200">{String(raw)}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <SectionHeader title="Tus apuestas más cercanas" description="Líneas de tus apuestas que comparten al menos un número con este sorteo." />

        {matchesQuery.isPending && <LoadingState />}

        {matchesQuery.isError && <ErrorState message="No se pudieron cargar tus apuestas." onRetry={() => void matchesQuery.refetch()} />}

        {matchesQuery.isSuccess && topMatches.length === 0 && (
          <EmptyState title="Sin coincidencias todavía" description="Ninguna de tus apuestas comparte números con este sorteo." />
        )}

        {matchesQuery.isSuccess && topMatches.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topMatches.map((match) => (
              <ComparisonResultCard key={match.recordId} result={match} gameLabel={gameLabel(games, match.game)} to={match.betId ? `/bets/${match.betId}` : undefined} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <BackButton fallback="/draws" />
      </div>

      <ConfirmActionDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Eliminar sorteo"
        message="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
