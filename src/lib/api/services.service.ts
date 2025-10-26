import apiClient, { handleApiError } from './client';
import {
  ServiceDto,
  LanguageCode,
} from '@/types/api';

export const servicesService = {
  // Get all active services
  async getAll(lang: LanguageCode = 'az'): Promise<ServiceDto[]> {
    try {
      const response = await apiClient.get<ServiceDto[]>('/api/services', {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get services by category
  async getByCategory(category: string, lang: LanguageCode = 'az'): Promise<ServiceDto[]> {
    try {
      const response = await apiClient.get<ServiceDto[]>(`/api/services/category/${category}`, {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get all service categories
  async getCategories(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>('/api/services/categories');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
