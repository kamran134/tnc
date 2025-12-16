# План Рефакторинга - Разделение Логики и UI

## 🎯 Текущее Состояние

### ✅ Что УЖЕ СДЕЛАНО (предыдущий рефакторинг):

1. **Service Layer** - РЕАЛИЗОВАНО ✅
   - `src/lib/api/` - все API сервисы созданы
   - `admin-team.service.ts` - есть полный CRUD для команды
   - `admin-news.service.ts` - есть для новостей
   - `admin-careers.service.ts` - есть для карьеры
   - `admin-services.service.ts` - есть для сервисов
   - `files.service.ts` - есть для загрузки файлов
   - И многие другие...

2. **React Query Hooks** - ЧАСТИЧНО РЕАЛИЗОВАНО ⚠️
   - `src/hooks/queries/` - созданы query hooks для:
     - `useAdminNewsQueries.ts` ✅
     - `useAdminCareersQueries.ts` ✅
     - `useAdminServicesQueries.ts` ✅
     - `useAdminContactsQueries.ts` ✅
     - `useAdminPageHeroQueries.ts` ✅
     - `useDashboardQueries.ts` ✅
   - **НО!** НЕТ `useAdminTeamQueries.ts` ❌

3. **Utils** - МИНИМАЛЬНО
   - `src/lib/utils/cleanup.ts` - только одна утилита

### ❌ Что НЕ СДЕЛАНО:

1. **TeamMemberForm** - НЕ РЕФАКТОРЕН
   - Всё еще использует `fetch()` напрямую (строки 99-127)
   - Нет `useAdminTeamQueries` хуков
   - Нет custom hook для логики формы
   - 430+ строк в одном компоненте

2. **Другие формы** тоже НЕ РЕФАКТОРЕНЫ:
   - `src/app/dashboard/services/new/page.tsx` - использует fetch
   - `src/app/dashboard/news/new/page.tsx` - использует fetch
   - `src/app/dashboard/careers/new/page.tsx` - использует fetch
   - `src/app/dashboard/contacts/page.tsx` - использует fetch

3. **ImageUpload** компонент:
   - `src/components/ui/ImageUpload.tsx` - использует fetch напрямую
   - Должен использовать `filesService`

4. **Custom Hooks для форм** - НЕТ
   - Нет `useTeamMemberForm`
   - Нет `useNewsForm`
   - Нет `useCareerForm`
   - Нет `useImageUpload`

---

## 📋 ПЛАН ДЕЙСТВИЙ

### Фаза 1: Завершить React Query слой (Team) ✅ ГОТОВО
**Приоритет: ВЫСОКИЙ** | Время: 30 минут

- [x] 1.1. Создать `src/hooks/queries/useAdminTeamQueries.ts`
  - ✅ Добавить query keys
  - ✅ Добавить `useAdminTeamListQuery`
  - ✅ Добавить `useAdminTeamDetailQuery`
  - ✅ Добавить `useCreateTeamMemberMutation`
  - ✅ Добавить `useUpdateTeamMemberMutation`
  - ✅ Добавить `useDeleteTeamMemberMutation`
  - ✅ Добавить `useActivateTeamMemberMutation`
  - ✅ Добавить `useDeactivateTeamMemberMutation`

- [x] 1.2. Экспортировать в `src/hooks/queries/index.ts`

### Фаза 2: Custom Hook для TeamMemberForm ✅ ГОТОВО
**Приоритет: ВЫСОКИЙ** | Время: 45 минут

- [x] 2.1. Создать `src/hooks/useTeamMemberForm.ts`
  - ✅ Перенести state management (formData, isLoading, imagePreview)
  - ✅ Перенести useEffect синхронизацию
  - ✅ Перенести handleSubmit логику
  - ✅ Перенести updateTranslation функцию
  - ✅ Перенести валидацию
  - ✅ Использовать `useCreateTeamMemberMutation` / `useUpdateTeamMemberMutation`

- [x] 2.2. Рефакторить `TeamMemberForm.tsx`
  - ✅ Использовать `useTeamMemberForm` hook
  - ✅ Оставить только UI код
  - ✅ Результат: ~280 строк (было 430)

### Фаза 3: ImageUpload рефакторинг
**Приоритет: СРЕДНИЙ** | Время: 20 минут

- [ ] 3.1. Создать `src/hooks/useImageUpload.ts`
  - Использовать `filesService` вместо fetch
  - Добавить логику превью
  - Добавить обработку ошибок

- [ ] 3.2. Обновить `src/components/ui/ImageUpload.tsx`
  - Использовать новый hook

### Фаза 4: Рефакторинг других страниц (Team) ✅ ГОТОВО
**Приоритет: СРЕДНИЙ** | Время: 30 минут

- [x] 4.1. `src/app/dashboard/team/page.tsx`
  - ✅ Заменить прямые вызовы на React Query hooks
  - ✅ Использовать `useAdminTeamListQuery`
  - ✅ Использовать `useDeleteTeamMemberMutation`
  - ✅ Использовать `useActivateTeamMemberMutation` / `useDeactivateTeamMemberMutation`

- [x] 4.2. `src/app/dashboard/team/[id]/page.tsx`
  - ✅ Использовать `useAdminTeamDetailQuery`
  - ✅ Убрать useState и useEffect

- [x] 4.3. `src/app/dashboard/team/new/page.tsx`
  - ✅ Уже использует `TeamMemberForm` - автоматически улучшилось

### Фаза 5: Utility Hooks (общие)
**Приоритет: НИЗКИЙ** | Время: 30 минут

- [ ] 5.1. Создать `src/hooks/useMultilingualForm.ts`
  - Общая логика для мультиязычных форм
  - Нормализация языков (az, en, ru)
  - updateTranslation helper

- [ ] 5.2. Создать `src/lib/utils/validation.ts`
  - Функции валидации форм
  - Вынести из компонентов

### Фаза 6: Применить к остальным формам (опционально)
**Приоритет: НИЗКИЙ** | Время: 2-3 часа

- [ ] 6.1. News форма
- [ ] 6.2. Careers форма
- [ ] 6.3. Services форма
- [ ] 6.4. Contacts форма

---

## 🎯 НАЧНЕМ С ФАЗЫ 1 и 2

Это даст максимальную пользу для Team форм и покажет паттерн для остальных.

### Ожидаемый результат:
```typescript
// БЫЛО (TeamMemberForm.tsx - 430 строк):
export default function TeamMemberForm({ initialData, isEdit }) {
  const [formData, setFormData] = useState(...); // 50 строк state
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async () => {
    // 30 строк логики
    const response = await fetch(...); // прямой fetch
  };
  
  const updateTranslation = () => { /* логика */ };
  
  return <form>...</form>; // 300 строк UI
}

// СТАНЕТ (TeamMemberForm.tsx - ~180 строк):
export default function TeamMemberForm({ initialData, isEdit }) {
  const { 
    formData, 
    isLoading, 
    handleSubmit, 
    updateTranslation 
  } = useTeamMemberForm(initialData, isEdit);
  
  return <form>...</form>; // только UI
}

// Логика в hooks/useTeamMemberForm.ts (~150 строк)
export function useTeamMemberForm(initialData, isEdit) {
  const createMutation = useCreateTeamMemberMutation();
  const updateMutation = useUpdateTeamMemberMutation();
  // вся логика здесь
  return { formData, isLoading, handleSubmit, updateTranslation };
}
```

---

## ⏱️ ОБЩЕЕ ВРЕМЯ: ~3 часа

- Фаза 1: 30 мин
- Фаза 2: 45 мин
- Фаза 3: 20 мин
- Фаза 4: 30 мин
- Фаза 5: 30 мин
- **ИТОГО**: ~2.5 часа для критичных частей

---

## 📊 МЕТРИКИ УСПЕХА

### До рефакторинга:
- TeamMemberForm: **430 строк**
- Прямые fetch вызовы: **4+ места**
- Дублирование логики: **высокое**
- Тестируемость: **низкая**

### После рефакторинга:
- TeamMemberForm: **~180 строк** (UI only)
- useTeamMemberForm: **~150 строк** (логика)
- useAdminTeamQueries: **~120 строк** (API)
- Прямые fetch вызовы: **0**
- Дублирование логики: **минимальное**
- Тестируемость: **высокая**

---

## 🚀 ГОТОВ НАЧИНАТЬ?

Предлагаю начать с **Фазы 1 + Фазы 2** прямо сейчас.
Это займет ~1.5 часа и сразу улучшит Team формы.

После этого можешь решить продолжать или остановиться.
