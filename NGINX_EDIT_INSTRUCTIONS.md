# 📝 Инструкция: Редактирование nginx.conf на сервере

## 🎯 Цель:
Направить auth endpoints (`/api/auth/login`, `/api/auth/logout`, `/api/auth/refresh`) через Next.js вместо прямого обращения к Java backend.

---

## 📋 Шаг 1: Подключиться к серверу

```bash
ssh user@your-server
cd /path/to/tnc  # папка с docker-compose
```

---

## 📋 Шаг 2: Сделать бэкап текущего nginx.conf

```bash
# Бэкап на всякий случай
cp nginx.conf nginx.conf.backup.$(date +%Y%m%d_%H%M%S)

# Проверить что бэкап создался
ls -la nginx.conf*
```

---

## 📋 Шаг 3: Отредактировать nginx.conf

### Вариант A: Через nano (проще)
```bash
nano nginx.conf
```

### Вариант B: Через vim
```bash
vim nginx.conf
```

### Что нужно изменить:

**Найти этот блок:**
```nginx
# Логи
access_log /var/log/nginx/access.log;
error_log  /var/log/nginx/error.log;

# Проксирование API
location /api/ {
  proxy_pass http://backend:8080;
  ...
}
```

**Заменить на:**
```nginx
# Логи
access_log /var/log/nginx/access.log;
error_log  /var/log/nginx/error.log;

# ========================================================================
# СПЕЦИАЛЬНЫЕ РОУТЫ ДЛЯ АУТЕНТИФИКАЦИИ
# Эти endpoints идут через Next.js для установки HTTP-only cookies
# ВАЖНО: Должны быть ПЕРЕД общим /api/ блоком!
# ========================================================================

# /api/auth/login - вход, устанавливает cookies
location = /api/auth/login {
  proxy_pass http://app:3000;
  proxy_http_version 1.1;

  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header X-Forwarded-Host $host;
  proxy_set_header X-Forwarded-Port $server_port;

  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";

  proxy_connect_timeout 60s;
  proxy_send_timeout 60s;
  proxy_read_timeout 60s;
}

# /api/auth/logout - выход, удаляет cookies
location = /api/auth/logout {
  proxy_pass http://app:3000;
  proxy_http_version 1.1;

  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header X-Forwarded-Host $host;
  proxy_set_header X-Forwarded-Port $server_port;

  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";

  proxy_connect_timeout 60s;
  proxy_send_timeout 60s;
  proxy_read_timeout 60s;
}

# /api/auth/refresh - обновление токенов, обновляет cookies
location = /api/auth/refresh {
  proxy_pass http://app:3000;
  proxy_http_version 1.1;

  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header X-Forwarded-Host $host;
  proxy_set_header X-Forwarded-Port $server_port;

  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";

  proxy_connect_timeout 60s;
  proxy_send_timeout 60s;
  proxy_read_timeout 60s;
}

# ========================================================================
# ВСЕ ОСТАЛЬНЫЕ API ЗАПРОСЫ → JAVA BACKEND
# ========================================================================
location /api/ {
  proxy_pass http://backend:8080;
  proxy_http_version 1.1;

  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header X-Forwarded-Host $host;
  proxy_set_header X-Forwarded-Port $server_port;

  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";

  proxy_connect_timeout 60s;
  proxy_send_timeout 60s;
  proxy_read_timeout 60s;
}
```

**Сохранить:**
- В nano: `Ctrl+O`, Enter, `Ctrl+X`
- В vim: `:wq`, Enter

---

## 📋 Шаг 4: Проверить синтаксис nginx

```bash
# Проверить что конфиг корректный
docker compose exec nginx nginx -t

# Должно быть:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**Если ошибка:**
```bash
# Откатиться на бэкап
cp nginx.conf.backup.* nginx.conf

# Проверить снова
docker compose exec nginx nginx -t
```

---

## 📋 Шаг 5: Применить изменения

### Вариант A: Перезагрузить только nginx (быстрее)
```bash
docker compose exec nginx nginx -s reload

# Проверить логи
docker compose logs nginx
```

### Вариант B: Пересобрать всё (надёжнее)
```bash
# Остановить
docker compose down

# Пересобрать с новым конфигом
docker compose build

# Запустить
docker compose up -d

# Проверить логи
docker compose logs -f
```

---

## 📋 Шаг 6: Проверить что работает

### 6.1 Проверить что nginx запущен
```bash
docker compose ps

# Должен быть статус "Up"
```

### 6.2 Проверить логи nginx
```bash
docker compose logs nginx --tail=50

# Не должно быть ошибок
```

### 6.3 Тест в браузере
1. Открыть `https://tnc.az/dashboard/login`
2. Открыть DevTools (F12)
3. Network tab → поставить галочку "Preserve log"
4. Ввести credentials и Login
5. Проверить:
   - Запрос `POST /api/auth/login` → Headers → Response Headers
   - Должны быть: `Set-Cookie: access_token=...`

---

## ✅ Критерии успеха:

### В Browser Console:
```
🔐 ======================== API ROUTE: LOGIN START ========================
...
✅ access_token cookie set
✅ refresh_token cookie set
```

### В Network tab:
```
Response Headers:
  Set-Cookie: access_token=...; Path=/; HttpOnly; Secure; SameSite=Lax
  Set-Cookie: refresh_token=...; Path=/; HttpOnly; Secure; SameSite=Lax
```

### Результат:
- ✅ Успешный вход
- ✅ Редирект на `/dashboard`
- ✅ НЕТ повторного редиректа на `/dashboard/login`

---

## 🚨 Откат при проблемах:

```bash
# Вернуть старый конфиг
cp nginx.conf.backup.* nginx.conf

# Перезагрузить nginx
docker compose exec nginx nginx -s reload

# Или пересобрать
docker compose down
docker compose up -d
```

---

## 📚 Альтернатива: Замена всего файла

Если не хотите редактировать вручную, я создал готовый файл `nginx-simple.conf`:

```bash
# Скопировать готовый конфиг
cp nginx-simple.conf nginx.conf

# Проверить синтаксис
docker compose exec nginx nginx -t

# Применить
docker compose exec nginx nginx -s reload
```

---

## 🎯 Что изменилось:

### БЫЛО:
```
/api/auth/login → Java Backend (возвращает JSON, НЕ устанавливает cookies)
```

### СТАЛО:
```
/api/auth/login → Next.js API Route → Java Backend → Next.js устанавливает cookies
```

---

## ⚠️ ВАЖНО:

1. **Порядок location блоков имеет значение!**
   - `location =` (exact match) должен быть **ПЕРЕД** `location /api/`
   - Nginx проверяет в порядке приоритета

2. **После применения - очистить cookies в браузере:**
   - DevTools → Application → Cookies → удалить все для `tnc.az`
   - Обновить страницу
   - Попробовать залогиниться заново

3. **Проверить docker-compose.yml:**
   - Убедиться что `app:3000` - это правильное имя сервиса Next.js
   - Если у вас другое имя (например `frontend:3000`), замените в nginx.conf
