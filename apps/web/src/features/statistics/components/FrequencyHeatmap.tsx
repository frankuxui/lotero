import { formatLotteryNumber } from "@/lib/formatters/number";
import { cn } from "@/lib/utils";
import type { NumberFrequency } from "@/types/statistics";

function bucketClasses(intensity: number): string {
  if (intensity === 0) return "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600";
  if (intensity < 0.25) return "bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300";
  if (intensity < 0.5) return "bg-indigo-300 text-indigo-950 dark:bg-indigo-800 dark:text-indigo-50";
  if (intensity < 0.75) return "bg-indigo-500 text-white dark:bg-indigo-600 dark:text-white";
  return "bg-indigo-700 text-white dark:bg-indigo-500 dark:text-white";
}

export function FrequencyHeatmap({ frequencies }: { frequencies: NumberFrequency[] }) {
  const maxCount = Math.max(1, ...frequencies.map((f) => f.count));

  return (
    <div className="grid grid-cols-7 gap-1.5" role="table" aria-label="Frecuencia de cada número">
      {frequencies.map((freq) => (
        <div
          key={freq.number}
          role="cell"
          title={`${formatLotteryNumber(freq.number)}: ${freq.count} veces (${freq.percentage}%)`}
          className={cn(
            "flex aspect-square flex-col items-center justify-center rounded-md text-xs font-semibold tabular-nums transition-colors",
            bucketClasses(freq.count / maxCount),
          )}
        >
          <span>{formatLotteryNumber(freq.number)}</span>
          <span className="text-[10px] font-normal opacity-80">{freq.count}</span>
        </div>
      ))}
    </div>
  );
}
