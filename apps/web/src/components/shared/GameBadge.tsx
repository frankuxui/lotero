import { cn } from "@/lib/utils";

const PALETTE = ["indigo", "emerald", "amber", "rose", "sky", "violet", "blue"] as const;

const COLOR_CLASSES: Record<(typeof PALETTE)[number], string> = {
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
  blue: "bg-blue-200 text-blue-700 dark:bg-blue-500/30 dark:text-blue-500"
};

/** Colores fijos para los juegos activos; el resto cae al hash genérico. */
const GAME_COLOR_OVERRIDES: Record<string, (typeof PALETTE)[number]> = {
  BONOLOTO: "blue",
  PRIMITIVA: "emerald"
};

/** Color estable derivado del id del juego para cualquier juego sin color fijo asignado. */
function colorForGame(id: string): (typeof PALETTE)[number] {
  const override = GAME_COLOR_OVERRIDES[id];
  if (override) return override;

  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) % PALETTE.length;
  return PALETTE[Math.abs(hash) % PALETTE.length]!;
}

export function GameBadge({ game, label, className }: { game: string; label?: string; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", COLOR_CLASSES[colorForGame(game)], className)}>{label ?? game}</span>;
}
