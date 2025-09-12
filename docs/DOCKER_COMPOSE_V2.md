# 🐳 Docker Compose V2 Migration Guide

## Основные различия

### Команды

| Docker Compose V1 | Docker Compose V2 |
|------------------|------------------|
| `docker-compose up` | `docker compose up` |
| `docker-compose down` | `docker compose down` |
| `docker-compose ps` | `docker compose ps` |
| `docker-compose logs` | `docker compose logs` |
| `docker-compose build` | `docker compose build` |
| `docker-compose pull` | `docker compose pull` |
| `docker-compose exec` | `docker compose exec` |

### Установка

**V1 (устаревший):**
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

**V2 (современный):**
```bash
# Встроен в Docker CLI начиная с Docker 20.10+
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

## Преимущества Docker Compose V2

- ✅ **Встроен в Docker CLI** - не нужно отдельно устанавливать
- ✅ **Лучшая производительность** - написан на Go вместо Python
- ✅ **Улучшенная поддержка** - активное развитие
- ✅ **Совместимость** - поддерживает все возможности V1
- ✅ **Новые функции** - профили, расширения, и т.д.

## Проверка версии

```bash
# Docker Compose V2
docker compose version

# Если у вас всё ещё V1
docker-compose --version
```

## Миграция существующих проектов

1. **Обновите Docker** до версии 20.10+
2. **Замените команды** `docker-compose` на `docker compose`
3. **Файлы остаются те же** - никаких изменений в `docker-compose.yml`
4. **Удалите старый V1** (опционально):
   ```bash
   sudo rm /usr/local/bin/docker-compose
   ```

## Для нашего проекта TnC

Все команды обновлены на Docker Compose V2:

```bash
# Запуск на сервере
docker compose -f docker-compose.prod.yml up -d

# Обновление
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# Логи
docker compose -f docker-compose.prod.yml logs -f
```