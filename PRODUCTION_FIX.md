# ЧТО БЫЛО ИСПРАВЛЕНО

## Проблема
Frontend отправлял запросы на `http://localhost:8080` вместо реального API на production сервере.

## Причины
1. ❌ `NEXT_PUBLIC_API_BASE_URL` в `docker-compose.prod.yml` был указан как `https://tnc.az/` (корень)
2. ❌ Отсутствовал `nginx.conf` для проксирования `/api/*` запросов на backend
3. ❌ Backend не был добавлен в docker-compose.prod.yml

## Решение

### 1. Создан nginx.conf
- Проксирует `https://tnc.az/api/*` → `backend:8080/api/*`
- Проксирует `https://tnc.az/` → `app:3000` (frontend)
- Настроены SSL, security headers, rate limiting
- Добавлены health checks

### 2. Обновлен docker-compose.prod.yml
Добавлены сервисы:
- ✅ **postgres** - PostgreSQL 16
- ✅ **backend** - Spring Boot (ghcr.io/yeskela7/backend-tnc:master-e4e85fa)
- ✅ **app** - Next.js Frontend
- ✅ **nginx** - Reverse proxy

**Важно!** Установлена переменная:
```yaml
environment:
  - NEXT_PUBLIC_API_BASE_URL=https://tnc.az/api
```

### 3. Архитектура
```
Браузер
   ↓
NGINX (443) - SSL Termination
   ↓
   ├── / → app:3000 (Next.js)
   ├── /api/* → backend:8080 (Spring Boot)
   └── /swagger-ui/* → backend:8080
```

## Что нужно сделать на сервере

### 1. Скопировать файлы
```bash
scp docker-compose.prod.yml user@server:/opt/tnc/
scp nginx.conf user@server:/opt/tnc/
```

### 2. Настроить SSL
```bash
# Let's Encrypt
sudo certbot certonly --standalone -d tnc.az -d www.tnc.az

# Или самоподписанный (для теста)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/privkey.pem -out ssl/fullchain.pem
```

### 3. Изменить пароли в docker-compose.prod.yml
- POSTGRES_PASSWORD
- SPRING_DATASOURCE_PASSWORD
- JWT_SECRET
- CORS_ALLOWED_ORIGINS

### 4. Создать директории
```bash
mkdir -p postgres-data uploads logs/nginx ssl
```

### 5. Запустить
```bash
docker compose -f docker-compose.prod.yml up -d
```

### 6. Проверить
```bash
# Логи
docker compose -f docker-compose.prod.yml logs -f

# Health check
curl https://tnc.az/health

# API
curl https://tnc.az/api/actuator/health
```

## Файлы проекта

### Созданы:
- ✅ `nginx.conf` - конфигурация nginx reverse proxy
- ✅ `docs/PRODUCTION_DEPLOY.md` - полная инструкция по деплою
- ✅ `.env.example` - пример переменных окружения

### Обновлены:
- ✅ `docker-compose.prod.yml` - полная production конфигурация

### Без изменений:
- ✅ `src/lib/api/client.ts` - fallback на localhost:8080 остался (для локальной разработки)

## Проверочный список для production

- [ ] DNS настроен (A-запись tnc.az → IP сервера)
- [ ] SSL сертификаты установлены
- [ ] Пароли изменены в docker-compose.prod.yml
- [ ] Swagger отключен (SWAGGER_ENABLED=false)
- [ ] CORS настроен только на ваш домен
- [ ] Firewall настроен (порты 80, 443)
- [ ] Бэкапы PostgreSQL настроены
- [ ] Логи мониторятся

## Локальная разработка

Без изменений! Используйте:
```bash
npm run dev
```

API будет `http://localhost:8080` (backend должен быть запущен отдельно)

## Полная документация

См. `docs/PRODUCTION_DEPLOY.md` для подробной инструкции.
