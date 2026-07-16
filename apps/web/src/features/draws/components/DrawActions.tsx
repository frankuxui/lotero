import { Eye, GitCompare, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatCombination } from "@/lib/formatters/number";
import type { Draw } from "@/types/draw";

export function DrawActions({ draw, onDeleteRequest }: { draw: Draw; onDeleteRequest: () => void }) {
  const compareHref = `/compare?game=${encodeURIComponent(draw.game)}&numbers=${encodeURIComponent(formatCombination(draw.numbers))}`;

  return (
    <div className="flex items-center gap-1">
      <Button asChild variant="ghost" size="icon" aria-label="Ver sorteo">
        <Link to={`/draws/${draw.id}`}>
          <Eye className="size-4" />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" aria-label="Editar sorteo">
        <Link to={`/draws/${draw.id}/edit`}>
          <Pencil className="size-4" />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" aria-label="Comparar sorteo">
        <Link to={compareHref}>
          <GitCompare className="size-4" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" aria-label="Eliminar sorteo" onClick={onDeleteRequest}>
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
