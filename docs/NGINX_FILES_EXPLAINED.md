# Nginx конфигурационные файлы - Справка

## Обзор файлов

В проекте есть несколько nginx конфигураций:

| Файл | Назначение | Использование |
|------|-----------|---------------|
| `nginx.conf` | **PRODUCTION** конфиг на сервере | Используется docker-compose.prod.yml |
| `nginx-server.conf` | **TEMPLATE** правильной конфигурации | Скопируйте в nginx.conf перед деплоем |
| `nginx-local.conf` | Development конфиг (если есть) | Для локальной разработки |

## Важно!

### nginx-server.conf - ЭТО ПРАВИЛЬНАЯ КОНФИГУРАЦИЯ ✅

Этот файл содержит **правильную архитектуру**:
- Все `/api/*` → Next.js (cookie-based auth)
- Прямая раздача `/uploads/` из volume
- SSL, security headers, compression

### nginx.conf - ЭТО ФАЙЛ ДЛЯ PRODUCTION

На сервере используется `nginx.conf`, поэтому:
```bash
# Перед деплоем на сервере выполните:
cp nginx-server.conf nginx.conf
```

## Почему два файла?

1. **nginx-server.conf** - шаблон правильной конфигурации
   - Хранится в Git
   - Обновляется разработчиками
   - Содержит все исправления

2. **nginx.conf** - активный конфиг
   - Используется docker-compose.prod.yml
   - Может быть модифицирован на сервере
   - Требует обновления при изменении nginx-server.conf

## Workflow обновления

```bash
# 1. На сервере сделайте backup
cp nginx.conf nginx.conf.backup.$(date +%Y%m%d)

# 2. Скопируйте новый конфиг
cp nginx-server.conf nginx.conf

# 3. Проверьте синтаксис
docker compose -f docker-compose.prod.yml run --rm nginx nginx -t

# 4. Перезапустите
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d
```

## Ключевые различия архитектур

### СТАРАЯ (неправильная):
```nginx
location /api/auth/ { proxy_pass http://app:3000; }
location /api/ { proxy_pass http://backend:8080; }  # ❌
location /uploads/ { proxy_pass http://backend:8080/uploads/; }  # ❌
```

### НОВАЯ (правильная, в nginx-server.conf):
```nginx
location /api/ { proxy_pass http://app:3000; }  # ✅ ВСЁ
location /uploads/ { alias /var/www/uploads/; }  # ✅ Прямая раздача
```

## Проверка на сервере

После обновления проверьте:

```bash
# Какой конфиг используется?
docker exec tnc-nginx-prod cat /etc/nginx/nginx.conf | head -20

# Должно быть в начале файла:
# PRODUCTION NGINX CONFIGURATION для TnC (tnc.az)
# Архитектура:
# - ВСЕ /api/* запросы → Next.js (cookie-based auth)
```

## Если что-то сломалось

```bash
# Откат на backup
docker compose -f docker-compose.prod.yml down
cp nginx.conf.backup.20250102 nginx.conf  # Замените на дату вашего backup
docker compose -f docker-compose.prod.yml up -d
```

## Контрольные точки

✅ nginx-server.conf существует и содержит правильную архитектуру  
✅ docker-compose.prod.yml монтирует `./nginx.conf` (не nginx-server.conf!)  
✅ docker-compose.prod.yml имеет volume `./uploads:/var/www/uploads:ro` для nginx  
✅ На сервере перед деплоем: `cp nginx-server.conf nginx.conf`  
✅ После деплоя: все /api/* идут через Next.js  
✅ После деплоя: /uploads/ раздаются напрямую nginx  

## Быстрая команда для обновления на production

```bash
#!/bin/bash
# update-nginx.sh

# Backup
cp nginx.conf nginx.conf.backup.$(date +%Y%m%d_%H%M%S)

# Update
cp nginx-server.conf nginx.conf

# Test
docker compose -f docker-compose.prod.yml run --rm nginx nginx -t

# Restart
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d

# Check
docker compose -f docker-compose.prod.yml ps
docker logs tnc-nginx-prod --tail 20

echo "✅ Nginx updated!"
```

Сохраните этот скрипт на сервере и запускайте для обновления nginx.
