import { useQuery } from '@tanstack/react-query';
import { servicesService } from '@/lib/api';
import type { LanguageCode } from '@/types/api';

// Query Keys
export const servicesKeys = {
  all: ['services'] as const,
  lists: () => [...servicesKeys.all, 'list'] as const,
  list: (lang: LanguageCode) => [...servicesKeys.lists(), lang] as const,
};

// Публичные query хуки
export function useServicesListQuery(lang: LanguageCode) {
  return useQuery({
    queryKey: servicesKeys.list(lang),
    queryFn: () => servicesService.getAll(lang),
  });
}
