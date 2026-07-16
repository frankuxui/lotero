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

No existe Dockerfile, adaptador serverless, infraestructura, workflow de release ni destino de despliegue definido. El build genera `apps/web/dist` y `apps/api/dist`; `npm start -w apps/api` ejecuta la API compilada. No documentes un procedimiento de producción hasta elegir hosting, almacenamiento persistente, TLS, secretos, backups y política de acceso.

## Diagnóstico

- Web sin datos: verifica `VITE_API_URL`, health y CORS.
- API no arranca: revisa puerto ocupado, URL de DB y permisos del directorio.
- Datos ausentes: ejecuta migración antes del seed y confirma la URL de DB efectiva.
- Error 400: consulta `error.details` para issues Zod.
- Caché desactualizada: revisa query key e invalidaciones de la mutation.
- Acceso móvil: usa IP LAN tanto en `VITE_API_URL` como en `CORS_ORIGIN`.
