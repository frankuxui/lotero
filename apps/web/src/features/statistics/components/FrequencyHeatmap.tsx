import { FREQUENCY_BUCKETS, frequencyBucketIndex } from "@/features/statistics/lib/frequencyScale";
import { formatLotteryNumber } from "@/lib/formatters/number";
import { cn } from "@/lib/utils";
import type { NumberFrequency } from "@/types/statistics";

export function FrequencyHeatmap({ frequencies }: { frequencies: NumberFrequency[] }) {
  const maxCount = Math.max(1, ...frequencies.map((f) => f.count));

  return (
    <div className="grid grid-cols-7 gap-1.5" role="table" aria-label="Frecuencia de cada número">
      {frequencies.map((freq) => {
        const bucket = FREQUENCY_BUCKETS[frequencyBucketIndex(freq.count, maxCount)]!;
        return (
          <div
            key={freq.number}
            role="cell"
            title={`${formatLotteryNumber(freq.number)}: ${freq.count} veces (${freq.percentage}%) — ${bucket.label}`}
            className={cn(
              "flex aspect-square flex-col items-center justify-center rounded-md text-xs font-semibold tabular-nums transition-colors",
              bucket.bg,
              bucket.text,
            )}
          >
            <span>{formatLotteryNumber(freq.number)}</span>
            <span className="text-[10px] font-normal opacity-80">{freq.count}</span>
          </div>
        );
      })}
    </div>
  );
}
