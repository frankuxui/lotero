# Operaciones y entorno

> **Propósito:** documentar variables, arranque, base de datos, migraciones y diagnóstico.
> **Cuándo leer:** al configurar el proyecto, cambiar DB/entorno o investigar fallos operativos.
> **Alcance:** desarrollo local y estado actual de despliegue.
> **Responsable:** mantenimiento de operaciones.
> **Última revisión:** 2026-07-16.
> **Rutas relacionadas:** [`../apps/api/.env.example`](../apps/api/.env.example), [`../apps/web/.env.example`](../apps/web/.env.example), [`../apps/api/src/db`](../apps/api/src/db).

## Requisitos y arranque

El proyecto usa Node.js/npm y un lockfile v3. Instala desde la raíz con `npm install` o `npm ci` en CI. Copia los `.env.example` de cada workspace y revisa hosts/puertos antes de iniciar.

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

El seed no es idempotente: cada ejecución añade nuevos registros.

## Variables API

| Variable | Función | Default del código |
|---|---|---|
| `PORT` | Puerto HTTP | `4000` |
| `HOST` | Interfaz de escucha | `0.0.0.0` |
| `DATABASE_URL` | URL libSQL/SQLite | `file:./data/lotero.db` |
| `NODE_ENV` | development/production/test | `development` |
| `LOG_LEVEL` | Nivel Pino | `info` |
| `CORS_ORIGIN` | Orígenes separados por coma | `http://localhost:5173` |

El ejemplo y `.claude/launch.json` usan puerto 4031. Configura `.env`; no dependas del default 4000 hasta que se unifique en una tarea específica.

## Variable web

`VITE_API_URL` debe incluir el prefijo `/api`, por ejemplo `http://localhost:4031/api` o una IP LAN. El cliente no define fallback: si falta, construirá URLs inválidas.

## Base de datos

Para URLs `file:`, el cliente crea el directorio padre si no existe. El archivo local vive normalmente en `apps/api/data/` al ejecutar el workspace y está ignorado por Git.

```bash
npm run db:generate -w apps/api  # solo tras cambiar schema.ts
npm run db:migrate
npm run db:seed
```

No edites manualmente archivos de `migrations/meta` ni una migración ya aplicada. Antes de cambios destructivos, trabaja sobre una copia y define recuperación.

## Seguridad operativa

- Nunca guardes tokens en `.vscode/settings.json`, documentos o `.env.example`.
- Los `.env` reales y la DB local están ignorados.
- La API no tiene autenticación y escucha en todas las interfaces; limita red/orígenes en entornos no confiables.
- CORS no sustituye autenticación ni control de red.

## Despliegue

La API se ejecuta en Docker para permanecer visible en la red local (móvil, portátiles); el frontend sigue en modo desarrollo (`npm run dev:web`) y no se dockeriza.

```bash
docker compose up -d --build api
docker compose logs -f api
docker compose down
```

`apps/api/Dockerfile` compila el workspace `@lotero/api` en dos etapas y ejecuta `docker-compose.yml` (raíz) con contexto en la raíz del monorepo. El contenedor requiere `apps/api/.env` (mismo archivo que usas en desarrollo); `docker-compose.yml` fija `HOST`, `PORT`, `NODE_ENV` y `DATABASE_URL`, y toma el resto (`CORS_ORIGIN`, `LOG_LEVEL`) de ese `.env`.

**Una sola base de datos:** el volumen `./apps/api/data:/app/apps/api/data` monta el mismo directorio que usa el proceso en desarrollo, así que Docker lee y escribe el mismo archivo `lotero.db`; no se crea una base separada y no se pierden los datos existentes. El contenedor aplica migraciones en cada arranque (`node dist/db/migrate.js`, idempotente) pero nunca ejecuta el seed.

No corras `npm run dev:api` y el contenedor al mismo tiempo: ambos abrirían el mismo archivo SQLite como escritores concurrentes. Elige uno u otro.

Para que el acceso LAN (móvil, portátiles) funcione de forma consistente:

- **Firewall de Windows:** si otro dispositivo no conecta a `http://<IP-LAN>:4031`, confirma que el Firewall permite conexiones entrantes al puerto 4031 (Docker Desktop suele pedir el permiso la primera vez).
- **Arranque tras reiniciar el equipo:** `restart: unless-stopped` reinicia el contenedor si Docker Desktop se reinicia o crashea, pero no si apagas el PC. Para que la API vuelva a estar disponible sin intervención manual, configura Docker Desktop para iniciar con Windows.

No existe adaptador serverless, infraestructura remota, workflow de release ni destino fuera de la red local. No documentes un procedimiento de producción remota hasta elegir hosting externo, TLS, secretos, backups y política de acceso.

## Diagnóstico

- Web sin datos: verifica `VITE_API_URL`, health y CORS.
- API no arranca: revisa puerto ocupado, URL de DB y permisos del directorio.
- Datos ausentes: ejecuta migración antes del seed y confirma la URL de DB efectiva.
- Error 400: consulta `error.details` para issues Zod.
- Caché desactualizada: revisa query key e invalidaciones de la mutation.
- Acceso móvil: usa IP LAN tanto en `VITE_API_URL` como en `CORS_ORIGIN`.
