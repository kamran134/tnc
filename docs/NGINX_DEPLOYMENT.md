# NGINX и Docker Compose обновление - Инструкция по деплою

## Что было исправлено

### 1. nginx-server.conf
✅ **Unified API Routing**: Все `/api/*` запросы теперь идут через Next.js для cookie-based authentication
✅ **Прямая раздача файлов**: `/uploads/` раздаются напрямую nginx из volume (не через Java backend)
✅ **Оптимизация**: Кеширование загруженных файлов на 1 год, правильные MIME типы

### 2. docker-compose.prod.yml
✅ **Volume для nginx**: Добавлен `./uploads:/var/www/uploads:ro` для доступа к загруженным файлам

## Деплой на production сервер

### Шаг 1: Подготовка на сервере

```bash
# Подключитесь к серверу
ssh root@tnc.az  # или ваш SSH ключ

# Перейдите в директорию проекта
cd /path/to/tnc  # замените на реальный путь

# Сделайте backup текущих конфигов
cp nginx.conf nginx.conf.backup.$(date +%Y%m%d_%H%M%S)
cp docker-compose.prod.yml docker-compose.prod.yml.backup.$(date +%Y%m%d_%H%M%S)
```

### Шаг 2: Обновление файлов

```bash
# Получите последние изменения из Git
git fetch origin
git pull origin main  # или master

# Проверьте, что файлы обновились
ls -lah nginx-server.conf
ls -lah docker-compose.prod.yml
```

### Шаг 3: Скопируйте новый nginx.conf

```bash
# Замените старый nginx.conf новым nginx-server.conf
cp nginx-server.conf nginx.conf

# Проверьте права доступа
chmod 644 nginx.conf
```

### Шаг 4: Проверка nginx конфигурации

```bash
# Проверьте синтаксис nginx конфигурации ДО перезапуска
docker compose -f docker-compose.prod.yml run --rm nginx nginx -t

# Вы должны увидеть:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Шаг 5: Перезапуск контейнеров

```bash
# Остановите контейнеры (сайт станет недоступен на несколько секунд)
docker compose -f docker-compose.prod.yml down

# Запустите контейнеры с новой конфигурацией
docker compose -f docker-compose.prod.yml up -d

# Проверьте статус контейнеров
docker compose -f docker-compose.prod.yml ps

# Все сервисы должны быть в состоянии "Up" или "Up (healthy)"
```

### Шаг 6: Проверка логов

```bash
# Посмотрите логи nginx
docker logs tnc-nginx-prod --tail 50 -f

# Посмотрите логи Next.js
docker logs tnc-website-prod --tail 50 -f

# Посмотрите логи backend
docker logs tnc-backend-prod --tail 50 -f

# Ctrl+C чтобы выйти из просмотра логов
```

### Шаг 7: Тестирование

Откройте в браузере и проверьте:

1. **Главная страница**: https://tnc.az/
   - ✅ Должна загрузиться

2. **Логин в админку**: https://tnc.az/dashboard/login
   - ✅ Введите логин/пароль
   - ✅ Должно успешно залогинить

3. **Админ панель**: https://tnc.az/dashboard
   - ✅ Должна показать список сервисов/новостей/вакансий

4. **API эндпоинт**: https://tnc.az/api/admin/services
   - ✅ Должен вернуть JSON с данными (если залогинены)
   - ✅ Или 401 Unauthorized (если не залогинены)

5. **Загрузка файла**: В админке попробуйте загрузить изображение
   - ✅ Должно успешно загрузиться
   - ✅ Проверьте, что файл доступен: https://tnc.az/uploads/[filename]

### Шаг 8: Мониторинг

```bash
# Следите за логами в реальном времени
docker compose -f docker-compose.prod.yml logs -f

# Проверьте использование ресурсов
docker stats

# Проверьте, что volume для uploads работает
docker exec tnc-nginx-prod ls -lah /var/www/uploads/
docker exec tnc-backend-prod ls -lah /var/app/uploads/
# Должны видеть одинаковые файлы
```

## Откат на предыдущую версию (если что-то пошло не так)

```bash
# Остановите контейнеры
docker compose -f docker-compose.prod.yml down

# Восстановите старые конфиги
cp nginx.conf.backup.YYYYMMDD_HHMMSS nginx.conf
cp docker-compose.prod.yml.backup.YYYYMMDD_HHMMSS docker-compose.prod.yml

# Запустите контейнеры со старой конфигурацией
docker compose -f docker-compose.prod.yml up -d
```

## Проверка cookie-based authentication

После деплоя, откройте DevTools (F12) в браузере:

### До логина:
```
Application → Cookies → https://tnc.az
(должно быть пусто)
```

### После логина:
```
Application → Cookies → https://tnc.az
✅ access_token: xxx...xxx (HttpOnly, Secure)
✅ refresh_token: xxx...xxx (HttpOnly, Secure)
```

### Проверка API запроса:
```
Network → XHR → /api/admin/services
Request Headers:
✅ Cookie: access_token=xxx; refresh_token=xxx
Response:
✅ 200 OK с данными
```

## Архитектурная диаграмма (новая)

```
Browser
   ↓ https://tnc.az/dashboard
   ↓
NGINX (443)
   ↓
   ├─→ /api/* ────────────→ Next.js (3000)
   │                          ↓ читает cookies
   │                          ↓ добавляет Bearer token
   │                          ↓
   │                       Backend (8080)
   │                          ↓ проверяет JWT
   │                          ↓ возвращает данные
   │                          ↓
   │                       Next.js (3000)
   │                          ↓ возвращает JSON
   │                          ↓
   │   ←─────────────────────┘
   │
   ├─→ /uploads/* ─────────→ nginx раздает напрямую из /var/www/uploads/
   │
   └─→ /* (остальное) ──────→ Next.js (3000)
```

## Важные изменения

### До (СТАРАЯ АРХИТЕКТУРА - НЕПРАВИЛЬНО):
```nginx
location /api/auth/ { proxy_pass http://app:3000; }  # Только auth
location /api/ { proxy_pass http://backend:8080; }   # Остальное напрямую ❌
```
**Проблема**: Админ запросы шли напрямую на backend без cookies → 401 Unauthorized

### После (НОВАЯ АРХИТЕКТУРА - ПРАВИЛЬНО):
```nginx
location /api/ { proxy_pass http://app:3000; }  # ВСЁ через Next.js ✅
```
**Решение**: Все API запросы через Next.js → cookies читаются → токены добавляются → backend получает Authorization header

## Контакты для поддержки

Если возникли проблемы:
1. Проверьте логи всех контейнеров
2. Проверьте DevTools → Network → Headers
3. Проверьте DevTools → Application → Cookies
4. Убедитесь, что volume для uploads примонтирован в оба контейнера (nginx и backend)

## Чеклист деплоя

- [ ] Backup старых конфигов
- [ ] Git pull с последними изменениями
- [ ] Скопировал nginx-server.conf в nginx.conf
- [ ] Проверил синтаксис nginx (nginx -t)
- [ ] Остановил контейнеры (down)
- [ ] Запустил контейнеры (up -d)
- [ ] Все контейнеры в статусе "Up"
- [ ] Проверил логи (нет ошибок)
- [ ] Протестировал главную страницу
- [ ] Протестировал логин
- [ ] Протестировал админ панель
- [ ] Протестировал загрузку файла
- [ ] Проверил cookies в DevTools
- [ ] Проверил /uploads/ URL для загруженных файлов

**Готово! 🎉**
