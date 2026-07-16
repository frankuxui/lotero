# Deuda técnica y riesgos

> **Propósito:** mantener un registro verificable de defectos, riesgos e inconsistencias.
> **Cuándo leer:** al planificar correcciones, tocar una zona afectada o revisar riesgos.
> **Alcance:** hallazgos confirmados el 2026-07-16; no son comportamiento deseado.
> **Responsable:** mantenimiento técnico.
> **Última revisión:** 2026-07-16.
> **Rutas relacionadas:** [`architecture.md`](architecture.md), [`testing.md`](testing.md), [`../apps`](../apps).

## Criterio

- **Error confirmado:** el código produce un resultado incorrecto o inseguro demostrable.
- **Riesgo potencial:** depende del modo de uso o despliegue.
- **Inconsistencia:** fuentes o comportamientos no coinciden.
- **Deuda:** falta una capacidad de ingeniería necesaria para mantener confianza.

## Registro

| ID | Severidad/tipo | Hallazgo y evidencia | Criterio de cierre | Estado |
|---|---|---|---|---|
| SEC-001 | Crítico/error | Token CMS en `.vscode/settings.json` local | Retirado del workspace y revocado en proveedor | Retirado localmente; revocación pendiente |
| API-001 | Alto/error | `comparison.service.ts` compara timestamp de apuesta con `dateTo` simple | Filtro inclusivo probado para todo el día final | Abierto |
| SEC-002 | Alto/riesgo | CRUD sin auth/rate limit y host `0.0.0.0` | Decisión de alcance y controles acordes al despliegue | Abierto |
| QA-001 | Alto/deuda | Sin tests, runner ni script `test` | Suite acordada cubre reglas y contratos críticos | Abierto |
| CON-001 | Alto/riesgo | Contratos API/web duplicados | Fuente compartida/generada o check de compatibilidad | Abierto |
| API-002 | Medio/inconsistencia | `extras` de comparison se valida pero no puntúa | Eliminar del request o definir/probar semántica | Abierto |
| API-003 | Medio/error potencial | PATCH permite cambiar juego sin revalidar campos existentes | Revalidación completa o prohibición del cambio parcial | Abierto |
| API-004 | Medio/deuda | Fechas no validadas como ISO ni por orden | Schema común y casos de rango | Abierto |
| WEB-001 | Medio/limitación | Sorteos de escritorio limitados a los primeros 200 | Paginación completa o límite explícito aceptado | Abierto |
| PERF-001 | Medio/deuda | N+1 de líneas y lecturas agregadas repetidas | Medición y consultas agregadas/batch | Abierto |
| ENV-001 | Medio/inconsistencia | Puertos 4000/4031 y ausencia de fallback web | Configuración y docs unificadas | Abierto |
| WEB-002 | Bajo/deuda | React Compiler omite `DrawsTable` | Decisión documentada o componente compatible | Abierto |
| DB-001 | Bajo/deuda | Sin índices ni unicidad de sorteos | Requisitos y migración respaldados por datos | Abierto |
| DOC-001 | Bajo/deuda | Contrato API manual, sin OpenAPI | Decidir si el coste de generación aporta valor | Abierto |

## Reglas de uso

No corrijas estos puntos incidentalmente en tareas no relacionadas. Cada corrección debe incluir tests proporcionales, actualizar el estado y revisar documentos afectados. Nuevos hallazgos necesitan evidencia, impacto y criterio de cierre.
