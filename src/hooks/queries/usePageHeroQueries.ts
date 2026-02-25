import { useQuery } from '@tanstack/react-query';
import { pageHeroService } from '@/lib/api';
import type { LanguageCode, PageTag } from '@/types/api';

// Page Hero Query Keys
export const pageHeroKeys = {
  all: ['page-hero'] as const,
  byTag: () => [...pageHeroKeys.all, 'tag'] as const,
  tag: (page: PageTag, lang: LanguageCode) =>
    [...pageHeroKeys.byTag(), page, lang] as const,
};

/** Fetches all active hero slides for a given page tag in the specified language. */
export function usePageHeroQuery(page: PageTag, lang: LanguageCode) {
  return useQuery({
    queryKey: pageHeroKeys.tag(page, lang),
    queryFn: () => pageHeroService.getByTag(page, lang),
    enabled: !!page && !!lang,
    staleTime: 5 * 60 * 1000, // 5 min — hero content changes rarely
  });
}
