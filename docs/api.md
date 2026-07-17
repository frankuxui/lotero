# API

> **Propósito:** documentar módulos, endpoints, contratos, errores y persistencia.
> **Cuándo leer:** antes de modificar `apps/api` o integrar un consumidor.
> **Alcance:** workspace `@lotero/api` y contrato HTTP `/api`.
> **Responsable:** mantenimiento API y datos.
> **Última revisión:** 2026-07-17.
> **Rutas relacionadas:** [`../apps/api/src`](../apps/api/src), [`frontend.md`](frontend.md), [`business-rules.md`](business-rules.md).

## Composición

`server.ts` crea la aplicación y escucha. `app.ts` configura CORS, JSON, `pino-http`, health, routers, 404 y error handler. Sorteos y apuestas separan controller, service y repository; los módulos analíticos reutilizan los repositorios. El módulo `suggestions` sigue la misma separación (controller/service/repository/engine) y se regenera al crear o actualizar un sorteo mediante un callback no bloqueante desde `draw.service.ts`.

## Contratos comunes

```ts
{ success: true, data: T }
{ success: true, data: T[], meta: { total, limit, offset } }
{ success: false, error: { message: string, details?: unknown } }
```

Zod produce 400, juego o recurso inexistente produce 404 y los errores no controlados producen 500 sin filtrar detalles. Los borrados correctos responden 204 sin cuerpo.

## Endpoints

| Método y ruta | Entrada | Respuesta y consumidor web | Errores |
|---|---|---|---|
| `GET /api/health` | — | Estado y uptime; sin consumidor | 500 |
| `GET /api/games` | — | `GameConfig[]`; todos los formularios/selectores | 500 |
| `GET /api/games/:id` | `id` | `GameConfig`; cliente disponible, sin uso actual | 400, 404 |
| `GET /api/draws` | `game,dateFrom,dateTo,limit,offset` | Lista paginada; sorteos e historial | 400, 404 |
| `POST /api/draws` | `game,drawDate,numbers,extras` | Sorteo, 201; formulario | 400, 404 |
| `GET /api/draws/:id` | `id` | Sorteo; detalle y edición | 404 |
| `PATCH /api/draws/:id` | Campos parciales | Sorteo actualizado | 400, 404 |
| `DELETE /api/draws/:id` | `id` | 204; lista y detalle | 404 |
| `GET /api/bets` | `game,dateFrom,dateTo,limit,offset` | Lista paginada; apuestas e historial | 400, 404 |
| `POST /api/bets` | `game,label?,lines[]` | Apuesta, 201; formulario y duplicación | 400, 404 |
| `GET /api/bets/:id` | `id` | Apuesta con líneas; detalle y edición | 404 |
| `PATCH /api/bets/:id` | Campos parciales | Apuesta actualizada | 400, 404 |
| `DELETE /api/bets/:id` | `id` | 204; lista y detalle | 404 |
| `POST /api/comparison` | `game,numbers,source,dateFrom?,dateTo?,minMatches?,extras?` | Ranking; comparador, dashboard y resumen de apuestas en detalle de sorteo | 400, 404 |
| `GET /api/statistics` | `game,dateFrom?,dateTo?` | Estadísticas | 400, 404 |
| `GET /api/numbers/:number` | Entero; `game?` | Detalle de número | 400, 404 |
| `GET /api/dashboard` | — | Resumen agregado | 500 |
| `GET /api/suggestions/today` | — | `Suggestion[]` (una por juego registrado); sección "Sugerencia del día" del dashboard | 500 |
| `GET /api/suggestions` | `game?,dateFrom?,dateTo?,limit,offset` | Lista paginada con `outcome` calculado al vuelo; histórico de sugerencias | 400, 404 |

Las rutas responsables están en `src/modules/*/*.routes.ts`; controllers adaptan HTTP, services validan/orquestan y repositories acceden a datos.

## Sugerencias ("Sugerencia del día")

`suggestion.engine.ts` genera una combinación por juego combinando tres señales ponderadas (`ALGORITMO_VERSION = "v1"`):

| Señal | Peso | Fuente |
|---|---|---|
| Proximidad numérica | 0.40 | Cercanía a números de los últimos 10 sorteos, con decaimiento por recencia y distancia (radio 2) |
| Coincidencia de calendario | 0.35 | Números que salieron en el mismo día/mes (±3 días) en años anteriores, ignorando el año |
| Frecuencia/"frialdad" | 0.25 | Reutiliza `computeStatistics()` del módulo de estadísticas, sin duplicar lógica |

La sugerencia se **persiste** (tabla `suggestions`, índice único `game + suggestion_date`) en vez de recalcularse en cada lectura: no existe infraestructura de cron/scheduler en este repositorio (ver [deuda técnica](technical-debt.md)) y la ingesta de sorteos es siempre manual vía `POST /api/draws`. La regeneración se dispara ahí mismo (no bloqueante, con `try/catch` que no falla la petición del sorteo) y `GET /api/suggestions/today` tiene un fallback perezoso que genera la sugerencia si falta para la fecha actual.

El acierto/desacierto (`SuggestionOutcome`) **no se persiste**: se calcula en el momento de la lectura cruzando la fecha de la sugerencia con los sorteos reales de ese juego y fecha, para evitar datos derivados duplicados.

## Persistencia

| Tabla | Contenido |
|---|---|
| `draws` | Juego, fecha, números, extras y timestamps |
| `bets` | Juego, etiqueta y timestamps |
| `bet_lines` | Líneas asociadas con números y extras |
| `suggestions` | Juego, fecha, números, extras, `algorithm_version`, desglose de señales (`signals`) y timestamps; índice único `(game, suggestion_date)` |

Los UUID se generan con `crypto.randomUUID`. Las creaciones/actualizaciones multilínea usan transacciones. No hay índices adicionales aparte del de `suggestions`, ni restricción de sorteo único, ni foreign key hacia un catálogo de juegos.

## Configuración y logs

Variables: `PORT`, `HOST`, `DATABASE_URL`, `NODE_ENV`, `LOG_LEVEL`, `CORS_ORIGIN`. En desarrollo Pino usa salida legible; en otros entornos emite JSON. No hay autenticación, autorización, rate limiting, métricas ni OpenAPI.

## Reglas para cambios

- Valida input desconocido en service/schema antes de repository.
- Usa `sendSuccess`, `sendCreated` o `sendPaged`.
- Propaga errores asíncronos a `next`.
- Mantén reglas por juego en `GameConfig`.
- Cambios de esquema parten de `src/db/schema.ts` y generan una migración.
- Todo cambio de contrato exige revisar `apps/web/src/types`, `lib/api`, hooks, páginas y query invalidation.

Consulta [deuda técnica](technical-debt.md) antes de extender PATCH, fechas, comparación o consultas agregadas.
