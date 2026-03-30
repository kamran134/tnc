import apiClient, { handleApiError } from './client';
import {
  NewsDto,
  PageNewsDto,
  LanguageCode,
} from '@/types/api';

export const newsService = {
  // Get all published news with pagination and filters
  async getAll(params?: {
    lang?: LanguageCode;
    page?: number;
    size?: number;
    sort?: string;
    category?: string;
    author?: string;
    title?: string;
    content?: string;
    tags?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PageNewsDto> {
    try {
      const response = await apiClient.get<PageNewsDto>('/news', {
        params: {
          lang: params?.lang || 'az',
          page: params?.page || 0,
          size: params?.size || 10,
          sort: params?.sort || 'publishDate,desc',
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get news by slug
  async getBySlug(slug: string, lang: LanguageCode = 'az'): Promise<NewsDto> {
    try {
      const response = await apiClient.get<NewsDto>(`/news/${slug}`, {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get news by ID (used for cross-language slug resolution)
  async getById(id: number, lang: LanguageCode = 'az'): Promise<NewsDto> {
    try {
      const response = await apiClient.get<NewsDto>(`/news/id/${id}`, {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
