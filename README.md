# Lotero

Aplicación para registrar apuestas y sorteos de lotería, comparar combinaciones y consultar estadísticas históricas.

## Monorepo

- `apps/web`: SPA React 19, Vite, React Router, TanStack Query, Zustand y Tailwind CSS 4.
- `apps/api`: API Express 5, Zod, Drizzle ORM y SQLite/libSQL.
- `docs`: fuente de verdad para arquitectura, contratos, reglas y operación.

## Puesta en marcha

```bash
npm install
copy apps\api\.env.example apps\api\.env
copy apps\web\.env.example apps\web\.env
npm run db:migrate
npm run db:seed
npm run dev
```

Revisa las URLs de los dos `.env`: los ejemplos usan el puerto `4031` y contemplan acceso desde la red local.

Para dejar la API siempre visible en la red local (móvil, otros equipos) mientras el frontend sigue en modo desarrollo:

```bash
docker compose up -d --build api
```

Reutiliza `apps/api/data/lotero.db` vía volumen; no crea una base separada. Detalle completo en [operaciones](docs/operations.md#despliegue).

## Comandos

| Comando | Propósito |
|---|---|
| `npm run dev` | Ejecuta API y web en paralelo |
| `npm run build` | Compila ambos workspaces |
| `npm run lint` | Ejecuta ESLint |
| `npm run typecheck` | Comprueba TypeScript |
| `npm run docs:check` | Valida documentos y enlaces internos |
| `npm run db:migrate` | Aplica migraciones Drizzle |
| `npm run db:seed` | Inserta datos de ejemplo |

Actualmente no existe una suite automatizada de tests ni un destino de despliegue definido.

## Documentación

Empieza por [el índice de documentación](docs/README.md). Los agentes deben seguir [el mapa de contexto](docs/ai/context-map.md) y [el protocolo de tareas](docs/ai/task-protocol.md).

Los detalles de cada workspace permanecen en [web](apps/web/README.md) y [API](apps/api/README.md).
