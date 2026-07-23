import { Eye, GitCompare, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCombination } from "@/lib/formatters/number";
import type { Draw } from "@/types/draw";
import { cn } from "@/lib/utils";

export function DrawActions({
  draw,
  onDeleteRequest,
  isDeleting,
  className
}: {
  draw: Draw;
  onDeleteRequest: () => void;
  isDeleting?: boolean;
  className?: string;
}) {
  const compareHref = `/compare?game=${encodeURIComponent(draw.game)}&numbers=${encodeURIComponent(formatCombination(draw.numbers))}`;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Tooltip placement="top">
        <TooltipTrigger asChild>
          <Button asChild variant="ghost" size="icon" className="rounded-full" aria-label="Ver sorteo">
            <Link to={`/draws/${draw.id}`}>
              <Eye className="size-4" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Ver sorteo</TooltipContent>
      </Tooltip>

      <Tooltip placement="top">
        <TooltipTrigger asChild>
          <Button asChild variant="ghost" size="icon" className="rounded-full" aria-label="Editar sorteo">
            <Link to={`/draws/${draw.id}/edit`}>
              <Pencil className="size-4" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Editar sorteo</TooltipContent>
      </Tooltip>

      <Tooltip placement="top">
        <TooltipTrigger asChild>
          <Button asChild variant="ghost" size="icon" className="rounded-full" aria-label="Comparar sorteo">
            <Link to={compareHref}>
              <GitCompare className="size-4" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Comparar sorteo</TooltipContent>
      </Tooltip>

      <Tooltip placement="top">
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full" aria-label="Eliminar sorteo" onClick={onDeleteRequest} disabled={isDeleting}>
            <Trash2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Eliminar sorteo</TooltipContent>
      </Tooltip>
    </div>
  );
}
