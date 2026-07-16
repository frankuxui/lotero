export interface FrequencyBucket {
  bg: string;
  text: string;
  label: string;
}

/**
 * Escala de color por intensidad de frecuencia: gris (sin apariciones) → amarillo → amber →
 * rojo intenso (el número que más sale). Centralizada aquí para que el mapa de calor y su
 * leyenda usen exactamente los mismos tramos.
 */
export const FREQUENCY_BUCKETS: FrequencyBucket[] = [
  { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-400 dark:text-slate-600", label: "Sin apariciones" },
  { bg: "bg-yellow-200 dark:bg-yellow-900", text: "text-yellow-900 dark:text-yellow-200", label: "Muy baja" },
  { bg: "bg-yellow-400 dark:bg-yellow-700", text: "text-yellow-950 dark:text-yellow-50", label: "Baja" },
  { bg: "bg-amber-500 dark:bg-amber-600", text: "text-white", label: "Media" },
  { bg: "bg-orange-500 dark:bg-orange-600", text: "text-white", label: "Alta" },
  { bg: "bg-red-600 dark:bg-red-700", text: "text-white", label: "Muy alta" },
];

export function frequencyBucketIndex(count: number, maxCount: number): number {
  if (count === 0) return 0;
  const ratio = maxCount > 0 ? count / maxCount : 0;
  if (ratio <= 0.2) return 1;
  if (ratio <= 0.4) return 2;
  if (ratio <= 0.6) return 3;
  if (ratio <= 0.8) return 4;
  return 5;
}
