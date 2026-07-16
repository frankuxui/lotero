import { FREQUENCY_BUCKETS } from "@/features/statistics/lib/frequencyScale";
import { cn } from "@/lib/utils";

export function FrequencyLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
      <span className="font-medium">Menos frecuente</span>
      <div className="flex overflow-hidden rounded-md border border-slate-200 dark:border-slate-800" role="img" aria-label="Escala de color por frecuencia, de gris (sin apariciones) a rojo intenso (más frecuente)">
        {FREQUENCY_BUCKETS.map((bucket) => (
          <div key={bucket.label} title={bucket.label} className={cn("h-4 w-8 sm:w-10", bucket.bg)} />
        ))}
      </div>
      <span className="font-medium">Más frecuente</span>
    </div>
  );
}
