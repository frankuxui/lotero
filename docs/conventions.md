# Convenciones

> **Propósito:** fijar reglas transversales para cambios coherentes y acotados.
> **Cuándo leer:** antes de modificar código, configuración o documentación.
> **Alcance:** todo el repositorio.
> **Responsable:** mantenimiento del repositorio.
> **Última revisión:** 2026-07-17.
> **Rutas relacionadas:** [`../apps/web`](../apps/web), [`../apps/api`](../apps/api), [`ai/task-protocol.md`](ai/task-protocol.md).

## Cambios

- Resuelve la tarea con el cambio mínimo coherente con la arquitectura.
- No reescribas módulos completos ni hagas refactors laterales.
- No dupliques lógica existente ni añadas dependencias sin justificar su necesidad.
- No inventes requisitos ni compatibilidad heredada.
- No edites código generado.
- No ocultes errores de herramientas mediante ignores o casts sin una razón documentada.

## TypeScript y nombres

- TypeScript estricto; no uses `any` salvo integración inevitable y explicada.
- Componentes y clases: PascalCase. Hooks: `useX`. Funciones/variables: camelCase.
- Páginas: `*Page.tsx`; hooks de datos: `use*.ts`; clientes: `*.api.ts`; schemas de feature: `*.schema.ts`.
- API por módulo: `*.routes.ts`, `*.controller.ts`, `*.service.ts`, `*.repository.ts`, `*.schemas.ts`, `*.types.ts` cuando cada capa sea necesaria.
- Web usa alias `@/`; API usa imports ESM relativos con extensión `.js` en source TypeScript.

## Frontend

- Páginas orquestan; componentes compartidos presentan/reutilizan; hooks gestionan acceso remoto.
- Nunca hagas HTTP fuera de `src/lib/api`.
- Datos remotos en TanStack Query; preferencias en Zustand; toasts vía `sonner` (`@/store/toastStore`).
- Mantén filtros compartibles en URL cuando ya se siga ese patrón.
- Cubre loading, error, vacío y éxito; conserva labels, roles, foco y navegación por teclado.
- Reutiliza tokens de `App.css` y primitivas de `components/ui`.

## API

- Valida en schema/service, aplica negocio en service y persiste en repository.
- Usa las utilidades de respuesta y `HttpError`; no expongas detalles internos en 500.
- Deriva reglas de juego de `GameConfig`.
- Usa transacciones cuando una operación modifica varias tablas.
- Cambios de schema se generan mediante Drizzle y requieren revisar migración y operaciones.

## Contratos

Antes de cambiar request, response, código HTTP o semántica revisa API, tipos web, cliente, hooks, páginas, query invalidation, reglas y documentación. Trata los contratos duplicados como una zona de riesgo hasta que exista una fuente compartida.

## Formato

ESLint y TypeScript son obligatorios. Prettier está configurado por workspace con anchos distintos; respeta la configuración del área y no reformatees archivos ajenos.

## Documentación

Actualiza documentos cuando cambien arquitectura, endpoints, reglas, comandos, variables, esquema o despliegue. Distingue siempre comportamiento actual, limitación conocida y recomendación.
