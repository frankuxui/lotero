# Protocolo de tareas para agentes

> **Propósito:** definir el proceso obligatorio antes, durante y después de un cambio.
> **Cuándo leer:** al inicio de toda tarea de implementación o revisión.
> **Alcance:** agentes y colaboradores que modifican el repositorio.
> **Responsable:** mantenimiento del repositorio.
> **Última revisión:** 2026-07-16.
> **Rutas relacionadas:** [`context-map.md`](context-map.md), [`../conventions.md`](../conventions.md), [`../testing.md`](../testing.md).

## Antes de cambiar

1. Lee las instrucciones globales, README y mapa de contexto.
2. Carga solo los documentos del área afectada.
3. Inspecciona la implementación real; la documentación puede quedar desactualizada.
4. Revisa `git status` y preserva cambios ajenos.
5. Identifica archivos directos, consumidores y contratos compartidos.
6. Para cambios amplios, de schema, contrato o arquitectura, presenta un plan antes de editar.

## Durante el cambio

- Haz el cambio mínimo necesario.
- Sigue las capas y patrones existentes.
- No dupliques lógica ni introduzcas dependencias innecesarias.
- No cambies contratos sin revisar frontend, API, query keys y documentación.
- No edites migraciones generadas, metadatos, lockfile o artefactos manualmente.
- No hagas refactors, compatibilidad heredada ni funcionalidades no solicitadas.
- Si una suposición cambia el alcance, detente y solicita la decisión.

## Verificación

Ejecuta lo proporcional al cambio:

```bash
npm run docs:check
npm run lint
npm run typecheck
npm run build
```

No existe suite de tests actualmente. Cuando se añada, ejecuta los tests enfocados y luego la suite relevante. Nunca ocultes un fallo ni lo describas como preexistente sin evidencia.

## Documentación que debe cambiar

| Cambio | Documentos |
|---|---|
| Endpoint o response | `api.md`, `frontend.md` si tiene consumidor |
| Regla/algoritmo | `business-rules.md`, `testing.md` |
| Ruta o estructura web | `frontend.md`, `architecture.md` si cambia límites |
| Schema/migración | `api.md`, `operations.md`; ADR si es una decisión mayor |
| Comando, variable o despliegue | README, `operations.md`, AGENTS si es contexto global |
| Deuda nueva/resuelta | `technical-debt.md` |

## Entrega

Informa:

1. Resultado y comportamiento final.
2. Archivos modificados.
3. Decisiones y supuestos.
4. Comandos ejecutados y resultado real.
5. Riesgos o trabajo pendiente.

No hagas commit, push, despliegue ni acciones externas salvo petición explícita.

## Checklist de pull request

- [ ] El cambio se limita a la tarea.
- [ ] Se revisaron contratos y consumidores.
- [ ] No se editó código generado.
- [ ] Se cubrieron estados y errores relevantes.
- [ ] Se ejecutaron verificaciones aplicables.
- [ ] Se actualizó documentación o se justificó por qué no.
- [ ] Se registró deuda nueva sin presentarla como comportamiento deseado.
- [ ] No se incluyeron secretos ni datos locales.
