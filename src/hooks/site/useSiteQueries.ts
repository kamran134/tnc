import { useQuery } from '@tanstack/react-query';
import { teamService } from '@/lib/api';
import type { AboutSectionUserDto, LanguageCode } from '@/types/api';

// Read-only query hooks used by the public site pages.

export const siteQueryKeys = {
  team: (lang: LanguageCode) => ['site', 'team', lang] as const,
  teamMember: (id: number, lang: LanguageCode) => ['site', 'team', id, lang] as const,
  about: (lang: LanguageCode) => ['site', 'about-content', lang] as const,
};

export function useTeamList(lang: LanguageCode) {
  return useQuery({
    queryKey: siteQueryKeys.team(lang),
    queryFn: () => teamService.getAll(lang),
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useTeamMemberQuery(id: number, lang: LanguageCode) {
  return useQuery({
    queryKey: siteQueryKeys.teamMember(id, lang),
    queryFn: () => teamService.getById(id, lang),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useAboutSections(lang: LanguageCode) {
  return useQuery({
    queryKey: siteQueryKeys.about(lang),
    queryFn: async (): Promise<AboutSectionUserDto[]> => {
      const res = await fetch(`/api/about-content?lang=${lang}`);
      if (!res.ok) throw new Error('Failed to load about content');
      const data = await res.json();
      return data.sections || [];
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
