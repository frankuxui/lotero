# Frontend

> **Propósito:** documentar rutas, estado, acceso a datos, formularios y UI.
> **Cuándo leer:** antes de modificar `apps/web` o un consumidor de la API.
> **Alcance:** workspace `@lotero/web`.
> **Responsable:** mantenimiento frontend.
> **Última revisión:** 2026-07-17.
> **Rutas relacionadas:** [`../apps/web/src`](../apps/web/src), [`api.md`](api.md), [`business-rules.md`](business-rules.md).

## Composición y rutas

`main.tsx` monta `App`; `AppProviders` instala tema y TanStack Query; `BrowserRouter` entrega las rutas lazy-loaded dentro de `AppShell`.

| Ruta | Página | Función |
|---|---|---|
| `/` | `DashboardPage` | Resumen agregado |
| `/bets` | `BetsListPage` | Lista, filtros, duplicación y borrado |
| `/bets/new` | `BetFormPage` | Nueva apuesta |
| `/bets/:id` | `BetDetailPage` | Detalle de apuesta; muestra por cada número cuántas veces se ha jugado (reutiliza `GET /api/numbers/:number`) |
| `/bets/:id/edit` | `BetFormPage` | Edición |
| `/draws` | `DrawsListPage` | Lista, filtros, borrado y buscador global (número suelto o combinación completa concatenada, p.ej. "253343") en la tabla de escritorio |
| `/draws/new` | `DrawFormPage` | Nuevo sorteo |
| `/draws/:id` | `DrawDetailPage` | Detalle de sorteo |
| `/draws/:id/edit` | `DrawFormPage` | Edición |
| `/history` | `HistoryPage` | Historial combinado |
| `/compare` | `ComparePage` | Comparador |
| `/statistics` | `StatisticsPage` | Métricas por juego y fecha; incluye combinaciones jugadas más cercanas a su sorteo (`closestBetMatches`) |
| `/suggestions` | `SuggestionsHistoryPage` | Histórico de sugerencias con filtros y acierto/desacierto |
| `/numbers` | `NumbersPage` | Selector de número |
| `/numbers/:number` | `NumberDetailPage` | Apariciones y estadísticas |
| `/settings` | `SettingsPage` | Preferencias locales |
| `*` | `NotFoundPage` | 404 de la SPA |

## Acceso y caché de datos

- Todo HTTP se implementa en `src/lib/api/client.ts` y un archivo `*.api.ts` por recurso.
- Los hooks de `features/*/hooks` construyen queries y mutations.
- Las keys se centralizan en `src/lib/query/keys.ts`.
- Configuración global: `staleTime` 30 s, un retry, sin refetch al enfocar y sin retry de mutations.
- Juegos tienen `staleTime: Infinity`.
- Mutaciones de sorteos invalidan draws, dashboard, statistics, numbers y suggestions (la creación/edición de un sorteo dispara regeneración de sugerencias en la API).
- Mutaciones de apuestas invalidan bets, dashboard y numbers.
- `useTodaySuggestions` (`staleTime` 5 min) alimenta la sección "Sugerencia del día" del dashboard; `useSuggestionsList` alimenta `/suggestions` con `placeholderData` para paginación sin parpadeo.

No hagas `fetch` en componentes ni guardes respuestas remotas en Zustand.

## Estado

- Estado remoto: TanStack Query.
- Estado de URL: `useSearchParams` para filtros y paginación compartibles.
- Estado de formulario: React Hook Form.
- Estado local efímero: `useState`.
- Estado persistido: `settingsStore`, clave `lotero-settings` en `localStorage`.
- Notificaciones: helper `toast()` en `@/store/toastStore` (delgado, sin estado propio) sobre `sonner`; el `Toaster` en `components/shared/Toaster.tsx` sigue el tema activo vía `next-themes` y se monta una vez en `AppShell`.

## Formularios y validación

Los formularios construyen schemas Zod desde el `GameConfig` obtenido por `GET /api/games`. La API sigue siendo la autoridad final. `NumberCombinationField`, `NumberGrid`, `NumberSlotsInput` y `ExtraFieldControl` forman el selector reutilizable.

Al cambiar de juego se remonta el formulario mediante `key={config.id}`. En edición se envía el registro completo, aunque el endpoint acepte PATCH parcial.

## Componentes y diseño

- `components/ui`: Button, Input, Select, Dialog, Sheet, Table, Tabs, etc.; primitivas estilo shadcn construidas sobre Radix cuando aplica.
- `components/shared`: cabeceras, estados, filtros, paginación, badges, tablas y selector numérico.
- Tailwind CSS 4 y tokens CSS en `App.css`.
- Tema claro/oscuro gestionado íntegramente por `next-themes` (`useTheme`), única fuente de verdad para `ThemeToggle`, el selector "Tema" de `SettingsPage` y `Toaster`.
- Navegación responsive: sidebar de escritorio, top bar y bottom navigation móviles.

Mantén las variantes visuales en primitivas o componentes compartidos. Los componentes de dominio deben vivir en el feature que posee el concepto.

## Estados y accesibilidad

Las vistas deben cubrir pending/loading, error con reintento cuando sea viable, vacío y éxito. Los formularios deben mostrar errores de campo y error general del servidor.

Existen `role=status`, `role=alert`, `aria-live`, labels, navegación etiquetada y soporte `motion-reduce`. Conserva navegación por teclado en el selector numérico y no dependas solo del color para comunicar estado.

## Limitaciones conocidas

- `DrawsListPage` solo solicita los primeros 200 sorteos y pagina ese lote en cliente.
- El filtro numérico del historial solo examina registros cargados.
- `DrawsTable` genera una advertencia de compatibilidad con React Compiler.
- Los contratos TypeScript se duplican con la API; verifica ambos lados en cada cambio.
