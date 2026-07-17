import { formatLotteryNumber } from "@/lib/formatters/number";
import { cn } from "@/lib/utils";

export function NumberBadge({
  value,
  size = "md",
  variant = "default",
  className
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "match" | "muted" | "extra";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold tabular-nums",
        size === "sm" && "size-6 text-xs",
        size === "md" && "size-8 text-sm",
        size === "lg" && "size-10 text-base",
        variant === "default" && "bg-foreground/10",
        variant === "match" && "bg-emerald-600 text-white",
        variant === "muted" && "bg-slate-50 text-slate-400 dark:bg-slate-900 dark:text-slate-600",
        variant === "extra" && "bg-yellow-500 text-white",
        className
      )}
    >
      {formatLotteryNumber(value)}
    </span>
  );
}
