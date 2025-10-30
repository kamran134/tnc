# Nginx proxy_pass - правила работы со слэшами

## Критическая разница

### ❌ НЕПРАВИЛЬНО (ваш вариант на сервере):
```nginx
location /api/ {
  proxy_pass http://backend:8080/;  # ← Слэш в конце УДАЛЯЕТ /api/ из пути!
}
```
**Результат:**
- Запрос: `GET https://tnc.az/api/users/list`
- Прокси на: `GET http://backend:8080/users/list` ❌ (нет /api/)
- Backend ответит: **404 Not Found**

---

### ✅ ПРАВИЛЬНО (вариант 1 - рекомендуется):
```nginx
location /api/ {
  proxy_pass http://backend:8080;  # ← БЕЗ слэша - сохраняет весь путь
}
```
**Результат:**
- Запрос: `GET https://tnc.az/api/users/list`
- Прокси на: `GET http://backend:8080/api/users/list` ✅
- Backend ответит: **200 OK**

---

### ✅ ПРАВИЛЬНО (вариант 2 - явное указание):
```nginx
location /api/ {
  proxy_pass http://backend:8080/api/;  # ← Явно указываем /api/
}
```
**Результат:**
- Запрос: `GET https://tnc.az/api/users/list`
- Прокси на: `GET http://backend:8080/api/users/list` ✅
- Backend ответит: **200 OK**

---

## Правило работы слэша в proxy_pass

### Если proxy_pass БЕЗ URI (без слэша после порта):
```nginx
location /api/ {
  proxy_pass http://backend:8080;  # ← Нет URI
}
```
→ Весь путь запроса передаётся как есть: `/api/users/list`

### Если proxy_pass С URI (со слэшем или путём):
```nginx
location /api/ {
  proxy_pass http://backend:8080/;  # ← Есть URI (/)
}
```
→ Часть пути из `location` **заменяется** на URI из `proxy_pass`:
- `/api/users/list` → `/users/list` (убрали `/api/`)

---

## Примеры

### Пример 1: Сохранить путь (наш случай)
```nginx
location /api/ {
  proxy_pass http://backend:8080;
}
```
| Запрос клиента | Прокси на backend |
|---|---|
| `/api/users` | `http://backend:8080/api/users` |
| `/api/auth/login` | `http://backend:8080/api/auth/login` |

### Пример 2: Убрать префикс /api/
```nginx
location /api/ {
  proxy_pass http://backend:8080/;
}
```
| Запрос клиента | Прокси на backend |
|---|---|
| `/api/users` | `http://backend:8080/users` ❌ |
| `/api/auth/login` | `http://backend:8080/auth/login` ❌ |

### Пример 3: Заменить префикс
```nginx
location /api/v1/ {
  proxy_pass http://backend:8080/v2/;
}
```
| Запрос клиента | Прокси на backend |
|---|---|
| `/api/v1/users` | `http://backend:8080/v2/users` |
| `/api/v1/auth/login` | `http://backend:8080/v2/auth/login` |

### Пример 4: Swagger UI
```nginx
location /swagger-ui/ {
  proxy_pass http://backend:8080/swagger-ui/;
}
```
| Запрос клиента | Прокси на backend |
|---|---|
| `/swagger-ui/` | `http://backend:8080/swagger-ui/` ✅ |
| `/swagger-ui/index.html` | `http://backend:8080/swagger-ui/index.html` ✅ |

---

## Что нужно исправить на сервере

### На сервере у вас сейчас:
```nginx
location /api/ {
  proxy_pass http://backend:8080/;  # ❌ НЕПРАВИЛЬНО
}
```

### Исправьте на:
```nginx
location /api/ {
  proxy_pass http://backend:8080;  # ✅ ПРАВИЛЬНО (убрали слэш)
}
```

### Как применить изменения:
```bash
# 1. Отредактируйте файл на сервере
sudo nano /opt/tnc/nginx.conf

# 2. Проверьте конфигурацию
docker exec tnc-nginx-prod nginx -t

# 3. Если OK, перезагрузите nginx
docker compose -f docker-compose.prod.yml restart nginx

# 4. Проверьте логи
docker compose -f docker-compose.prod.yml logs -f nginx

# 5. Проверьте API
curl https://tnc.az/api/actuator/health
```

---

## Другие проблемы в вашем nginx.conf

Ваш nginx.conf на сервере **минималистичный**, но ему не хватает:

### 1. ❌ Нет MIME types
```nginx
http {
  include /etc/nginx/mime.types;  # ← Добавьте это
  default_type application/octet-stream;
```

### 2. ❌ Нет gzip сжатия
```nginx
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript;
```

### 3. ❌ Нет rate limiting
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location /api/ {
  limit_req zone=api_limit burst=20 nodelay;
  # ...
}
```

### 4. ❌ Нет security headers
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

### 5. ❌ Нет health check
```nginx
location /health {
  access_log off;
  return 200 "OK\n";
  add_header Content-Type text/plain;
}
```

---

## Рекомендация

Используйте мой полный `nginx.conf` из репозитория:
```bash
# На сервере
cd /opt/tnc
wget https://raw.githubusercontent.com/kamran134/tnc/main/nginx.conf
docker compose -f docker-compose.prod.yml restart nginx
```

Или скопируйте из локального репозитория:
```bash
scp nginx.conf user@server:/opt/tnc/
```
