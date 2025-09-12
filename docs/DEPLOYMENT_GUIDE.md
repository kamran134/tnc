# Инструкция по деплою TnC Tax & Consulting Website на сервер

## Обзор системы деплоя

Этот проект настроен для автоматического деплоя через GitHub Actions с использованием GitHub Container Registry (GHCR). При каждом push в ветку `main`:

1. **Сборка образа** происходит на GitHub Actions
2. **Готовый образ** сохраняется в GHCR (ghcr.io)
3. **На сервере** автоматически загружается новый образ и перезапускается приложение

**Преимущества такого подхода:**
- ✅ Сервер не тратит ресурсы на сборку
- ✅ Быстрый деплой (только загрузка готового образа)
- ✅ Единый образ для всех сред
- ✅ Версионирование образов в registry

## Архитектура

- **Frontend**: Next.js приложение в Docker контейнере
- **CI/CD**: GitHub Actions для автоматической сборки и деплоя
- **Registry**: GitHub Container Registry (ghcr.io) для хранения Docker образов
- **Deployment**: Docker Compose на production сервере

## 1. Настройка сервера

### Системные требования

- Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- Docker 20.10+
- Docker Compose 2.0+
- Git
- Минимум 2GB RAM, 20GB диска
- Открытые порты: 80, 443, 22

### Установка Docker и Docker Compose

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Добавление пользователя в группу docker
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Перезагрузка или выход/вход для применения изменений группы
newgrp docker
```

### Создание директории проекта

```bash
# Создание директории для проекта
sudo mkdir -p /opt/tnc-website
sudo chown $USER:$USER /opt/tnc-website
cd /opt/tnc-website

# Создание необходимых файлов (НЕ нужно клонировать весь репозиторий!)
# Создаем только docker-compose.prod.yml и nginx.conf

# Скачиваем production конфигурацию
curl -o docker-compose.prod.yml https://raw.githubusercontent.com/kamran134/tnc/main/docker-compose.prod.yml

# Создание необходимых директорий
mkdir -p ssl logs

# Авторизация в GHCR для загрузки образов
docker login ghcr.io -u kamran134

# Первый запуск (загрузка образа из GHCR)
docker-compose -f docker-compose.prod.yml up -d
```

**Важно:** На сервере НЕ нужно клонировать репозиторий и собирать проект. Мы используем готовые образы из GHCR!

### Настройка Nginx (опционально, для SSL и кастомной конфигурации)

Создайте файл `nginx.conf` в корне проекта:

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Логирование
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Основной сервер
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;

        # Перенаправление на HTTPS (если используется)
        # return 301 https://$server_name$request_uri;

        # Или проксирование на приложение
        location / {
            proxy_pass http://app:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }

    # HTTPS сервер (если используется SSL)
    # server {
    #     listen 443 ssl http2;
    #     server_name your-domain.com www.your-domain.com;
    #
    #     ssl_certificate /etc/nginx/ssl/cert.pem;
    #     ssl_certificate_key /etc/nginx/ssl/key.pem;
    #
    #     location / {
    #         proxy_pass http://app:3000;
    #         proxy_http_version 1.1;
    #         proxy_set_header Upgrade $http_upgrade;
    #         proxy_set_header Connection 'upgrade';
    #         proxy_set_header Host $host;
    #         proxy_set_header X-Real-IP $remote_addr;
    #         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #         proxy_set_header X-Forwarded-Proto $scheme;
    #         proxy_cache_bypass $http_upgrade;
    #     }
    # }
}
```

## 2. Настройка GitHub Repository

### Создание SSH ключей для деплоя

```bash
# На сервере
ssh-keygen -t rsa -b 4096 -C "deploy@tnc-website"
# Сохранить в /home/username/.ssh/deploy_key

# Скопировать публичный ключ в authorized_keys
cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys
```

### Настройка GitHub Secrets

В настройках GitHub репозитория (Settings → Secrets and variables → Actions) добавьте:

| Secret Name | Описание | Пример значения |
|-------------|----------|----------------|
| `HOST` | IP адрес или домен сервера | `192.168.1.100` |
| `USERNAME` | Имя пользователя на сервере | `ubuntu` |
| `SSH_PRIVATE_KEY` | Приватный SSH ключ | Содержимое `~/.ssh/deploy_key` |
| `PORT` | SSH порт (опционально) | `22` |

**Примечание:** `GITHUB_TOKEN` автоматически доступен в Actions и используется для авторизации в GHCR.

### Настройка GitHub Packages

Убедитесь, что в настройках репозитория включен GitHub Packages и у Actions есть права на запись в registry.

## 3. Файлы конфигурации проекта

### Dockerfile
- Многоэтапная сборка для оптимизации размера
- Использует Alpine Linux для минимального размера
- Standalone output для Next.js

### docker-compose.yml
- Определяет сервисы приложения и Nginx
- Настройки сети и томов
- Restart политики

### GitHub Actions Workflow (.github/workflows/deploy.yml)
- Тестирование кода
- Сборка Docker образа
- Push в GitHub Container Registry
- Автоматический деплой на сервер

## 4. Процесс деплоя

### Автоматический деплой

1. **Push в main ветку** → Запускается GitHub Actions
2. **Тестирование** → Проверка кода и типов
3. **Сборка образа** → Docker build на GitHub runners
4. **Push в GHCR** → Готовый образ сохраняется в ghcr.io/kamran134/tnc
5. **Деплой на сервер** → SSH подключение, pull нового образа, restart контейнеров

### Ручной деплой

```bash
# На сервере (без git репозитория!)
cd /opt/tnc-website

# Авторизация в GHCR
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u kamran134 --password-stdin

# Остановка контейнеров
docker-compose -f docker-compose.prod.yml down

# Загрузка нового образа из GHCR
docker-compose -f docker-compose.prod.yml pull

# Запуск с новым образом
docker-compose -f docker-compose.prod.yml up -d

# Проверка статуса
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

## 5. Мониторинг и обслуживание

### Проверка состояния

```bash
# Статус контейнеров
docker-compose ps

# Логи приложения
docker-compose logs app

# Логи Nginx
docker-compose logs nginx

# Использование ресурсов
docker stats
```

### Резервное копирование

```bash
# Создание бэкапа конфигурации
cd /opt/tnc-website
tar -czf backup-$(date +%Y%m%d).tar.gz docker-compose.yml nginx.conf ssl/

# Сохранение образов
docker save ghcr.io/kamran134/tnc:latest | gzip > tnc-image-backup.tar.gz
```

### Обновление SSL сертификатов

```bash
# Для Let's Encrypt с certbot
sudo certbot renew
docker-compose restart nginx
```

### Очистка системы

```bash
# Удаление неиспользуемых образов
docker image prune -f

# Очистка системы Docker
docker system prune -f

# Очистка логов
sudo journalctl --vacuum-time=7d
```

## 6. Устранение неполадок

### Проблемы с деплоем

```bash
# Проверка логов GitHub Actions
# В интерфейсе GitHub → Actions → Последний workflow

# Проверка доступности сервера
ssh username@server-ip

# Проверка Docker
docker --version
docker-compose --version
```

### Проблемы с приложением

```bash
# Логи контейнера
docker-compose logs app -f

# Вход в контейнер для отладки
docker-compose exec app sh

# Перестроение с очисткой кэша
docker-compose build --no-cache app
```

## 7. Масштабирование и оптимизация

### Горизонтальное масштабирование

```yaml
# В docker-compose.yml
services:
  app:
    deploy:
      replicas: 3
    # ... остальная конфигурация
```

### Настройка кэширования

- Настройка Redis для кэширования (при необходимости)
- CDN для статических ресурсов
- Настройка кэш-заголовков в Nginx

## 8. Безопасность

### Рекомендации

1. **Firewall**: Настройте ufw или iptables
2. **SSH**: Отключите password authentication
3. **Updates**: Регулярно обновляйте систему
4. **Monitoring**: Установите мониторинг (например, Prometheus)
5. **Backups**: Автоматизируйте резервное копирование

### Настройка Firewall

```bash
# Установка ufw
sudo ufw enable

# Разрешение необходимых портов
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Проверка статуса
sudo ufw status
```

## Заключение

Данная конфигурация обеспечивает:
- ✅ Автоматический деплой при изменениях
- ✅ Оптимизированные Docker образы
- ✅ Простое масштабирование
- ✅ Мониторинг и логирование
- ✅ Безопасность production среды

Для дополнительных вопросов или настройки специфичных требований обратитесь к документации Docker и Next.js.