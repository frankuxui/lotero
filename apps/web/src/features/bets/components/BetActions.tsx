import { Copy, Eye, GitCompare, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCombination } from "@/lib/formatters/number";
import type { Bet } from "@/types/bet";

export function BetActions({ bet, onDuplicate, onDeleteRequest, isDuplicating }: { bet: Bet; onDuplicate: () => void; onDeleteRequest: () => void; isDuplicating?: boolean }) {
  const firstLine = bet.lines[0];
  const compareHref = firstLine ? `/compare?game=${encodeURIComponent(bet.game)}&numbers=${encodeURIComponent(formatCombination(firstLine.numbers))}` : undefined;

  return (
    <div className="w-full flex items-center justify-between gap-1">
      <Link to={`/bets/${bet.id}`} className="inline-flex items-center justify-center rounded-full size-10 transition-all duration-300 flex-none hover:bg-foreground/5">
        <Eye className="size-5" />
      </Link>

      <Link to={`/bets/${bet.id}/edit`} className="inline-flex items-center justify-center rounded-full size-10 transition-all duration-300 flex-none hover:bg-foreground/5">
        <Pencil className="size-5" />
      </Link>
      {compareHref && (
        <Link to={compareHref} className="inline-flex items-center justify-center rounded-full size-10 transition-all duration-300 flex-none hover:bg-foreground/5">
          <GitCompare className="size-5" />
        </Link>
      )}
      <button
        aria-label="Duplicar apuesta"
        onClick={onDuplicate}
        disabled={isDuplicating}
        className="inline-flex items-center justify-center rounded-full size-10 transition-all duration-300 flex-none hover:bg-foreground/5"
      >
        <Copy className="size-5" />
      </button>
      <button
        aria-label="Eliminar apuesta"
        onClick={onDeleteRequest}
        className="inline-flex items-center justify-center rounded-full size-10 transition-all duration-300 flex-none hover:bg-foreground/5"
      >
        <Trash2 className="size-5" />
      </button>
    </div>
  );
}
