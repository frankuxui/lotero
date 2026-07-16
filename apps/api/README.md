# @lotero/api

API Express modular para persistencia y análisis de sorteos y apuestas de Lotero.

## Inicio

Desde la raíz del monorepo:

```bash
copy apps\api\.env.example apps\api\.env
npm install
npm run db:migrate
npm run db:seed
npm run dev:api
```

El seed añade datos cada vez que se ejecuta. No lo uses repetidamente sobre una base que quieras conservar limpia.

## Comandos

```bash
npm run dev -w apps/api
npm run lint -w apps/api
npm run typecheck -w apps/api
npm run build -w apps/api
npm run db:generate -w apps/api
```

Usa `db:generate` solo después de cambiar `src/db/schema.ts`; aplica la migración desde la raíz con `npm run db:migrate`.

## Documentación

- [Arquitectura de la API y endpoints](../../docs/api.md)
- [Reglas y algoritmos](../../docs/business-rules.md)
- [Base de datos y entorno](../../docs/operations.md)
- [Deuda conocida](../../docs/technical-debt.md)
- [Convenciones](../../docs/conventions.md)

La documentación central es la fuente de verdad. Este README solo conserva el onboarding del workspace.
