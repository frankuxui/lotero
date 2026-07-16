import type { ReactNode } from "react";
import { PackageOpen } from "lucide-react";

export function EmptyState({ title = "Sin resultados", description, icon, action }: { title?: string; description?: string; icon?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg px-6 py-16 text-center bg-foreground/2">
      <div className="text-foreground">{icon ?? <PackageOpen className="size-8" strokeWidth={1.5} aria-hidden="true" />}</div>
      <div className="flex flex-col items-center gap-1">
        <p className="font-medium text-foreground">{title}</p>
        {description && <p className="max-w-sm text-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}
