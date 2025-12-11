import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { careersService } from '@/lib/api';
import type { LanguageCode } from '@/types/api';

// Query Keys
export const careersKeys = {
  all: ['careers'] as const,
  lists: () => [...careersKeys.all, 'list'] as const,
  list: (lang: LanguageCode) => [...careersKeys.lists(), lang] as const,
  details: () => [...careersKeys.all, 'detail'] as const,
  detail: (slug: string, lang: LanguageCode) => 
    [...careersKeys.details(), slug, lang] as const,
};

// Публичные query хуки
export function useCareersListQuery(lang: LanguageCode) {
  return useQuery({
    queryKey: careersKeys.list(lang),
    queryFn: () => careersService.getAll({ lang }),
  });
}

export function useCareerBySlugQuery(slug: string, lang: LanguageCode) {
  return useQuery({
    queryKey: careersKeys.detail(slug, lang),
    queryFn: () => careersService.getBySlug(slug, lang),
    enabled: !!slug && !!lang,
  });
}
