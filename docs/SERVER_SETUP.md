# 📋 Пошаговая настройка сервера для TnC Website

## 1. Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Перезагрузка для применения изменений
sudo reboot
```

## 2. Настройка проекта

```bash
# Создание директории
sudo mkdir -p /opt/tnc-website
sudo chown $USER:$USER /opt/tnc-website
cd /opt/tnc-website

# Скачивание production конфигурации
curl -o docker-compose.prod.yml https://raw.githubusercontent.com/kamran134/tnc/main/docker-compose.prod.yml

# Создание директорий для логов и SSL
mkdir -p ssl logs
```

## 3. Авторизация в GitHub Container Registry

```bash
# Авторизация (замените YOUR_GITHUB_TOKEN на реальный токен)
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u kamran134 --password-stdin

# Проверка авторизации
docker pull ghcr.io/kamran134/tnc:latest
```

## 4. Первый запуск

```bash
# Запуск приложения
docker-compose -f docker-compose.prod.yml up -d

# Проверка статуса
docker-compose -f docker-compose.prod.yml ps

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f
```

## 5. Настройка Nginx (опционально)

Создайте файл `nginx.conf`:

```bash
cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name _;

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
}
EOF
```

## 6. Команды для управления

```bash
# Обновление приложения
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs app -f

# Остановка
docker-compose -f docker-compose.prod.yml down

# Полная перезагрузка
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## 7. Настройка автоматических обновлений

Создайте скрипт для автоматического обновления:

```bash
cat > update.sh << 'EOF'
#!/bin/bash
cd /opt/tnc-website
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
docker image prune -f
EOF

chmod +x update.sh
```

## ✅ Готово!

После выполнения всех шагов:
- Сайт доступен по адресу `http://your-server-ip`
- Автоматические обновления через GitHub Actions настроены
- Логи доступны через `docker-compose logs`

**Важно:** На сервере НЕ нужно клонировать git репозиторий или собирать проект. Все образы уже готовы в GHCR!