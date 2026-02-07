# Company Info Page - Performance Fix

## Проблема
Страница company-info генерировала множество запросов к бэкенду из-за:
1. `useEffect` с отсутствующими зависимостями создавал бесконечный цикл
2. Прямые вызовы API вместо React Query
3. После сохранения делался повторный ручной запрос
4. Отсутствие мемоизации вызывало излишние ререндеры

## Решение

### 1. React Query Integration
✅ Создан `useAdminContentQueries.ts` с хуками для company-info:
- `useCompanyInfoQuery()` - кеширование с 5 мин staleTime
- `useCompanyInfoMutation()` - автоматическая инвалидация кеша после операций

### 2. Мемоизация
✅ Все callback-функции обёрнуты в `useCallback`:
- `updateTranslation`
- `addItem`
- `removeItem`
- `updateItem`
- `handleSubmit`
- `handleDelete`

✅ Константы и иконки в `useMemo`:
- `exists` - вычисляется из serverData
- `isSubmitting` - агрегация состояний мутаций
- `missionIcons` / `visionIcons` - кеширование списков иконок

### 3. Удалён manual loading state
❌ Убран `useEffect` с `loadCompanyInfo()`
❌ Убран `isLoadingData` state
✅ Используется `isLoading` из React Query

### 4. Правильная работа с данными
- Один `useEffect` для инициализации формы из `serverData`
- Нормализация данных через функцию `normalizeCompanyInfo`
- Автоматическая инвалидация кеша после мутаций

## Результат
- ✅ Запросы выполняются **только при необходимости**
- ✅ Кеширование на 5 минут снижает нагрузку
- ✅ Нет бесконечных циклов
- ✅ Оптимизированные ререндеры
- ✅ Профессиональный код с современными паттернами

## Технологии
- React Query (TanStack Query) v5
- useCallback / useMemo для performance
- Централизованные query keys
- Автоматическая инвалидация кеша
