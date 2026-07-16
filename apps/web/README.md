# @lotero/web

SPA de Lotero para registrar apuestas y sorteos, comparar combinaciones, consultar estadísticas y buscar apariciones de números.

## Inicio

Desde la raíz del monorepo:

```bash
copy apps\web\.env.example apps\web\.env
npm install
npm run dev:web
```

`VITE_API_URL` es obligatorio y debe apuntar al prefijo `/api` de una API en ejecución.

## Comandos

```bash
npm run dev -w apps/web
npm run lint -w apps/web
npm run typecheck -w apps/web
npm run build -w apps/web
```

## Documentación

- [Arquitectura del frontend](../../docs/frontend.md)
- [Contrato API](../../docs/api.md)
- [Reglas de negocio compartidas](../../docs/business-rules.md)
- [Convenciones](../../docs/conventions.md)
- [Testing](../../docs/testing.md)

La documentación central es la fuente de verdad. Este README solo conserva el onboarding del workspace.
