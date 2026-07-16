import { Eye, GitCompare, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatCombination } from "@/lib/formatters/number";
import type { Draw } from "@/types/draw";
import { cn } from "@/lib/utils";

export function DrawActions({ draw, onDeleteRequest, className }: { draw: Draw; onDeleteRequest: () => void; className?: string }) {
  const compareHref = `/compare?game=${encodeURIComponent(draw.game)}&numbers=${encodeURIComponent(formatCombination(draw.numbers))}`;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button asChild variant="ghost" size="icon" className="rounded-full" aria-label="Ver sorteo">
        <Link to={`/draws/${draw.id}`}>
          <Eye className="size-4" />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" className="rounded-full" aria-label="Editar sorteo">
        <Link to={`/draws/${draw.id}/edit`}>
          <Pencil className="size-4" />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" className="rounded-full" aria-label="Comparar sorteo">
        <Link to={compareHref}>
          <GitCompare className="size-4" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" className="rounded-full" aria-label="Eliminar sorteo" onClick={onDeleteRequest}>
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
