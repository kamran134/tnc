# 🚀 Быстрый Деплой Исправлений - Готово к Production

## ✅ Что исправлено

### 1. Код приложения (уже в Git)
- ✅ Удалён authorizedFetch из всех admin страниц
- ✅ Удалён файл lib/api/fetch.ts  
- ✅ Исправлены все backend URL (добавлен /api префикс)
- ✅ Убран localStorage из логина
- ✅ ImageUpload компонент полностью работает

### 2. Nginx конфигурация (обновлена)
- ✅ `nginx-server.conf` - правильная конфигурация (ВСЕ /api/* → Next.js)
- ✅ `docker-compose.prod.yml` - добавлен volume для uploads в nginx

### 3. Документация (создана)
- ✅ `docs/NGINX_DEPLOYMENT.md` - полная инструкция по деплою
- ✅ `docs/NGINX_FILES_EXPLAINED.md` - объяснение nginx файлов

## 🎯 Команды для деплоя (копируй-вставляй)

### На вашем компьютере:

```bash
# 1. Закоммитьте изменения
git add .
git commit -m "fix: unified API routing + nginx upload optimization"
git push origin main
```

### На production сервере:

```bash
# 2. Подключитесь к серверу
ssh root@tnc.az

# 3. Перейдите в директорию проекта
cd /path/to/tnc  # замените на реальный путь

# 4. Backup текущих конфигов
cp nginx.conf nginx.conf.backup.$(date +%Y%m%d_%H%M%S)
cp docker-compose.prod.yml docker-compose.prod.yml.backup.$(date +%Y%m%d_%H%M%S)

# 5. Получите обновления
git pull origin main

# 6. Скопируйте правильный nginx конфиг
cp nginx-server.conf nginx.conf

# 7. Проверьте nginx синтаксис
docker compose -f docker-compose.prod.yml run --rm nginx nginx -t

# 8. Перезапустите всё
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml pull  # Получите последний образ Next.js
docker compose -f docker-compose.prod.yml up -d

# 9. Проверьте статус
docker compose -f docker-compose.prod.yml ps

# 10. Смотрите логи
docker logs tnc-nginx-prod --tail 50 -f
# Ctrl+C для выхода
```

## 🧪 Проверка что всё работает

Откройте браузер (DevTools F12) и проверьте:

### 1. Главная страница
```
https://tnc.az/
✅ Должна загрузиться
```

### 2. Логин
```
https://tnc.az/dashboard/login
✅ Введите email/password
✅ После логина → перенаправление на /dashboard
✅ DevTools → Application → Cookies:
   - access_token (HttpOnly, Secure)
   - refresh_token (HttpOnly, Secure)
```

### 3. Админ панель
```
https://tnc.az/dashboard
✅ Видны Services/News/Careers/Contacts
✅ DevTools → Network:
   - /api/admin/services → 200 OK
   - Request Headers → Cookie: access_token=...
```

### 4. Загрузка файла
```
Dashboard → Services → Add New → Upload Image
✅ Файл загружается
✅ Превью отображается
✅ После сохранения файл доступен: https://tnc.az/uploads/[filename]
```

## 🔍 Диагностика проблем

### Проблема: 401 Unauthorized на /api/admin/*

**Причина**: Cookies не отправляются или неправильные

**Решение**:
```bash
# Проверьте логи Next.js
docker logs tnc-website-prod --tail 100

# Проверьте cookies в браузере (DevTools → Application → Cookies)
# Должны быть: access_token, refresh_token

# Проверьте что nginx проксирует на Next.js:
docker exec tnc-nginx-prod cat /etc/nginx/nginx.conf | grep "location /api/"
# Должно быть: proxy_pass http://app:3000;
```

### Проблема: 404 на /uploads/[filename]

**Причина**: nginx не видит volume с файлами

**Решение**:
```bash
# Проверьте что volume примонтирован
docker inspect tnc-nginx-prod | grep -A 5 Mounts

# Должно быть:
# "Source": "/path/to/tnc/uploads"
# "Destination": "/var/www/uploads"

# Проверьте файлы внутри контейнера
docker exec tnc-nginx-prod ls -lah /var/www/uploads/
docker exec tnc-backend-prod ls -lah /var/app/uploads/
# Должны показать одинаковые файлы
```

### Проблема: Cannot read properties of undefined

**Причина**: .next cache не очистился

**Решение**:
```bash
# На сервере
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml pull  # Получить свежий образ
docker compose -f docker-compose.prod.yml up -d --force-recreate
```

## 📊 Архитектура (после исправлений)

```
Browser (https://tnc.az)
   │
   ▼
NGINX (443)
   │
   ├─→ /api/* ──────────────────→ Next.js :3000
   │                                │ Читает HTTP-only cookies
   │                                │ Извлекает access_token
   │                                │ Добавляет Authorization: Bearer ...
   │                                ▼
   │                             Backend :8080
   │                                │ Проверяет JWT
   │                                │ Возвращает данные
   │                                ▼
   │                             Next.js :3000
   │                                │ Возвращает JSON
   │   ◄────────────────────────────┘
   │
   ├─→ /uploads/* ───→ nginx раздаёт напрямую из /var/www/uploads/
   │                    (без проксирования на backend)
   │
   └─→ /* ──────────────────────→ Next.js :3000
```

## 📝 Чеклист перед деплоем

На локальной машине:
- [ ] Git commit + push всех изменений

На production сервере:
- [ ] Backup старых конфигов (nginx.conf, docker-compose.prod.yml)
- [ ] Git pull последних изменений
- [ ] Скопировал nginx-server.conf → nginx.conf
- [ ] Проверил nginx синтаксис (nginx -t)
- [ ] Down контейнеры
- [ ] Pull последних образов
- [ ] Up контейнеры
- [ ] Все контейнеры в статусе "Up"

Тестирование:
- [ ] Главная страница загружается
- [ ] Логин работает
- [ ] Cookies устанавливаются (DevTools)
- [ ] Админ панель открывается
- [ ] /api/admin/* возвращает 200 OK (не 401)
- [ ] Загрузка файла работает
- [ ] /uploads/[file] доступен

## 🆘 Откат (если всё сломалось)

```bash
# На сервере
docker compose -f docker-compose.prod.yml down

# Восстановите backup
cp nginx.conf.backup.YYYYMMDD_HHMMSS nginx.conf
cp docker-compose.prod.yml.backup.YYYYMMDD_HHMMSS docker-compose.prod.yml

# Запустите старую версию
docker compose -f docker-compose.prod.yml up -d
```

## 🎉 Готово!

После успешного деплоя:
- ✅ Admin panel работает без 401 ошибок
- ✅ Все API запросы идут через Next.js с cookies
- ✅ Файлы загружаются и раздаются эффективно
- ✅ Архитектура унифицирована и правильная

**Время деплоя: ~5 минут**  
**Downtime: ~30 секунд** (только во время перезапуска контейнеров)

---

Вопросы? Проверьте:
- `docs/NGINX_DEPLOYMENT.md` - детальная инструкция
- `docs/NGINX_FILES_EXPLAINED.md` - объяснение nginx файлов
- Логи контейнеров: `docker logs [container-name]`
