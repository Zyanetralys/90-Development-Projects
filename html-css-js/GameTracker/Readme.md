# GameTracker

Backend en Spring Boot + frontend en React/Tauri para gestionar listas de juegos, ratings, clanes y búsqueda de compañeros para coop. Incluye matchmaking con Redis, invites con token y logs de auditoría.

Stack
- Backend: Java 17, Spring Boot 3.2, Security (JWT), JPA, Redis, WebSockets (STOMP), Flyway
- Frontend: React 18 + TS, Vite, Zustand, Tauri
- Infra: Docker Compose (Postgres 15, Redis 7, Nginx)

Requisitos
- Java 17+
- Node 18+ / npm 9+
- Docker y Docker Compose
- curl o Postman para validar endpoints

Configuración
1. Clona el repo y entra.
2. Copia .env.example a .env y rellena las variables:
   JWT_SECRET= (genera uno con openssl rand -hex 32)
   IGDB_CLIENT_ID=...
   IGDB_CLIENT_SECRET=...
3. Levanta servicios base:
   docker compose up -d --build
   Espera a que Postgres y Redis estén listos. El backend arranca automáticamente cuando detecta la DB.
4. Backend (opcional, para debug local):
   cd backend
   mvn spring-boot:run
5. Frontend:
   cd frontend
   npm i
   npm run dev        (modo web)
   npx tauri dev      (desktop nativo)

Endpoints principales
POST /api/v1/auth/login  -> sin auth. Devuelve { "token": "..." }
GET  /api/v1/games       -> auth requerida. Params: q, page, size. Devuelve PageResponse.
POST /api/v1/clans/{id}/invites -> auth requerida. Solo OWNER/OFFICER. Genera token 24h.
POST /api/v1/clans/invites/{token}/accept -> auth requerida. Une usuario al clan.
WS   /ws/match            -> auth requerida (Bearer en STOMP CONNECT). Destinos: /app/match.join, /app/match.leave

Notas importantes
- WebSockets: El interceptor valida el JWT en el CONNECT. Si falta o está mal, cierra la conexión. El cliente debe inyectar el header manualmente.
- IGDB: El cliente incluye fallback de cache. Sin credenciales válidas, la sync devuelve 401. Para pruebas locales, usa el mock o comenta la llamada real.
- Rate Limiting: Filtro a nivel servlet (150 req/min por IP). No usa Redis. Si pones un proxy como Cloudflare, desactívalo o sube el límite.
- Paginación: El store de Zustand resetea a página 0 si cambia la búsqueda. No usa librerías externas para el control.
- Flyway: ddl-auto está en validate. No dejes que Hibernate modifique el esquema en producción. Cualquier cambio de tablas va a db/migration.

Estructura rápida
backend/src/main/java/com/zyane/gt/
├ config/      (Redis, WS, WebClient, RateLimit)
├ security/    (JWT, FilterChain, Interceptor WS)
├ domain/      (Entidades JPA y Embeddables)
├ service/     (Matchmaking, Moderation, IGDB, Library)
├ controller/  (REST + STOMP)
└ exception/   (Handler global + DTOs)

frontend/src/
├ api/client.ts       (Axios + interceptor JWT)
├ store/gameStore.ts  (Zustand + lógica de fetch)
└ components/         (Vista base, sin librerías UI)

Debug común
- 401 en rutas: token expirado o no enviado. Revisa localStorage.getItem('jwt') en el cliente.
- WebSocket handshake fail: Nginx no pasa Upgrade/Connection. Verifica proxy_http_version 1.1 en nginx.conf.
- Redis connection refused: Puerto 6379 ocupado o contenedor caído. docker ps y redis-cli ping.
- Flyway migration failed: Esquema desincronizado. Borra la BD gt_main y recrea, o ajusta V1__init.sql para que coincida con las entidades.

Estado actual
[OK] Auth JWT + filtros REST/WS
[OK] Paginación estable + búsqueda por título/tags
[OK] Matchmaking ELO básico con Redis ZSET
[OK] Invites de clan con expiración y single-use
[OK] Auditoría básica (logs + IP)
[PENDIENTE] IGDB sync real (requiere credenciales prod + rotación automática)
[PENDIENTE] Panel de moderación (endpoints listos, UI sin construir)

Si algo falla al levantar, revisa los logs del contenedor api: docker logs -f gametracker-api-1. Todo está cableado explícitamente, sin abstracciones ocultas.
