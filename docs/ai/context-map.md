# Mapa de contexto para agentes

> **Propósito:** minimizar contexto indicando exactamente qué documentos leer.
> **Cuándo leer:** al inicio de toda tarea realizada por un agente.
> **Alcance:** selección de contexto; no sustituye documentos de área.
> **Responsable:** mantenimiento del repositorio.
> **Última revisión:** 2026-07-17.
> **Rutas relacionadas:** [`../../AGENTS.md`](../../AGENTS.md), [`../README.md`](../README.md), [`task-protocol.md`](task-protocol.md).

## Nivel 1: siempre

1. `AGENTS.md` o el adaptador de tu herramienta.
2. `README.md`.
3. Este mapa.
4. [Protocolo de tareas](task-protocol.md).
5. [Convenciones](../conventions.md).

No cargues todos los documentos centrales por defecto.

## Nivel 2: según tarea

| Tipo de tarea | Contexto adicional obligatorio |
|---|---|
| Nueva vista, componente, ruta, hook o accesibilidad | [Frontend](../frontend.md) |
| Endpoint, middleware, error o repositorio | [API](../api.md) |
| Formulario conectado a API | [Frontend](../frontend.md), [API](../api.md), [reglas](../business-rules.md) |
| Juego, validación, comparación o estadística | [Reglas](../business-rules.md), [testing](../testing.md) |
| Sugerencia del día / histórico de sugerencias | [Reglas](../business-rules.md), [API](../api.md), [Frontend](../frontend.md) |
| Schema, migración, seed o variable | [API](../api.md), [operaciones](../operations.md) |
| Bug conocido o rendimiento | [Deuda](../technical-debt.md), documento del área |
| Review | Documento del área, [testing](../testing.md), [deuda](../technical-debt.md) |
| Cambio transversal | [Resumen](../project-overview.md), [arquitectura](../architecture.md) y todas las áreas afectadas |

## Nivel 3: bajo demanda

- [Arquitectura](../architecture.md) para dependencias, límites y puntos de impacto.
- [Operaciones](../operations.md) para diagnóstico, DB o despliegue.
- [ADR](../adr/README.md) para decisiones históricas/futuras.
- [Deuda](../technical-debt.md) si aparece un síntoma relacionado.

## Rutas de impacto rápido

- `game-config.ts`: reglas, API, formularios, algoritmos y datos.
- `db/schema.ts`: DB, repositories, migraciones y operaciones.
- `lib/api/client.ts`: todas las llamadas web.
- `lib/query/keys.ts`: caché e invalidaciones.
- Tipos en API/web: contrato duplicado.
- `suggestion.engine.ts`: pesos y señales del algoritmo; cambiarlo exige subir `ALGORITMO_VERSION`.

Si durante la tarea aparece un área no prevista, pausa la implementación, carga su documento y amplía el mapa de impacto antes de editarla.
