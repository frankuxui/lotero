import type { ReactNode } from "react";
import { PackageOpen } from "lucide-react";

export function EmptyState({ title = "Sin resultados", description, icon, action }: { title?: string; description?: string; icon?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg py-16 text-center bg-foreground/2">
      <div className="text-foreground">{icon ?? <PackageOpen className="size-8" strokeWidth={1.5} aria-hidden="true" />}</div>
      <div>
        <p className="font-medium text-slate-700 dark:text-slate-200">{title}</p>
        {description && <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}
