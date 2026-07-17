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
      data-slot-badge
      className={cn(
        "inline-flex flex-none items-center justify-center rounded-full font-semibold tabular-nums",
        size === "sm" && "size-6 text-xs",
        size === "md" && "size-8 text-sm",
        size === "lg" && "size-9 text-sm",
        variant === "default" && "bg-foreground/10",
        variant === "match" && "bg-green-700 text-white",
        variant === "muted" && "bg-foreground/10",
        variant === "extra" && "bg-yellow-500 text-white",
        className
      )}
    >
      {formatLotteryNumber(value)}
    </span>
  );
}
