import type { ZodType } from "zod";

/**
 * Borradores de formulario (apuesta/sorteo en curso) persistidos en sessionStorage.
 *
 * Por qué sessionStorage y no un estado en memoria: en móvil, minimizar el navegador puede
 * hacer que iOS Safari/Android Chrome descarguen la pestaña bajo presión de memoria y la
 * recarguen desde cero al volver a primer plano. Eso destruye todo el estado de React (y con
 * él, el de React Hook Form), sin que medie ningún refetch ni reset explícito: simplemente la
 * página se remonta desde cero. Ningún ajuste de TanStack Query (refetchOnWindowFocus, etc.)
 * evita esto, porque no es un refetch lo que borra los datos. sessionStorage sí sobrevive a esa
 * recarga porque el navegador la restaura junto con la pestaña (se pierde solo si se cierra la
 * pestaña/ventana, que es el comportamiento esperado para un borrador).
 *
 * Las claves incluyen el modo (nuevo/edición) y, en edición, el id — ver los `draftKey` que
 * arman BetFormPage/DrawFormPage — para no mezclar el borrador de una apuesta con el de otra.
 */
const PREFIX = "lotero:draft:";

function getStorage(): Storage | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return window.sessionStorage;
  } catch {
    // Modo privado en algunos navegadores puede lanzar al acceder a sessionStorage.
    return undefined;
  }
}

export function readFormDraft<T>(key: string): T | undefined {
  const storage = getStorage();
  if (!storage) return undefined;
  try {
    const raw = storage.getItem(PREFIX + key);
    if (!raw) return undefined;
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

/**
 * Lee el borrador y lo valida contra un schema "de forma" (permisivo, no el schema estricto de
 * envío): un borrador a medio rellenar no cumple las reglas de negocio (p. ej. números
 * incompletos), así que solo se comprueba que la forma general sea la esperada, para no
 * reventar si el borrador quedó corrupto o pertenece a una versión anterior del formulario.
 */
export function readValidFormDraft<T>(key: string, shapeSchema: ZodType<T>): T | undefined {
  const raw = readFormDraft<unknown>(key);
  if (raw === undefined) return undefined;
  const result = shapeSchema.safeParse(raw);
  return result.success ? result.data : undefined;
}

export function writeFormDraft<T>(key: string, value: T): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Cuota excedida o modo privado: perder el borrador es aceptable, no debe romper el formulario.
  }
}

export function clearFormDraft(key: string): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(PREFIX + key);
  } catch {
    // no-op
  }
}
