export type DateFormatPreference = "dd/mm/yyyy" | "yyyy-mm-dd";

/**
 * Formatea una fecha "plana" (drawDate de sorteo/apuesta, tipo "2026-07-10") sin pasar por
 * Date/zona horaria, para evitar que un sorteo del día 10 se muestre como día 9 en zonas
 * horarias al oeste de UTC.
 */
export function formatPlainDate(dateStr: string, preference: DateFormatPreference = "dd/mm/yyyy"): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
  if (!match) return dateStr;
  const [, year, month, day] = match;
  if (preference === "yyyy-mm-dd") return `${year}-${month}-${day}`;
  return `${day}/${month}/${year}`;
}

/** Formatea un timestamp ISO completo (createdAt/updatedAt) en la zona horaria local del usuario. */
export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
