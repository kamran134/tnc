import apiClient, { handleApiError } from './client';
import {
  HomeContentDto,
  CoreValueDto,
  MembershipDto,
  CompanyInfoDto,
  LanguageCode,
} from '@/types/api';

export const homeService = {
  // Get home page content
  async getHomeContent(lang: LanguageCode = 'az'): Promise<HomeContentDto> {
    try {
      const response = await apiClient.get<HomeContentDto>('/api/home-content', {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export const coreValuesService = {
  // Get all active core values
  async getAll(lang: LanguageCode = 'az'): Promise<CoreValueDto[]> {
    try {
      const response = await apiClient.get<CoreValueDto[]>('/api/core-values', {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export const membershipsService = {
  // Get all active memberships
  async getAll(lang: LanguageCode = 'az'): Promise<MembershipDto[]> {
    try {
      const response = await apiClient.get<MembershipDto[]>('/api/memberships', {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export const companyInfoService = {
  // Get company information
  async get(lang: LanguageCode = 'az'): Promise<CompanyInfoDto> {
    try {
      const response = await apiClient.get<CompanyInfoDto>('/api/company-info', {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
