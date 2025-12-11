import { useQuery } from '@tanstack/react-query';
import { adminPageHeroService } from '@/lib/api';
import type { LanguageCode, PageTag } from '@/types/api';

// Page Hero Query Keys
export const pageHeroKeys = {
  all: ['page-hero'] as const,
  details: () => [...pageHeroKeys.all, 'detail'] as const,
  detail: (page: PageTag, lang: LanguageCode) =>
    [...pageHeroKeys.details(), page, lang] as const,
};

// Page Hero Query
export function usePageHeroQuery(page: PageTag, lang: LanguageCode) {
  return useQuery({
    queryKey: pageHeroKeys.detail(page, lang),
    queryFn: () => adminPageHeroService.getByTag(page),
    enabled: !!page && !!lang,
  });
}
