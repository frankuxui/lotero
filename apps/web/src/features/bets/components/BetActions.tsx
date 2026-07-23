import { Copy, Eye, GitCompare, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCombination } from "@/lib/formatters/number";
import type { Bet } from "@/types/bet";

export function BetActions({
  bet,
  onDuplicate,
  onDeleteRequest,
  isDuplicating,
  isDeleting
}: {
  bet: Bet;
  onDuplicate: () => void;
  onDeleteRequest: () => void;
  isDuplicating?: boolean;
  isDeleting?: boolean;
}) {
  const firstLine = bet.lines[0];
  const compareHref = firstLine ? `/compare?game=${encodeURIComponent(bet.game)}&numbers=${encodeURIComponent(formatCombination(firstLine.numbers))}` : undefined;

  return (
    <div className="w-full flex items-center justify-between gap-1">
      <Tooltip placement="top">
        <TooltipTrigger asChild>
          <Link
            to={`/bets/${bet.id}`}
            aria-label="Ver apuesta"
            className="inline-flex items-center justify-center rounded-full size-10 transition-all duration-300 flex-none hover:bg-foreground/5"
          >
            <Eye className="size-5" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Ver apuesta</TooltipContent>
      </Tooltip>

      <Tooltip placement="top">
        <TooltipTrigger asChild>
          <Link
            to={`/bets/${bet.id}/edit`}
            aria-label="Editar apuesta"
            className="inline-flex items-center justify-center rounded-full size-10 transition-all duration-300 flex-none hover:bg-foreground/5"
          >
            <Pencil className="size-5" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Editar apuesta</TooltipContent>
      </Tooltip>

      {compareHref && (
        <Tooltip placement="top">
          <TooltipTrigger asChild>
            <Link
              to={compareHref}
              aria-label="Comparar combinación"
              className="inline-flex items-center justify-center rounded-full size-10 transition-all duration-300 flex-none hover:bg-foreground/5"
            >
              <GitCompare className="size-5" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Comparar combinación</TooltipContent>
        </Tooltip>
      )}

      <Tooltip placement="top">
        <TooltipTrigger asChild>
          <button
            aria-label="Duplicar apuesta"
            onClick={onDuplicate}
            disabled={isDuplicating}
            className="inline-flex items-center justify-center rounded-full size-10 transition-all duration-300 flex-none hover:bg-foreground/5"
          >
            <Copy className="size-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>Duplicar apuesta</TooltipContent>
      </Tooltip>

      <Tooltip placement="top">
        <TooltipTrigger asChild>
          <button
            aria-label="Eliminar apuesta"
            onClick={onDeleteRequest}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-full size-10 transition-all duration-300 flex-none hover:bg-foreground/5"
          >
            <Trash2 className="size-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>Eliminar apuesta</TooltipContent>
      </Tooltip>
    </div>
  );
}
