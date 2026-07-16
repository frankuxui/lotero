import type { ApiFailure, ApiSuccess, ApiSuccessPaged, Paginated, ZodIssueLike } from "@/types/api";

const API_URL = import.meta.env.VITE_API_URL;

if (import.meta.env.DEV) {
  if (API_URL) {
    // Ayuda a diagnosticar el caso "funciona en localhost pero no por IP LAN":
    // confirma en la consola qué URL de API quedó realmente embebida en este build.
    console.info(`[api] VITE_API_URL = ${API_URL}`);
  } else {
    console.warn(
      "[api] VITE_API_URL no está definida. Revisa apps/web/.env y reinicia `npm run dev` " +
        "(Vite solo lee .env al arrancar, no cuando lo editas). Sin esta variable, las " +
        "peticiones se construyen con una URL relativa rota y fallan en silencio.",
    );
  }
}

export class ApiError extends Error {
  readonly status: number;
  readonly details?: ZodIssueLike[] | unknown;

  constructor(status: number, message: string, details?: ZodIssueLike[] | unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }

  /** Errores de validación (400 con details en forma de ZodIssue[]) que se pueden mapear a campos de formulario. */
  get fieldIssues(): ZodIssueLike[] {
    if (Array.isArray(this.details)) {
      return this.details.filter(
        (issue): issue is ZodIssueLike =>
          typeof issue === "object" && issue !== null && "path" in issue && "message" in issue,
      );
    }
    return [];
  }
}

export type QueryParamValue = string | number | boolean | undefined | null;

/**
 * Sin VITE_API_URL, `${API_URL}${path}` deja de ser una URL absoluta y pasa a ser una ruta
 * relativa a la página actual (p. ej. "undefined/api/draws"). El navegador la resuelve contra
 * el propio origen del frontend en vez de contra la API, así que el fetch "funciona" pero
 * nunca llega al backend: la UI recibe un 404/HTML del propio Vite en vez de datos, y sin este
 * chequeo el fallo es silencioso hasta que se lee la consola. Fallar aquí lo convierte en un
 * error visible e inmediato en la UI (vía ErrorState), en vez de una lista vacía sin explicación.
 */
function resolveApiUrl(path: string): string {
  if (!API_URL) {
    throw new ApiError(
      0,
      "La app no tiene configurada la URL de la API (VITE_API_URL). Revisa apps/web/.env y reinicia el servidor de desarrollo.",
    );
  }
  return `${API_URL}${path}`;
}

function buildQueryString(params?: Record<string, QueryParamValue>): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  params?: Record<string, QueryParamValue>;
  body?: unknown;
  signal?: AbortSignal;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", params, body, signal } = options;
  const url = `${resolveApiUrl(path)}${buildQueryString(params)}`;

  const response = await fetch(url, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  let payload: ApiSuccess<T> | ApiFailure | undefined;
  try {
    payload = await response.json();
  } catch {
    payload = undefined;
  }

  if (!response.ok || !payload || payload.success === false) {
    const failure = payload as ApiFailure | undefined;
    throw new ApiError(
      response.status,
      failure?.error?.message ?? "Error de comunicación con el servidor",
      failure?.error?.details,
    );
  }

  return payload.data;
}

async function requestPaged<T>(path: string, options: RequestOptions = {}): Promise<Paginated<T>> {
  const { method = "GET", params, body, signal } = options;
  const url = `${resolveApiUrl(path)}${buildQueryString(params)}`;

  const response = await fetch(url, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  let payload: ApiSuccessPaged<T> | ApiFailure | undefined;
  try {
    payload = await response.json();
  } catch {
    payload = undefined;
  }

  if (!response.ok || !payload || payload.success === false) {
    const failure = payload as ApiFailure | undefined;
    throw new ApiError(
      response.status,
      failure?.error?.message ?? "Error de comunicación con el servidor",
      failure?.error?.details,
    );
  }

  return { items: payload.data, meta: payload.meta };
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "GET" }),
  getPaged: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    requestPaged<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
