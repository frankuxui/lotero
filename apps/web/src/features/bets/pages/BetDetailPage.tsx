import { useCallback, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BackButton } from "@/components/shared/BackButton";
import { ConfirmActionDialog } from "@/components/shared/ConfirmActionDialog";
import { ErrorState } from "@/components/shared/ErrorState";
import { GameBadge } from "@/components/shared/GameBadge";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { buttonVariants } from "@/components/ui/button";
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
import { MenuOption } from "@/components/ui";
import type { MenuOptionItem } from "@/components/ui/menuOption";

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
  const bet = betQuery.data;

  const breadcrumbs = [{ label: "Mis apuestas", to: "/bets" }, { label: betQuery.data?.label || "Detalle" }];

  const handleDelete = useCallback(() => {
    if (!bet) {
      return;
    }

    deleteMutation.mutate(bet.id, {
      onSuccess: () => {
        toast({ title: "Apuesta eliminada", variant: "success" });
        setConfirmOpen(false);
        navigate("/bets");
      },
      onError: () => toast({ title: "No se pudo eliminar la apuesta", variant: "error" })
    });
  }, [bet, deleteMutation, navigate]);

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
            Editar apuesta
          </span>
        ),
        href: `/bets/${bet?.id ?? ""}/edit`
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
    [bet?.id, requestDelete]
  );

  if (isPending) {
    return (
      <>
        <PageHeader title="Detalle de apuesta" breadcrumbs={breadcrumbs} />
        <LoadingState />
      </>
    );
  }

  if (isError || !bet) {
    return (
      <>
        <PageHeader title="Detalle de apuesta" breadcrumbs={breadcrumbs} />
        <ErrorState message="No se pudo cargar la apuesta." onRetry={() => void betQuery.refetch()} />
      </>
    );
  }

  const config = findGameConfig(games, bet.game);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-start gap-4">
      <BackButton label="Volver a mis apuestas" fallback="/bets" />
      <GameBadge game={bet.game} label={gameLabel(games, bet.game)} className="px-6 py-2" />
      <div className="flex items-center gap-4 w-full justify-between">
        <PageHeader title={bet.label || "Apuesta sin nombre"} className="flex-1 [&_h1]:text-2xl [&_h1]:leading-8 [&_h1]:font-bold" />
        <MenuOption items={menuItems} className="ml-auto" buttonAriaLabel="Opciones de apuesta" />
      </div>

      <div className="flex flex-col flex-wrap items-start w-full gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-foreground/80">Creada el {formatTimestamp(bet.createdAt)}</span>
          <span className="text-xs text-foreground/80">Actualizada el {formatTimestamp(bet.updatedAt)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {bet.lines.map((line, index) => (
          <Card key={line.id} className="bg-card">
            <CardContent>
              <div className="mb-2 flex items-center justify-between ">
                <h3 className="text-sm font-semibold">Línea {index + 1}</h3>
                <Link
                  className={buttonVariants({ variant: "inverse", size: "xs" })}
                  to={`/compare?game=${encodeURIComponent(bet.game)}&numbers=${encodeURIComponent(formatCombination(line.numbers))}`}
                >
                  Comparar
                </Link>
              </div>
              <BetLineCard line={line} extrasConfig={config?.extras} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <BackButton fallback="/bets" />
      </div>

      <ConfirmActionDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Eliminar apuesta"
        message="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
