# Resumen del proyecto

> **Propósito:** explicar qué hace Lotero y cómo se organiza.
> **Cuándo leer:** en el onboarding y antes de tareas que atraviesen varios workspaces.
> **Alcance:** producto, estructura y herramientas principales.
> **Responsable:** mantenimiento del repositorio.
> **Última revisión:** 2026-07-16.
> **Rutas relacionadas:** [`../package.json`](../package.json), [`../apps/web`](../apps/web), [`../apps/api`](../apps/api).

## Producto

Lotero permite registrar sorteos oficiales y apuestas multilínea de Bonoloto y La Primitiva. Con esos datos ofrece comparación de combinaciones, estadísticas, búsqueda por número, historial unificado y un dashboard.

Es una aplicación sin cuentas de usuario. La configuración visual se guarda en el navegador y los datos de dominio se persisten en SQLite/libSQL mediante la API.

## Estructura

```text
apps/web   SPA React y cliente de la API
apps/api   API Express, reglas de dominio y persistencia
docs       fuente de verdad documental
```

No existen actualmente `packages/` compartidos. Los tipos del contrato se mantienen por separado en API y web.

## Stack

| Área | Tecnologías |
|---|---|
| Workspace | npm workspaces, package-lock v3 |
| Web | React 19, TypeScript, Vite, React Router 7, Tailwind CSS 4 |
| Estado/datos | TanStack Query 5, Zustand 5 |
| Formularios | React Hook Form, Zod |
| UI | Radix Dialog/Label/Tabs, Lucide, Motion, primitivas propias |
| API | Node.js, Express 5, Zod, Pino |
| Datos | Drizzle ORM, `@libsql/client`, SQLite/libSQL |

## Funcionalidades

- Dashboard agregado.
- Catálogo de juegos y reglas dinámicas.
- CRUD de sorteos y apuestas.
- Comparador contra sorteos o líneas apostadas.
- Estadísticas de frecuencia, retraso y distribución.
- Buscador de apariciones por número.
- Historial combinado y preferencias locales.

Consulta [frontend](frontend.md), [API](api.md) y [reglas de negocio](business-rules.md) para el detalle.

## Comandos esenciales

Ejecuta desde la raíz:

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run docs:check
npm run db:migrate
npm run db:seed
```

No hay comando de tests en el estado actual. No añadas uno a CI hasta que exista una suite real.
