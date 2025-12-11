import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsService } from '@/lib/api';
import type { LanguageCode, NewsDto } from '@/types/api';

// Query Keys для кэширования
export const newsKeys = {
  all: ['news'] as const,
  lists: () => [...newsKeys.all, 'list'] as const,
  list: (filters: { lang?: LanguageCode; page?: number; size?: number }) => 
    [...newsKeys.lists(), filters] as const,
  details: () => [...newsKeys.all, 'detail'] as const,
  detail: (slug: string, lang: LanguageCode) => 
    [...newsKeys.details(), slug, lang] as const,
};

// Публичные query хуки
export function useNewsListQuery(params: {
  lang: LanguageCode;
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: newsKeys.list(params),
    queryFn: () => newsService.getAll(params),
  });
}

export function useNewsBySlugQuery(slug: string, lang: LanguageCode) {
  return useQuery({
    queryKey: newsKeys.detail(slug, lang),
    queryFn: () => newsService.getBySlug(slug, lang),
    enabled: !!slug && !!lang,
  });
}
