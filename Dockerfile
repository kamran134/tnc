# Dockerfile для TnC Tax & Consulting Website
# Multi-stage сборка для оптимизации размера образа

# Базовый образ для сборки - используем более новую версию
FROM node:20-alpine AS base

# Установка зависимостей только когда необходимо
FROM base AS deps
# Добавление libc6-compat для совместимости с Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Копирование файлов зависимостей
COPY package*.json ./
# Устанавливаем ВСЕ зависимости (включая devDependencies для сборки)
RUN npm ci

# Стадия сборки
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Отключение телеметрии Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# 👇 Добавляем это:
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

# Сборка приложения
RUN npm run build

# Продакшн образ, копирование только необходимых файлов
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Создание пользователя nextjs для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копирование публичных файлов (только если они существуют)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Автоматическое использование output traces для уменьшения размера образа
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Запуск приложения
CMD ["node", "server.js"]