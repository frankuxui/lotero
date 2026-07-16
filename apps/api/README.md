# @lotero/api

API modular para el motor de análisis estadístico de loterías. Fase 1: modelo de dominio, `GameConfig` extensible y CRUD de sorteos/apuestas.

## Stack

Node.js, Express 5, TypeScript estricto, Drizzle ORM sobre SQLite (vía `@libsql/client`, sin dependencias nativas que requieran compilación), Zod, Pino.

## Arquitectura

```
src/
  config/       env.ts, game-config.ts (GameConfig: única fuente de verdad por juego)
  db/           schema.ts, client.ts, migrate.ts, migrations/, seeds/
  modules/
    games/      controller · service · routes · schemas
    draws/      controller · service · repository · routes · schemas · types
    bets/       controller · service · repository · routes · schemas · types
  middleware/   error-handler.ts, not-found.ts
  utils/        http-error.ts, response.ts, logger.ts, id.ts
  app.ts        configuración de Express (sin listen)
  server.ts     arranque del servidor
```

Cada módulo separa controller (HTTP), service (reglas de negocio), repository (acceso a datos vía Drizzle) y schemas (validación Zod). Ningún módulo hardcodea reglas de juego: todo se deriva de `GameConfig` (`src/config/game-config.ts`), donde se registran los juegos soportados. Añadir un juego nuevo (Euromillones, EuroDreams, El Gordo...) consiste en registrar un `GameConfig` adicional, sin tocar controllers, services, repositories ni validaciones.

## Primeros pasos

```bash
cp .env.example .env
npm install            # desde la raíz del monorepo
npm run db:generate -w apps/api   # solo si cambias src/db/schema.ts
npm run db:migrate -w apps/api
npm run db:seed -w apps/api
npm run dev -w apps/api
```

## Endpoints (fase 1)

- `GET /api/health`
- `GET /api/games`, `GET /api/games/:id`
- CRUD `/api/draws`
- CRUD `/api/bets` (una apuesta contiene varias líneas)

`GET /api/draws` y `GET /api/bets` devuelven además `meta: { total, limit, offset }` junto a `data`, para soportar paginación real en el frontend (cambio aditivo, `data` conserva su forma original). Ambos listados aceptan también `dateFrom`/`dateTo` (además de `game`) para filtrar por rango de fechas — `drawDate` en sorteos, `createdAt` en apuestas —, requerido por los filtros de fecha del frontend (listados e Historial).

Respuestas consistentes: `{ success: true, data }` (o `{ success: true, data, meta }` en listados paginados) o `{ success: false, error: { message, details? } }`.

## Endpoints (fase 2 — análisis, añadidos para el frontend)

El frontend (`apps/web`) requería comparador, estadísticas, buscador de números y dashboard, que no existían en fase 1. Se añadieron siguiendo exactamente el mismo patrón modular (`controller · service · routes · schemas · types`), sin modificar ningún endpoint existente, y derivando siempre las reglas de cada juego de `GameConfig` (nunca hardcodeadas).

- `POST /api/comparison` — compara una combinación (`game`, `numbers`, `extras?`) contra el histórico de sorteos o apuestas (`source: "draws" | "bets"`, filtrable por `dateFrom`/`dateTo`/`minMatches`). Devuelve un ranking ya ordenado por aciertos (`matches`, `nonMatches`, `totalMatches`, `percentage`, `sumDifference`, `ranking`).
- `GET /api/statistics?game=&dateFrom=&dateTo=` — frecuencias, números calientes/fríos, retrasos, distribución par/impar y por decenas, suma media, pares/tríos más frecuentes y frecuencia de consecutivos. Se omite un cálculo genérico de "patrones" por no tener una definición precisa derivable de los datos disponibles; se cubre con las métricas concretas anteriores.
- `GET /api/numbers/:number?game=` — apariciones en sorteos y apuestas (total y por juego), frecuencia, última aparición, retraso, ranking y registros relacionados. Si no se indica `game`, se resuelve automáticamente al primer juego registrado cuyo rango incluya el número.
- `GET /api/dashboard` — resumen rápido (`quickStats`), últimos sorteos/apuestas, mejores coincidencias recientes entre apuestas y sorteos, y números calientes/fríos por juego. Reutiliza internamente los servicios de `statistics` y `comparison`.

## Pendiente

Nada bloqueante para el frontend actual. Ideas para siguientes fases: nuevos juegos (Euromillones, EuroDreams, El Gordo — ya soportado por el diseño de `GameConfig`, solo falta registrar sus reglas), autenticación/multiusuario, exportación de datos.
