# Инструкция по обновлению сервера

## Проблема
При клике на любой раздел в админке происходит редирект на страницу логина.

## Причина
`NEXT_PUBLIC_API_BASE_URL: https://tnc.az/api` в docker-compose.yml заставляет axios делать запросы на полный URL, при этом браузер НЕ отправляет httpOnly cookies автоматически с XHR запросами.

## Решение

### 1. Обновить docker-compose.yml на сервере

SSH на сервер:
```bash
ssh kamran@tnc-server
cd /opt/tnc-website
```

Отредактировать docker-compose.yml:
```bash
nano docker-compose.yml
```

Найти секцию `app` и изменить:
```yaml
# БЫЛО:
environment:
  NODE_ENV: production
  NEXT_TELEMETRY_DISABLED: "1"
  NEXT_PUBLIC_API_BASE_URL: https://tnc.az/api
  BACKEND_URL: http://backend:8080

# ДОЛЖНО СТАТЬ:
environment:
  NODE_ENV: production
  NEXT_TELEMETRY_DISABLED: "1"
  NEXT_PUBLIC_API_BASE_URL: /api              # ← ИЗМЕНИЛИ на относительный путь
  BACKEND_URL: http://backend:8080
```

Или вообще убрать `NEXT_PUBLIC_API_BASE_URL` - код использует `/api` по дефолту.

### 2. Пересобрать и перезапустить контейнеры

```bash
# Pull latest images
docker-compose pull app

# Restart с новыми environment variables
docker-compose up -d app

# Проверить логи
docker-compose logs -f app
```

### 3. Проверить работу

1. Открыть https://tnc.az/dashboard
2. Залогиниться
3. Открыть DevTools → Network
4. Перейти в любой раздел (Team, News, Services)
5. Проверить что запросы идут на `/api/admin/*` (без домена)
6. Проверить что cookies отправляются (Headers → Cookie)

### 4. Если не помогло - очистить cookies

В браузере:
1. F12 → Application → Cookies
2. Удалить access_token и refresh_token
3. Залогиниться заново

## Что изменилось в коде

1. `src/lib/api/client.ts`:
   - `API_BASE_URL = '/api'` (относительный путь)
   - `withCredentials: true` (отправка cookies)

2. `src/middleware.ts`:
   - Исправлено копирование cookies при refresh
   - Добавлен return для access_token

3. `src/app/api/auth/login/route.ts`:
   - Конвертация expiresIn из миллисекунд в секунды
   - Refresh token: 30 дней вместо 7
   - httpOnly: true всегда

4. `src/app/api/auth/refresh/route.ts`:
   - Правильный URL: /api/auth/refresh
   - Access token: 1 час
   - Refresh token: 30 дней

## Проверка после деплоя

```bash
# Проверить что контейнер запущен
docker ps | grep tnc-website-prod

# Проверить переменные окружения
docker exec tnc-website-prod env | grep API

# Должно вывести:
# NEXT_PUBLIC_API_BASE_URL=/api
```
