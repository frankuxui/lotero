# @lotero/web

Frontend de Lotero: registro de apuestas y sorteos, comparador, estadísticas y buscador de números, consumiendo `@lotero/api`.

## Stack

React 19, TypeScript estricto, Vite, React Router, Tailwind CSS v4, TanStack Query, React Hook Form + Zod, Zustand (solo preferencias locales), Lucide React, Motion. Primitivas de UI (`src/components/ui`) construidas a mano sobre Radix UI siguiendo las convenciones de shadcn/ui (sin usar su CLI).

## Arquitectura

```
src/
  app/            providers (TanStack Query), router, layouts (AppShell, sidebar, bottom nav)
  components/
    shared/       PageHeader, FilterBar, Pagination, ConfirmDialog, selector numérico, etc.
    ui/           primitivas estilo shadcn/ui (Button, Input, Dialog, Sheet, Table…)
  features/       una carpeta por dominio (bets, draws, comparison, statistics, numbers, dashboard, history, settings),
                  cada una con components/hooks/pages/schemas propios
  lib/
    api/          cliente HTTP centralizado + un *.api.ts por recurso (nunca fetch directo en componentes)
    query/        QueryClient y factory de query keys
    validation/   reglas de Zod derivadas dinámicamente de GameConfig (GET /api/games), nunca hardcodeadas
    formatters/   formato de números (2 dígitos) y fechas
  store/          Zustand: preferencias (settings) y toasts — nunca datos remotos ya cubiertos por TanStack Query
  types/          tipos que reflejan el contrato de la API
```

## Primeros pasos

```bash
cp .env.example .env      # VITE_API_URL apuntando a la API (por defecto http://localhost:4000/api)
npm install                # desde la raíz del monorepo
npm run dev -w apps/web    # requiere apps/api corriendo en paralelo (o `npm run dev` desde la raíz)
```

## Scripts

- `npm run dev` — servidor de desarrollo (Vite)
- `npm run build` — `tsc -b && vite build`
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc -b` sin emitir

## Notas de integración con la API

- Los juegos y sus reglas (cantidad de números, rango, extras como complementario/reintegro/joker) se obtienen siempre de `GET /api/games`; el frontend no hardcodea reglas por juego.
- Comparador, estadísticas, buscador de números y dashboard consumen endpoints de la API añadidos en su "fase 2" (ver `apps/api/README.md`), que no existían al comenzar el frontend.
- Los listados de sorteos y apuestas usan paginación real (`meta.total`) y filtros por juego y rango de fechas soportados por la API.
