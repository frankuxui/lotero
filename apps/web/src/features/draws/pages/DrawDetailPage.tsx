import { useCallback, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
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
import { MenuOption } from "@/components/ui";
import { buttonVariants } from "@/components/ui/button";
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
import type { MenuOptionItem } from "@/components/ui/menuOption";

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
  const draw = drawQuery.data;

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

  const handleDelete = useCallback(() => {
    if (!draw) {
      return;
    }

    deleteMutation.mutate(draw.id, {
      onSuccess: () => {
        toast({ title: "Sorteo eliminado", variant: "success" });
        setConfirmOpen(false);
        navigate("/draws");
      },
      onError: () => toast({ title: "No se pudo eliminar el sorteo", variant: "error" })
    });
  }, [deleteMutation, draw, navigate]);

  const requestDelete = useCallback(() => {
    if (confirmBeforeDelete) {
      setConfirmOpen(true);
    } else {
      handleDelete();
    }
  }, [confirmBeforeDelete, handleDelete]);

  const menuItems = useMemo<readonly MenuOptionItem[]>(
    () => [
      {
        key: "edit",
        label: (
          <span className="inline-flex items-center gap-2">
            <Pencil className="size-4" aria-hidden="true" />
            Editar sorteo
          </span>
        ),
        href: `/draws/${draw?.id ?? ""}/edit`
      },
      {
        key: "delete",
        label: (
          <span className="inline-flex items-center gap-2 text-red-600 dark:text-red-400">
            <Trash2 className="size-4" aria-hidden="true" />
            Eliminar
          </span>
        ),
        onClick: requestDelete,
        className: "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
      }
    ],
    [draw?.id, requestDelete]
  );

  if (isPending) {
    return (
      <>
        <PageHeader title="Detalle de sorteo" breadcrumbs={breadcrumbs} />
        <LoadingState />
      </>
    );
  }

  if (isError || !draw) {
    return (
      <>
        <PageHeader title="Detalle de sorteo" breadcrumbs={breadcrumbs} />
        <ErrorState message="No se pudo cargar el sorteo." onRetry={() => void drawQuery.refetch()} />
      </>
    );
  }

  const config = findGameConfig(games, draw.game);
  const compareHref = `/compare?game=${encodeURIComponent(draw.game)}&numbers=${encodeURIComponent(formatCombination(draw.numbers))}`;
  const topMatches = (matchesQuery.data?.results ?? []).slice(0, 3);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-start gap-4">
      <BackButton label="Regresar a sorteos" fallback="/draws" />
      <GameBadge game={draw.game} label={gameLabel(games, draw.game)} className="px-6 py-2" />
      <div className="flex items-center gap-4 w-full justify-between">
        <PageHeader title={`Sorteo ${formatPlainDate(draw.drawDate, dateFormat)}`} className="flex-1 [&_h1]:text-2xl [&_h1]:leading-8 [&_h1]:font-bold" />
        <MenuOption items={menuItems} className="ml-auto" buttonAriaLabel="Opciones de apuesta" />
      </div>

      <div className="flex items-center justify-between w-full gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-foreground/80">Creada el {formatTimestamp(draw.createdAt)}</span>
          <span className="text-xs text-foreground/80">Actualizada el {formatTimestamp(draw.updatedAt)}</span>
        </div>
        <Link className={buttonVariants({ variant: "inverse", size: "xs" })} to={compareHref}>
          Comparar
        </Link>
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
                  <div key={extra.key} className="flex items-center gap-1 text-xs bg-foreground/5 rounded-full px-2 py-1">
                    <span className="font-medium px-2">{extra.label}:</span>
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

        {matchesQuery.isSuccess && topMatches.length === 0 && <EmptyState title="Sin coincidencias todavía" description="Ninguna de tus apuestas comparte números con este sorteo." />}

        {matchesQuery.isSuccess && topMatches.length > 0 && (
          <div className="grid gap-3 mt-8">
            {topMatches.map((match) => (
              <ComparisonResultCard key={match.recordId} result={match} gameLabel={gameLabel(games, match.game)} to={match.betId ? `/bets/${match.betId}` : undefined} />
            ))}
          </div>
        )}
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
    </div>
  );
}
