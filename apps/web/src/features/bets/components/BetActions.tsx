import { Copy, Eye, GitCompare, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatCombination } from "@/lib/formatters/number";
import type { Bet } from "@/types/bet";

export function BetActions({
  bet,
  onDuplicate,
  onDeleteRequest,
  isDuplicating,
}: {
  bet: Bet;
  onDuplicate: () => void;
  onDeleteRequest: () => void;
  isDuplicating?: boolean;
}) {
  const firstLine = bet.lines[0];
  const compareHref = firstLine
    ? `/compare?game=${encodeURIComponent(bet.game)}&numbers=${encodeURIComponent(formatCombination(firstLine.numbers))}`
    : undefined;

  return (
    <div className="flex items-center gap-1">
      <Button asChild variant="ghost" size="icon" aria-label="Ver apuesta">
        <Link to={`/bets/${bet.id}`}>
          <Eye className="size-4" />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" aria-label="Editar apuesta">
        <Link to={`/bets/${bet.id}/edit`}>
          <Pencil className="size-4" />
        </Link>
      </Button>
      {compareHref && (
        <Button asChild variant="ghost" size="icon" aria-label="Comparar primera línea">
          <Link to={compareHref}>
            <GitCompare className="size-4" />
          </Link>
        </Button>
      )}
      <Button variant="ghost" size="icon" aria-label="Duplicar apuesta" onClick={onDuplicate} disabled={isDuplicating}>
        <Copy className="size-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Eliminar apuesta" onClick={onDeleteRequest}>
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
