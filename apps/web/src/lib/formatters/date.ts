export type DateFormatPreference = "dd/mm/yyyy" | "yyyy-mm-dd" | "long";

export type DateValueType = "plain-date" | "timestamp";

export interface FormatDateOptions {
  /**
   * Formato configurado globalmente por el usuario.
   *
   * - dd/mm/yyyy: 23/07/2026
   * - yyyy-mm-dd: 2026-07-23
   * - long: 23 de julio de 2026
   */
  preference?: DateFormatPreference;

  /**
   * Indica cómo debe interpretarse el valor.
   *
   * - plain-date:
   *   Fecha de calendario sin zona horaria.
   *   Ejemplo: drawDate = "2026-07-23".
   *
   * - timestamp:
   *   Instante temporal que se convierte a la zona local del usuario.
   *   Ejemplo: createdAt = "2026-07-23T18:30:00Z".
   */
  type?: DateValueType;

  /**
   * Incluye la hora cuando el valor es un timestamp.
   */
  includeTime?: boolean;

  /**
   * Configuración regional usada para nombres de meses y hora.
   */
  locale?: string;

  /**
   * Zona horaria usada para timestamps.
   *
   * Si no se especifica, Intl utiliza la zona horaria local del usuario.
   */
  timeZone?: string;
}

const DEFAULT_DATE_PREFERENCE: DateFormatPreference = "dd/mm/yyyy";
const DEFAULT_LOCALE = "es-ES";

/**
 * Punto de entrada único para formatear fechas.
 *
 * Ejemplos:
 *
 * formatDate("2026-07-23", {
 *   type: "plain-date",
 *   preference: "long"
 * });
 * // "23 de julio de 2026"
 *
 * formatDate("2026-07-23T18:30:00Z", {
 *   type: "timestamp",
 *   preference: "dd/mm/yyyy",
 *   includeTime: true
 * });
 * // "23/07/2026, 20:30" en Europe/Madrid durante horario de verano
 */
export function formatDate(value: string, options: FormatDateOptions = {}): string {
  if (typeof value !== "string") {
    return String(value ?? "");
  }

  const input = value.trim();

  if (!input) {
    return value;
  }

  const { preference = DEFAULT_DATE_PREFERENCE, type = "plain-date", includeTime = false, locale = DEFAULT_LOCALE, timeZone } = options;

  try {
    if (type === "plain-date") {
      const plainDate = parsePlainDate(input);

      if (!plainDate) {
        return value;
      }

      return formatDateParts(plainDate, {
        preference,
        locale
      });
    }

    const timestamp = parseIsoTimestamp(input);

    if (!timestamp) {
      return value;
    }

    return formatTimestampValue(timestamp, {
      preference,
      includeTime,
      locale,
      timeZone
    });
  } catch {
    return value;
  }
}

interface DateParts {
  year: number;
  month: number;
  day: number;
}

interface FormatDatePartsOptions {
  preference: DateFormatPreference;
  locale: string;
}

/**
 * Formatea una fecha de calendario sin pasarla por la zona horaria local.
 */
function formatDateParts(parts: DateParts, options: FormatDatePartsOptions): string {
  const { year, month, day } = parts;
  const { preference, locale } = options;

  const paddedYear = String(year).padStart(4, "0");
  const paddedMonth = String(month).padStart(2, "0");
  const paddedDay = String(day).padStart(2, "0");

  switch (preference) {
    case "yyyy-mm-dd":
      return `${paddedYear}-${paddedMonth}-${paddedDay}`;

    case "dd/mm/yyyy":
      return `${paddedDay}/${paddedMonth}/${paddedYear}`;

    case "long": {
      /*
       * Se crea en UTC y se formatea también en UTC para conservar
       * exactamente el año, mes y día de la fecha plana.
       */
      const date = new Date(Date.UTC(year, month - 1, day));

      return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC"
      }).format(date);
    }

    default:
      return assertNever(preference);
  }
}

interface FormatTimestampOptions {
  preference: DateFormatPreference;
  includeTime: boolean;
  locale: string;
  timeZone?: string;
}

/**
 * Formatea un timestamp aplicando la zona horaria local o la indicada.
 */
function formatTimestampValue(date: Date, options: FormatTimestampOptions): string {
  const { preference, includeTime, locale, timeZone } = options;

  const datePartsFormatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone
  });

  const parts = datePartsFormatter.formatToParts(date);

  const year = getFormatPart(parts, "year");
  const month = getFormatPart(parts, "month");
  const day = getFormatPart(parts, "day");

  let formattedDate: string;

  switch (preference) {
    case "yyyy-mm-dd":
      formattedDate = `${year}-${month}-${day}`;
      break;

    case "dd/mm/yyyy":
      formattedDate = `${day}/${month}/${year}`;
      break;

    case "long":
      formattedDate = new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone
      }).format(date);
      break;

    default:
      return assertNever(preference);
  }

  if (!includeTime) {
    return formattedDate;
  }

  const formattedTime = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone
  }).format(date);

  return `${formattedDate}, ${formattedTime}`;
}

/**
 * Valida y descompone estrictamente una fecha YYYY-MM-DD.
 *
 * No acepta fechas imposibles como:
 * - 2026-02-31
 * - 2026-13-01
 */
function parsePlainDate(value: string): DateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText] = match;

  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  const validationDate = new Date(Date.UTC(year, month - 1, day));

  const isValid = validationDate.getUTCFullYear() === year && validationDate.getUTCMonth() === month - 1 && validationDate.getUTCDate() === day;

  if (!isValid) {
    return null;
  }

  return {
    year,
    month,
    day
  };
}

/**
 * Valida timestamps ISO 8601 con zona horaria explícita.
 *
 * Acepta, por ejemplo:
 * - 2026-07-23T18:30Z
 * - 2026-07-23T18:30:00Z
 * - 2026-07-23T18:30:00.123Z
 * - 2026-07-23T18:30:00+02:00
 *
 * No acepta timestamps sin zona horaria, porque su interpretación
 * dependería implícitamente del entorno.
 */
function parseIsoTimestamp(value: string): Date | null {
  const isoTimestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:\d{2})$/;

  if (!isoTimestampPattern.test(value)) {
    return null;
  }

  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    return null;
  }

  const date = new Date(timestamp);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getFormatPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((part) => part.type === type)?.value ?? "";
}

function assertNever(value: never): never {
  throw new Error(`Formato de fecha no soportado: ${String(value)}`);
}

/**
 * Wrapper para fechas planas como drawDate.
 *
 * Se conserva para no tener que modificar inmediatamente todos los usos
 * existentes de formatPlainDate.
 */
export function formatPlainDate(dateStr: string, preference: DateFormatPreference = DEFAULT_DATE_PREFERENCE): string {
  return formatDate(dateStr, {
    type: "plain-date",
    preference
  });
}

/**
 * Wrapper para createdAt, updatedAt y otros timestamps.
 */
export function formatTimestamp(iso: string, preference: DateFormatPreference = DEFAULT_DATE_PREFERENCE): string {
  return formatDate(iso, {
    type: "timestamp",
    preference,
    includeTime: true
  });
}

/**
 * Wrapper para lugares que solo necesitan una fecha sin hora.
 *
 * Ahora respeta la misma preferencia configurada en la aplicación.
 */
export function formatDateLong(value: string, preference: DateFormatPreference = "long"): string {
  const type: DateValueType = isPlainDate(value) ? "plain-date" : "timestamp";

  return formatDate(value, {
    type,
    preference,
    includeTime: false
  });
}

function isPlainDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value.trim());
}
