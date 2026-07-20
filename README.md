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

Para ejecutar API y frontend con Docker Compose:

```bash
# Build de imágenes (sin arrancar contenedores)
docker compose build api
docker compose build web

# Levantar o actualizar API + web (recomendado tras cambios de código)
docker compose up -d --build --force-recreate api web

# Levantar ambos servicios sin rebuild (usa imágenes ya construidas)
docker compose up -d api web

# Levantar solo la API
docker compose up -d --build --force-recreate api

# Levantar solo el frontend
docker compose up -d --build --force-recreate web

# Parar servicios (mantiene contenedores y red para reanudar rápido)
docker compose stop api web

# Reanudar servicios parados con stop
docker compose start api web

# Detener y eliminar contenedor/red del compose
docker compose down

# Ver estado de los servicios
docker compose ps

# Ver logs en tiempo real (Ctrl+C no detiene los contenedores)
docker compose logs -f api web
```

`VITE_API_URL` se usa en build del frontend Docker y por defecto apunta a `http://localhost:4031/api`.
Si quieres acceso desde móvil/otros equipos, expórtala con tu IP LAN antes de levantar/rebuild:

```bash
export VITE_API_URL=http://<TU_IP_LAN>:4031/api
docker compose up -d --build --force-recreate web
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
