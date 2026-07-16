import { useState } from "react";
import { GitCompare, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BackButton } from "@/components/shared/BackButton";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ErrorState } from "@/components/shared/ErrorState";
import { GameBadge } from "@/components/shared/GameBadge";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BetLineCard } from "@/features/bets/components/BetLineCard";
import { useBet } from "@/features/bets/hooks/useBet";
import { useDeleteBet } from "@/features/bets/hooks/useBetMutations";
import { useGames } from "@/hooks/useGames";
import { formatCombination } from "@/lib/formatters/number";
import { formatTimestamp } from "@/lib/formatters/date";
import { findGameConfig, gameLabel } from "@/lib/games";
import { useSettingsStore } from "@/store/settingsStore";
import { toast } from "@/store/toastStore";

export default function BetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const betQuery = useBet(id);
  const gamesQuery = useGames();
  const deleteMutation = useDeleteBet();
  const confirmBeforeDelete = useSettingsStore((state) => state.confirmBeforeDelete);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const games = gamesQuery.data ?? [];
  const isPending = betQuery.isPending || gamesQuery.isPending;
  const isError = betQuery.isError || gamesQuery.isError;

  const breadcrumbs = [{ label: "Mis apuestas", to: "/bets" }, { label: betQuery.data?.label || "Detalle" }];

  if (isPending) {
    return (
      <>
        <PageHeader title="Detalle de apuesta" breadcrumbs={breadcrumbs} />
        <LoadingState />
      </>
    );
  }

  if (isError || !betQuery.data) {
    return (
      <>
        <PageHeader title="Detalle de apuesta" breadcrumbs={breadcrumbs} />
        <ErrorState message="No se pudo cargar la apuesta." onRetry={() => void betQuery.refetch()} />
      </>
    );
  }

  const bet = betQuery.data;
  const config = findGameConfig(games, bet.game);

  const handleDelete = () => {
    deleteMutation.mutate(bet.id, {
      onSuccess: () => {
        toast({ title: "Apuesta eliminada", variant: "success" });
        navigate("/bets");
      },
      onError: () => toast({ title: "No se pudo eliminar la apuesta", variant: "error" }),
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
        title={bet.label || "Apuesta sin nombre"}
        breadcrumbs={breadcrumbs}
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link to={`/bets/${bet.id}/edit`}>
                <Pencil aria-hidden="true" />
                Editar
              </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={requestDelete}>
              <Trash2 aria-hidden="true" />
              Eliminar
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <GameBadge game={bet.game} label={gameLabel(games, bet.game)} />
        <span className="text-sm text-slate-500 dark:text-slate-400">Creada el {formatTimestamp(bet.createdAt)}</span>
        <span className="text-sm text-slate-500 dark:text-slate-400">Actualizada el {formatTimestamp(bet.updatedAt)}</span>
      </div>

      <div className="flex flex-col gap-3">
        {bet.lines.map((line, index) => (
          <Card key={line.id}>
            <CardContent className="pt-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Línea {index + 1}</h3>
                <Button asChild variant="ghost" size="sm">
                  <Link
                    to={`/compare?game=${encodeURIComponent(bet.game)}&numbers=${encodeURIComponent(formatCombination(line.numbers))}`}
                  >
                    <GitCompare aria-hidden="true" />
                    Comparar
                  </Link>
                </Button>
              </div>
              <BetLineCard line={line} extrasConfig={config?.extras} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <BackButton fallback="/bets" />
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Eliminar apuesta"
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        isPending={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
