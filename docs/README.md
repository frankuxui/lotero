# Documentación de Lotero

> **Propósito:** indexar la fuente de verdad técnica del proyecto.
> **Cuándo leer:** al incorporarse al proyecto o antes de elegir contexto para una tarea.
> **Alcance:** todo el monorepo.
> **Responsable:** mantenimiento del repositorio.
> **Última revisión:** 2026-07-16.
> **Rutas relacionadas:** [`../README.md`](../README.md), [`../apps`](../apps).

## Niveles de contexto

### Nivel 1: obligatorio

- [Resumen del proyecto](project-overview.md): propósito, estructura y comandos.
- [Mapa de contexto para agentes](ai/context-map.md): decide qué leer.
- [Protocolo de tareas](ai/task-protocol.md): preparación, cambios y entrega.
- [Convenciones](conventions.md): reglas transversales.

### Nivel 2: por área

| Si la tarea afecta a… | Lee |
|---|---|
| Frontend, rutas, UI, estado o caché | [Frontend](frontend.md) |
| API, endpoints, errores o persistencia | [API](api.md) |
| Algoritmos, juegos o validaciones | [Reglas de negocio](business-rules.md) |
| Tests o verificación | [Testing](testing.md) |
| Entorno, DB, migraciones o despliegue | [Operaciones](operations.md) |

### Nivel 3: bajo demanda

- [Arquitectura](architecture.md): flujos, dependencias y puntos de alto impacto.
- [Deuda técnica](technical-debt.md): defectos y riesgos conocidos.
- [ADR](adr/README.md): decisiones arquitectónicas futuras.

## Política de mantenimiento

- Actualiza la documentación en el mismo cambio que modifica arquitectura, contratos, reglas, comandos o entorno.
- Cada documento tiene un responsable conceptual, no necesariamente una persona concreta.
- Revisa la documentación trimestralmente y al tocar cualquiera de sus rutas relacionadas.
- Ejecuta `npm run docs:check` antes de entregar cambios documentales.
- No copies secretos, contenido de `.env` real ni configuración personal a estos documentos.
