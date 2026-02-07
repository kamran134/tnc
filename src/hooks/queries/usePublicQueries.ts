import { useQuery } from '@tanstack/react-query';
import { companyInfoService } from '@/lib/api';
import { LanguageCode } from '@/types/api';

// Query keys for public data
export const publicQueryKeys = {
  companyInfo: (lang: LanguageCode) => ['public', 'company-info', lang] as const,
};

/**
 * Hook for fetching company info on public pages
 * - Caches data for 2 minutes to avoid repeated requests
 * - Returns null on 404 (data doesn't exist yet)
 * - Shared across all components on the page
 * - refetchOnMount disabled: prevents SSR spam (data rarely changes)
 */
export function useCompanyInfo(lang: LanguageCode = 'az') {
  return useQuery({
    queryKey: publicQueryKeys.companyInfo(lang),
    queryFn: async () => {
      try {
        return await companyInfoService.getCompanyInfo(lang);
      } catch (error: any) {
        // If 404, company info doesn't exist yet - return null
        if (error.status === 404 || error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - company info rarely changes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: false, // Don't retry on error
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    refetchOnMount: false, // CRITICAL: prevent SSR request spam on every page render
  });
}
