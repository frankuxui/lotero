import { cn } from "@/lib/utils";

const PALETTE = ["indigo", "emerald", "amber", "rose", "sky", "violet"] as const;

const COLOR_CLASSES: Record<(typeof PALETTE)[number], string> = {
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
};

/** Color estable derivado del id del juego (sin listar juegos concretos a mano). */
function colorForGame(id: string): (typeof PALETTE)[number] {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) % PALETTE.length;
  return PALETTE[Math.abs(hash) % PALETTE.length]!;
}

export function GameBadge({ game, label, className }: { game: string; label?: string; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", COLOR_CLASSES[colorForGame(game)], className)}>{label ?? game}</span>;
}
