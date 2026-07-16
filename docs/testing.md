# Testing y verificación

> **Propósito:** registrar el estado de calidad y la estrategia de pruebas necesaria.
> **Cuándo leer:** al implementar, corregir, revisar o configurar CI.
> **Alcance:** verificaciones de API, web y documentación.
> **Responsable:** mantenimiento de calidad.
> **Última revisión:** 2026-07-16.
> **Rutas relacionadas:** [`../package.json`](../package.json), [`../apps/web/package.json`](../apps/web/package.json), [`../apps/api/package.json`](../apps/api/package.json).

## Estado actual

No existen archivos de test, framework de tests, script `test` ni cobertura. Las verificaciones disponibles son:

```bash
npm run docs:check
npm run lint
npm run typecheck
npm run build
```

`lint` presenta una advertencia conocida de React Compiler en `DrawsTable`; no es un error bloqueante actual.

## Matriz mínima futura

| Área | Casos prioritarios |
|---|---|
| GameConfig/schemas | longitud, rango, duplicados, orden, extras requeridos/opcionales y claves desconocidas |
| Draws | CRUD, filtros inclusivos, paginación, cambio de juego y 404 |
| Bets | transacción multilínea, cascada, filtros por día y duplicación |
| Comparison | score, desempate, fuentes, `minMatches`, fechas inclusivas y definición de extras |
| Statistics | dataset vacío, frecuencias, retrasos, paridad, décadas, pares/tríos y consecutivos |
| Numbers | resolución de juego, fuera de rango, ranking, distribución y límites |
| Dashboard | agregados vacíos, top N y coincidencias por línea |
| API HTTP | envelopes, status 201/204/400/404/500 y detalles Zod |
| Frontend | estados loading/error/vacío/éxito, formularios, invalidación y navegación |
| Accesibilidad | labels, foco de diálogos, teclado del selector, aria-live y contraste |

## Criterio por tipo de cambio

- Documentación: `docs:check` y revisión de enlaces/renderizado.
- Frontend: lint, typecheck y build web; prueba manual de ruta y estados afectados.
- API: lint, typecheck y build API; comprobar contrato y persistencia afectada sin usar datos reales.
- Reglas: casos unitarios para límites y regresiones antes de declarar resuelto un hallazgo.
- Schema: generar migración, probarla sobre una copia y documentar rollback o irreversibilidad.

No afirmes que se ejecutaron tests si solo se ejecutaron lint, typecheck o build. La incorporación de un framework de tests es una tarea posterior y debe decidir runner, estrategia de DB y cobertura antes de cambiar CI.
