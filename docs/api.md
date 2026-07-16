# API

> **Propósito:** documentar módulos, endpoints, contratos, errores y persistencia.
> **Cuándo leer:** antes de modificar `apps/api` o integrar un consumidor.
> **Alcance:** workspace `@lotero/api` y contrato HTTP `/api`.
> **Responsable:** mantenimiento API y datos.
> **Última revisión:** 2026-07-16.
> **Rutas relacionadas:** [`../apps/api/src`](../apps/api/src), [`frontend.md`](frontend.md), [`business-rules.md`](business-rules.md).

## Composición

`server.ts` crea la aplicación y escucha. `app.ts` configura CORS, JSON, `pino-http`, health, routers, 404 y error handler. Sorteos y apuestas separan controller, service y repository; los módulos analíticos reutilizan los repositorios.

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
| `POST /api/comparison` | `game,numbers,source,dateFrom?,dateTo?,minMatches?,extras?` | Ranking; comparador y dashboard | 400, 404 |
| `GET /api/statistics` | `game,dateFrom?,dateTo?` | Estadísticas | 400, 404 |
| `GET /api/numbers/:number` | Entero; `game?` | Detalle de número | 400, 404 |
| `GET /api/dashboard` | — | Resumen agregado | 500 |

Las rutas responsables están en `src/modules/*/*.routes.ts`; controllers adaptan HTTP, services validan/orquestan y repositories acceden a datos.

## Persistencia

| Tabla | Contenido |
|---|---|
| `draws` | Juego, fecha, números, extras y timestamps |
| `bets` | Juego, etiqueta y timestamps |
| `bet_lines` | Líneas asociadas con números y extras |

Los UUID se generan con `crypto.randomUUID`. Las creaciones/actualizaciones multilínea usan transacciones. No hay índices adicionales, restricción de sorteo único ni foreign key hacia un catálogo de juegos.

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
