import apiClient, { handleApiError } from './client';
import type { PageHeroUserDto, PageTag, LanguageCode } from '@/types/api';

export const pageHeroService = {
  /**
   * Get all active hero slides for a given page tag in the specified language.
   * For HOME this returns multiple slides ordered by sortOrder.
   */
  async getByTag(pageTag: PageTag, lang: LanguageCode = 'az'): Promise<PageHeroUserDto[]> {
    try {
      const response = await apiClient.get<PageHeroUserDto[]>(`/page-hero/${pageTag}`, {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
