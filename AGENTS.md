# Lotero: instrucciones para agentes

Lotero es un monorepo npm con una SPA React en `apps/web` y una API Express/SQLite en `apps/api`.

## Contexto obligatorio

1. Lee `README.md` y `docs/ai/context-map.md`.
2. Lee solo los documentos del área afectada.
3. Sigue `docs/ai/task-protocol.md` y `docs/conventions.md`.
4. Si cambias contratos o reglas, revisa ambos lados: API y frontend.

## Reglas críticas

- Aplica cambios mínimos; no mezcles refactors ajenos a la tarea.
- `apps/api/src/config/game-config.ts` es la fuente de reglas de juegos.
- No uses `fetch` directamente en componentes; usa `apps/web/src/lib/api/`.
- TanStack Query gestiona datos remotos; Zustand queda para preferencias locales; los toasts usan `sonner` (`@/store/toastStore`).
- No edites `package-lock.json`, `dist/` ni migraciones Drizzle generadas a mano.
- No cambies un contrato API sin revisar tipos, consumidores, caché y documentación.
- No ocultes errores de lint, TypeScript, build o tests.

## Validación

Desde la raíz ejecuta, según el alcance:

```bash
npm run docs:check
npm run lint
npm run typecheck
npm run build
```

No hay suite automatizada de tests en el estado actual; no afirmes que se ejecutaron tests si no existe un comando real.

## Imported Claude Cowork project instructions
