# Local dev copy of production

`docker-compose.dev.yml` brings up a full, offline mirror of **tnc.az** on your
machine: the real production database snapshot, the uploaded files, the Spring
backend and the Next.js frontend, wired together by an nginx that routes exactly
like the server. Nothing in this stack connects to the production server, so you
can rebuild / wipe it as often as you like without touching prod.

Use it to preview design/layout/content changes against real data before they
ever go near `main`.

## Layout

```
tnc/            (this repo, branch: dev)   frontend + the dev stack files
../backend-tnc  (branch: dev)              Spring Boot backend, built from source
```

Both repos must sit side by side. The backend `dev` branch adds one file,
`src/main/resources/application-localdev.properties`, activated together with the
prod profile (`PROFILE=prod,localdev`) so the app behaves like prod except for
localhost-only concessions (non-Secure cookies, no ClamAV, Swagger on).

## Files in this stack

| file | purpose |
|------|---------|
| `docker-compose.dev.yml` | the 4 services (postgres / backend / app / nginx) |
| `nginx.dev.conf`         | server routing, http-only, on port 8090 |
| `.env.dev`               | local throwaway credentials (safe to commit) |
| `dev-restore-db.sh`      | first-boot restore of the prod snapshot |
| `dev-local/db/tnc_prod.dump` | `pg_dump -Fc` of prod `tnc_prod` (gitignored) |
| `dev-local/uploads/`     | copy of the prod uploads volume (gitignored) |

`dev-local/` is gitignored - it holds real prod data. Refresh it any time with
the commands in "Refreshing the snapshot" below.

## Run

Windows helper scripts (double-click, or run from a terminal in the repo root):

| script | what it does |
|--------|--------------|
| `dev-up.cmd`               | build if needed + start everything, prints the URLs |
| `dev-down.cmd`             | stop the stack, keep the database |
| `dev-logs.cmd [service]`   | follow logs (all, or one service) |
| `dev-rebuild.cmd [app\|backend]` | rebuild images after code changes + restart, keep DB |
| `dev-reset-db.cmd`         | wipe local DB, re-restore the snapshot (uploads/images kept) |
| `dev-refresh-snapshot.cmd` | pull a fresh prod DB + uploads over ssh, then reload |

Or the raw compose command:

```bash
# from the tnc/ repo root, on branch dev
docker compose -f docker-compose.dev.yml --env-file .env.dev up -d --build
```

**Prerequisites:** Docker Desktop running; the sibling `../backend-tnc` repo on
its `dev` branch; `dev-local/db/tnc_prod.dump` present (run
`dev-refresh-snapshot.cmd` once if it is missing).

First run builds both images (a few minutes) and restores the DB. Then:

| URL | what |
|-----|------|
| http://localhost:8090            | the site (use this) |
| http://localhost:8090/dashboard  | admin dashboard |
| http://localhost:8080/swagger-ui/index.html | backend API docs |
| localhost:5432                   | postgres (`tnc_user` / `tnc_local_dev` / `tnc_prod`) |

Log in to the dashboard with any admin account that exists in the prod snapshot
(password hashes come across in the dump).

```bash
docker compose -f docker-compose.dev.yml logs -f            # tail everything
docker compose -f docker-compose.dev.yml down               # stop, keep data
docker compose -f docker-compose.dev.yml down -v            # stop + wipe DB (re-restores on next up)
docker compose -f docker-compose.dev.yml up -d --build app  # rebuild just the frontend after a change
```

## Refreshing the snapshot

```bash
# DB
ssh tnc "docker exec tnc-postgres-prod pg_dump -U tnc_user -d tnc_prod --no-owner --no-privileges -Fc" \
  > dev-local/db/tnc_prod.dump

# uploads
ssh tnc "cd /opt/tnc-website && tar czf - uploads" | tar xzf - -C dev-local/

# then reload
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up -d
```

## Проверка refresh-flow локально

Access-токен живёт 1 час, refresh — 30 дней (см. `TZ_REFRESH_TOKEN.md`). Чтобы не ждать
час, поднимите стек с коротким TTL для access-токена:

```bash
JWT_ACCESS_EXPIRATION_MS=60000 docker compose -f docker-compose.dev.yml --env-file .env.dev up -d --build
```

(60000 мс = 60 секунд; переменная переопределяет значение по умолчанию из `.env.dev`
только для этого запуска.)

Дальше:

1. Зайти на http://localhost:8090/dashboard/login, залогиниться. DevTools → Application →
   Cookies: должны появиться **обе** куки `access_token` и `refresh_token`, `HttpOnly`,
   `SameSite=Lax`, `Secure=false` (мы на http), срок жизни у обеих — **~30 дней** (не
   секунды и не 1 час — если видите короткий срок, это баг из §1 ТЗ, а не то, что должно
   быть: срок куки не совпадает с TTL самого токена).
2. Походить по разделам админки (news, services, team, contacts и т.д.) — всё грузится.
3. Подождать 70+ секунд (access-токен протух) и повторить шаг 2, а также попробовать
   создать/отредактировать запись. Всё должно продолжать работать без разлогина, в
   Network — коды 200, а не 401; значение куки `access_token` при этом должно смениться
   (сработал прозрачный рефреш).
4. Открыть вторую вкладку админки и после протухания токена перезагрузить обе вкладки
   почти одновременно — не должно быть разлогина ни в одной (несколько параллельных
   запросов не должны гонять друг друга, ротации refresh-токена нет специально).
5. Logout → проверить в БД, что сессия отозвана:
   ```bash
   docker compose -f docker-compose.dev.yml exec postgres psql -U tnc_user -d tnc_prod \
     -c "select id, revoked, created_at from refresh_tokens order by id desc limit 5;"
   ```
   У последней сессии `revoked = t`.

После проверки верните `JWT_ACCESS_EXPIRATION_MS` к значению по умолчанию (просто не
передавайте переменную при следующем `up`, либо явно `up -d --build` без неё — `.env.dev`
уже содержит дефолт `3600000`).

## How it differs from prod (all intentional, all local-only)

- images are **built from local source** (branch `dev` of each repo), not pulled
  from GHCR - that is the whole point, so you can change them
- http on `localhost:8090` instead of https on `tnc.az`; nginx has no TLS/redirect
- session cookies are not `Secure` / `SameSite=None` / `.tnc.az`
- ClamAV upload scanning is off (`APP_ANTIVIRUS_ENABLED=false`)
- Swagger UI is enabled
- ports are published on `127.0.0.1` only

To compare against the *exact* prod images instead of local builds, replace the
`build:` blocks for `backend` and `app` with
`image: ghcr.io/kamran134/backend-tnc:latest` / `image: ghcr.io/kamran134/tnc:latest`
(needs `docker login ghcr.io`).
