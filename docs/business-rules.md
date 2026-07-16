# Reglas de negocio

> **Propósito:** registrar reglas, fórmulas, entradas, salidas y sincronizaciones críticas.
> **Cuándo leer:** al cambiar juegos, validaciones, comparación, estadísticas o buscador.
> **Alcance:** comportamiento de dominio vigente y limitaciones conocidas.
> **Responsable:** mantenimiento de dominio.
> **Última revisión:** 2026-07-16.
> **Rutas relacionadas:** [`../apps/api/src/config/game-config.ts`](../apps/api/src/config/game-config.ts), [`../apps/api/src/modules`](../apps/api/src/modules), [`../apps/web/src/lib/validation/game-rules.ts`](../apps/web/src/lib/validation/game-rules.ts).

## GameConfig

`apps/api/src/config/game-config.ts` es la autoridad sobre juegos registrados. Define identificador, etiqueta, cantidad/rango/unicidad/orden de números y extras.

| Juego | Números | Extras |
|---|---|---|
| Bonoloto | 6 únicos, 1–49, orden automático | Complementario 1–49 y reintegro 0–9, obligatorios |
| La Primitiva | 6 únicos, 1–49, orden automático | Complementario 1–49, reintegro 0–9; Joker opcional de 7 dígitos |

Euromillones, EuroDreams y El Gordo aparecen como identificadores/preparación, pero no están registrados. Añadir un juego exige revisar API, formularios, selectores, visualización de extras, algoritmos, datos existentes y documentación; no debe tratarse como un cambio aislado de configuración.

## Validación

- La API acepta arrays numéricos, comprueba enteros, rango, longitud y unicidad, y ordena cuando corresponde.
- Extras se construyen dinámicamente y el objeto es estricto: claves desconocidas fallan.
- El frontend replica las reglas desde `GET /api/games`, pero además exige entrada ascendente.
- El frontend trata string opcional vacío como ausencia; la API recibe el valor ya normalizado.
- La API es la autoridad final frente a cualquier cliente.

Limitaciones actuales: fechas no se validan como ISO ni por orden; complementario no se contrasta con principales; PATCH puede cambiar `game` sin revalidar campos omitidos.

## Comparación

Entrada: juego, combinación, fuente `draws|bets`, filtros de fecha y mínimo de aciertos. Para apuestas cada línea es un candidato independiente.

```text
matches       = candidato ∩ entrada
nonMatches    = entrada - matches
totalMatches  = cantidad(matches)
percentage    = redondear(totalMatches / cantidad(entrada) * 100, 1 decimal)
sumDifference = suma(entrada) - suma(candidato)
```

Los resultados se filtran por `totalMatches >= minMatches`, se ordenan por total y porcentaje descendentes y reciben ranking desde 1. Los extras se aceptan/validan pero actualmente no participan en el score. El filtro `dateTo` de candidatos de apuestas tiene un defecto conocido al comparar timestamp con fecha simple.

## Estadísticas

El repositorio entrega sorteos por fecha descendente; `computeStatistics` depende de este orden.

- Frecuencia: apariciones del número divididas por total de sorteos, en porcentaje.
- Calientes: diez mayores frecuencias; fríos: diez menores. Empates por número ascendente.
- Retraso: índice del sorteo reciente más próximo; si nunca aparece, total de sorteos.
- Paridad: cantidad total de números pares e impares, no cantidad de sorteos.
- Décadas: recuento por intervalos 01–10, 11–20, etc.
- Suma media: promedio de la suma de combinaciones, dos decimales.
- Pares y tríos: diez combinaciones de tamaño 2/3 más frecuentes.
- Consecutivos: un sorteo cuenta una vez si contiene al menos un par `n, n+1`.
- Extras: para cada campo de `config.extras` (complementario, reintegro, joker, según el juego) se calculan los diez valores con más apariciones (`extraFrequencies`). Los valores `number` se agregan por igualdad exacta; los `string` (joker) no tienen rango fijo, así que solo se listan los valores observados, sin completar el resto del dominio.

Con cero sorteos se devuelven frecuencias/retrasos para todo el rango, porcentajes y promedio en cero, y fechas nulas. `extraFrequencies` devuelve un `top` vacío por extra.

## Buscador de números

Sin juego explícito se elige el primer juego registrado cuyo rango contiene el número. Apariciones totales suman sorteos y líneas de apuesta de todos los juegos compatibles. Frecuencia, retraso, ranking y última aparición se calculan para el juego resuelto. Se devuelven como máximo diez sorteos y diez líneas relacionadas.

## Dashboard

Muestra cinco sorteos y apuestas recientes, conteos por juego, cinco calientes/fríos por juego y cinco mejores coincidencias. Para cada línea reciente busca su mejor sorteo y descarta resultados con cero aciertos.

## Sincronización obligatoria

Al cambiar una regla o contrato revisa:

1. `GameConfig` y schemas API.
2. Validación y valores iniciales del frontend.
3. Tipos API y copias en `apps/web/src/types`.
4. Algoritmos de comparison/statistics/numbers/dashboard.
5. Query keys e invalidaciones.
6. Este documento y las tablas de endpoints.
