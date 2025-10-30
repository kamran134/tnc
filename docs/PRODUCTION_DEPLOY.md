# Инструкция по деплою TNC на production сервер

## Проблема, которую мы решили

**Было:** Frontend отправлял запросы на `http://localhost:8080`
**Стало:** Frontend отправляет запросы через nginx на `https://tnc.az/api/*`

## Архитектура

```
Браузер → NGINX (443) → Frontend (3000) или Backend (8080)
                      ↓
                  PostgreSQL (5432)
```

**Маршрутизация nginx:**
- `/` → Next.js Frontend (app:3000)
- `/api/*` → Spring Boot Backend (backend:8080)
- `/swagger-ui/*` → Swagger UI
- `/uploads/*` → Файлы загрузки

## Шаг 1: Подготовка сервера

### 1.1 Установите Docker и Docker Compose

```bash
# Обновите систему
sudo apt update && sudo apt upgrade -y

# Установите Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Добавьте пользователя в группу docker
sudo usermod -aG docker $USER
newgrp docker

# Установите Docker Compose (если не установлен)
sudo apt install docker-compose-plugin -y

# Проверьте версии
docker --version
docker compose version
```

### 1.2 Создайте рабочую директорию

```bash
sudo mkdir -p /opt/tnc
cd /opt/tnc
```

## Шаг 2: Копируйте файлы на сервер

Скопируйте эти файлы из проекта на сервер:

```bash
# Локально (с вашего компьютера)
scp docker-compose.prod.yml user@your-server:/opt/tnc/
scp nginx.conf user@your-server:/opt/tnc/
```

## Шаг 3: Настройка SSL сертификатов

### Вариант A: Let's Encrypt (бесплатные сертификаты)

```bash
cd /opt/tnc

# Установите certbot
sudo apt install certbot -y

# Получите сертификаты
sudo certbot certonly --standalone \
  -d tnc.az \
  -d www.tnc.az \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive

# Создайте символические ссылки
sudo mkdir -p /opt/tnc/ssl
sudo ln -s /etc/letsencrypt/live/tnc.az/fullchain.pem /opt/tnc/ssl/fullchain.pem
sudo ln -s /etc/letsencrypt/live/tnc.az/privkey.pem /opt/tnc/ssl/privkey.pem

# Настройте автообновление (cron)
sudo crontab -e
# Добавьте строку:
0 0 1 * * certbot renew --quiet && docker compose -f /opt/tnc/docker-compose.prod.yml restart nginx
```

### Вариант B: Самоподписанный сертификат (только для тестов!)

```bash
cd /opt/tnc
mkdir -p ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/privkey.pem \
  -out ssl/fullchain.pem \
  -subj "/C=AZ/ST=Baku/L=Baku/O=TNC/CN=tnc.az"
```

## Шаг 4: Настройка переменных окружения

Отредактируйте `docker-compose.prod.yml` на сервере:

```bash
cd /opt/tnc
nano docker-compose.prod.yml
```

**ВАЖНО! Измените эти значения:**

```yaml
# PostgreSQL пароль
- POSTGRES_PASSWORD=ВАШ_СЛОЖНЫЙ_ПАРОЛЬ_123

# Backend настройки
- SPRING_DATASOURCE_PASSWORD=ВАШ_СЛОЖНЫЙ_ПАРОЛЬ_123
- JWT_SECRET=очень-длинный-секретный-ключ-минимум-256-бит-для-production

# Отключите Swagger в production (для безопасности)
- SWAGGER_ENABLED=false

# CORS должен содержать только ваш домен
- CORS_ALLOWED_ORIGINS=https://tnc.az,https://www.tnc.az
```

## Шаг 5: Создайте необходимые директории

```bash
cd /opt/tnc
mkdir -p postgres-data
mkdir -p uploads
mkdir -p logs/nginx
mkdir -p certbot/www

# Установите правильные права
chmod -R 755 uploads
chmod -R 755 logs
```

## Шаг 6: Запустите сервисы

```bash
cd /opt/tnc

# Загрузите образы
docker compose -f docker-compose.prod.yml pull

# Запустите все сервисы
docker compose -f docker-compose.prod.yml up -d

# Проверьте статус
docker compose -f docker-compose.prod.yml ps

# Смотрите логи
docker compose -f docker-compose.prod.yml logs -f
```

## Шаг 7: Проверка работоспособности

```bash
# Проверьте контейнеры
docker ps

# Должны быть запущены:
# - tnc-postgres-prod
# - tnc-backend-prod
# - tnc-website-prod
# - tnc-nginx-prod

# Проверьте логи
docker compose -f docker-compose.prod.yml logs backend
docker compose -f docker-compose.prod.yml logs app
docker compose -f docker-compose.prod.yml logs nginx

# Проверьте health checks
docker inspect tnc-backend-prod | grep -A 10 Health
docker inspect tnc-website-prod | grep -A 10 Health

# Проверьте доступность
curl http://localhost/health  # Должен вернуть "OK"
curl https://tnc.az/health     # Должен вернуть "OK"
```

## Шаг 8: Настройка DNS

В настройках домена `tnc.az` создайте A-записи:

```
A    tnc.az      →  IP_ВАШЕГО_СЕРВЕРА
A    www.tnc.az  →  IP_ВАШЕГО_СЕРВЕРА
```

## Команды для управления

### Обновление приложения

```bash
cd /opt/tnc

# Загрузите новые образы
docker compose -f docker-compose.prod.yml pull

# Перезапустите с новыми образами (zero-downtime)
docker compose -f docker-compose.prod.yml up -d

# Или перезапустите только frontend/backend
docker compose -f docker-compose.prod.yml pull app
docker compose -f docker-compose.prod.yml up -d app
```

### Просмотр логов

```bash
# Все логи
docker compose -f docker-compose.prod.yml logs -f

# Логи конкретного сервиса
docker compose -f docker-compose.prod.yml logs -f app
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f nginx

# Последние 100 строк
docker compose -f docker-compose.prod.yml logs --tail=100 app
```

### Остановка и запуск

```bash
# Остановить все
docker compose -f docker-compose.prod.yml down

# Остановить и удалить volumes (ОСТОРОЖНО! Удалит базу данных!)
docker compose -f docker-compose.prod.yml down -v

# Запустить
docker compose -f docker-compose.prod.yml up -d

# Перезапустить конкретный сервис
docker compose -f docker-compose.prod.yml restart app
```

### Резервное копирование базы данных

```bash
# Создать backup
docker exec tnc-postgres-prod pg_dump -U tnc_user tnc_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановить из backup
docker exec -i tnc-postgres-prod psql -U tnc_user tnc_prod < backup_20251030_120000.sql
```

### Очистка

```bash
# Удалить неиспользуемые образы
docker image prune -a

# Удалить неиспользуемые volumes
docker volume prune

# Посмотреть использование диска
docker system df
```

## Мониторинг

### Проверка ресурсов

```bash
# Использование CPU/Memory
docker stats

# Использование диска
du -sh /opt/tnc/*
df -h
```

### Health checks

```bash
# Backend health
curl https://tnc.az/api/actuator/health

# Frontend health
curl https://tnc.az/

# Nginx health
curl https://tnc.az/health
```

## Troubleshooting

### Проблема: Frontend не может подключиться к Backend

**Проверьте:**
1. Переменная `NEXT_PUBLIC_API_BASE_URL=https://tnc.az/api` установлена в docker-compose
2. Nginx проксирует `/api/*` на `backend:8080`
3. Backend запущен: `docker ps | grep backend`
4. Логи backend: `docker compose -f docker-compose.prod.yml logs backend`

### Проблема: 502 Bad Gateway

**Решение:**
```bash
# Проверьте, что все сервисы запущены
docker compose -f docker-compose.prod.yml ps

# Перезапустите nginx
docker compose -f docker-compose.prod.yml restart nginx

# Проверьте логи
docker compose -f docker-compose.prod.yml logs nginx
```

### Проблема: SSL сертификат не работает

**Решение:**
```bash
# Проверьте файлы сертификатов
ls -la /opt/tnc/ssl/

# Обновите сертификаты
sudo certbot renew
docker compose -f docker-compose.prod.yml restart nginx
```

### Проблема: База данных не запускается

**Решение:**
```bash
# Проверьте логи
docker compose -f docker-compose.prod.yml logs postgres

# Проверьте права на директорию
ls -la postgres-data/

# Если нужно, удалите данные и начните заново
# ОСТОРОЖНО: удалит все данные!
docker compose -f docker-compose.prod.yml down
rm -rf postgres-data
docker compose -f docker-compose.prod.yml up -d
```

## Важные URL

После деплоя доступны:

- **Frontend**: https://tnc.az
- **Backend API**: https://tnc.az/api/
- **Swagger UI**: https://tnc.az/swagger-ui/ (если SWAGGER_ENABLED=true)
- **Health Check**: https://tnc.az/health
- **Admin Dashboard**: https://tnc.az/dashboard/login

## Безопасность

### Рекомендации:

1. ✅ **Используйте сильные пароли** для PostgreSQL и JWT_SECRET
2. ✅ **Отключите Swagger** в production (`SWAGGER_ENABLED=false`)
3. ✅ **Отключите H2 Console** (удалите location `/h2-console/` из nginx.conf)
4. ✅ **Настройте firewall**:
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```
5. ✅ **Регулярно обновляйте Docker образы**
6. ✅ **Настройте автоматические бэкапы БД**
7. ✅ **Мониторинг логов** на подозрительную активность

## Автоматический деплой через GitHub Actions

Деплой уже настроен в `.github/workflows/docker-publish.yml`. 

При каждом push в `main`:
1. Собирается Docker образ
2. Образ загружается в GHCR
3. На сервере выполните:
   ```bash
   cd /opt/tnc
   docker compose -f docker-compose.prod.yml pull
   docker compose -f docker-compose.prod.yml up -d
   ```

## Поддержка

Если возникли проблемы:
1. Проверьте логи: `docker compose -f docker-compose.prod.yml logs -f`
2. Проверьте статус: `docker compose -f docker-compose.prod.yml ps`
3. Проверьте health: `curl https://tnc.az/health`
