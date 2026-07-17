import { cn } from "@/lib/utils";
import type { SuggestionOutcome } from "@/types/suggestion";

export function SuggestionOutcomeBadge({ outcome, className }: { outcome: SuggestionOutcome; className?: string }) {
  if (outcome.status === "pending") {
    return (
      <span className={cn("inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400", className)}>
        Pendiente
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        outcome.matches > 0
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
        className,
      )}
    >
      {outcome.matches}/{outcome.totalNumbers} aciertos
    </span>
  );
}
