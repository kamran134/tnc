import apiClient, { handleApiError } from './client';
import {
  CareerDto,
  PageCareerDto,
  PageString,
  LanguageCode,
} from '@/types/api';

export const careersService = {
  // Get all active careers with pagination and filters
  async getAll(params?: {
    lang?: LanguageCode;
    page?: number;
    size?: number;
    sort?: string;
    location?: string;
    employmentType?: string;
    title?: string;
    content?: string;
    requirements?: string;
    salaryRange?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PageCareerDto> {
    try {
      const response = await apiClient.get<PageCareerDto>('/careers', {
        params: {
          lang: params?.lang || 'az',
          page: params?.page || 0,
          size: params?.size || 10,
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get career by slug
  async getBySlug(slug: string, lang: LanguageCode = 'az'): Promise<CareerDto> {
    try {
      const response = await apiClient.get<CareerDto>(`/careers/${slug}`, {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get career by ID (used for cross-language slug resolution)
  async getById(id: number, lang: LanguageCode = 'az'): Promise<CareerDto> {
    try {
      const response = await apiClient.get<CareerDto>(`/careers/id/${id}`, {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get available career locations
  async getLocations(page: number = 0, size: number = 50): Promise<PageString> {
    try {
      const response = await apiClient.get<PageString>('/careers/locations', {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get available employment types
  async getEmploymentTypes(page: number = 0, size: number = 50): Promise<PageString> {
    try {
      const response = await apiClient.get<PageString>('/careers/employment-types', {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
