import apiClient, { handleApiError } from './client';
import {
  MembershipAdminDto,
  PageMembershipAdminDto,
  CoreValueAdminDto,
  PageCoreValueAdminDto,
  HomeContentAdminDto,
  CompanyInfoAdminDto,
} from '@/types/api';

// Memberships Service
export const adminMembershipsService = {
  async getAll(params?: {
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PageMembershipAdminDto> {
    try {
      const response = await apiClient.get<PageMembershipAdminDto>('/api/admin/memberships', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getAllAsList(): Promise<MembershipAdminDto[]> {
    try {
      const response = await apiClient.get<MembershipAdminDto[]>('/api/admin/memberships/list');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getById(id: number): Promise<MembershipAdminDto> {
    try {
      const response = await apiClient.get<MembershipAdminDto>(`/api/admin/memberships/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async create(membership: MembershipAdminDto): Promise<MembershipAdminDto> {
    try {
      const response = await apiClient.post<MembershipAdminDto>('/api/admin/memberships', membership);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(id: number, membership: MembershipAdminDto): Promise<MembershipAdminDto> {
    try {
      const response = await apiClient.put<MembershipAdminDto>(`/api/admin/memberships/${id}`, membership);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/admin/memberships/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async activate(id: number): Promise<void> {
    try {
      await apiClient.patch(`/api/admin/memberships/${id}/activate`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async deactivate(id: number): Promise<void> {
    try {
      await apiClient.patch(`/api/admin/memberships/${id}/deactivate`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async reorder(ids: number[]): Promise<void> {
    try {
      await apiClient.post('/api/admin/memberships/reorder', ids);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Core Values Service
export const adminCoreValuesService = {
  async getAll(params?: {
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PageCoreValueAdminDto> {
    try {
      const response = await apiClient.get<PageCoreValueAdminDto>('/api/admin/core-values', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getAllAsList(): Promise<CoreValueAdminDto[]> {
    try {
      const response = await apiClient.get<CoreValueAdminDto[]>('/api/admin/core-values/list');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getById(id: number): Promise<CoreValueAdminDto> {
    try {
      const response = await apiClient.get<CoreValueAdminDto>(`/api/admin/core-values/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async create(coreValue: CoreValueAdminDto): Promise<CoreValueAdminDto> {
    try {
      const response = await apiClient.post<CoreValueAdminDto>('/api/admin/core-values', coreValue);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(id: number, coreValue: CoreValueAdminDto): Promise<CoreValueAdminDto> {
    try {
      const response = await apiClient.put<CoreValueAdminDto>(`/api/admin/core-values/${id}`, coreValue);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/admin/core-values/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async activate(id: number): Promise<void> {
    try {
      await apiClient.patch(`/api/admin/core-values/${id}/activate`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async deactivate(id: number): Promise<void> {
    try {
      await apiClient.patch(`/api/admin/core-values/${id}/deactivate`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async reorder(ids: number[]): Promise<void> {
    try {
      await apiClient.post('/api/admin/core-values/reorder', ids);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Home Content Service
export const adminHomeContentService = {
  async get(): Promise<HomeContentAdminDto> {
    try {
      const response = await apiClient.get<HomeContentAdminDto>('/api/admin/home-content');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async create(homeContent: HomeContentAdminDto): Promise<HomeContentAdminDto> {
    try {
      const response = await apiClient.post<HomeContentAdminDto>('/api/admin/home-content', homeContent);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(homeContent: HomeContentAdminDto): Promise<HomeContentAdminDto> {
    try {
      const response = await apiClient.put<HomeContentAdminDto>('/api/admin/home-content', homeContent);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete(): Promise<void> {
    try {
      await apiClient.delete('/api/admin/home-content');
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Company Info Service
export const adminCompanyInfoService = {
  async get(): Promise<CompanyInfoAdminDto> {
    try {
      const response = await apiClient.get<CompanyInfoAdminDto>('/api/admin/company-info');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async create(companyInfo: CompanyInfoAdminDto): Promise<CompanyInfoAdminDto> {
    try {
      const response = await apiClient.post<CompanyInfoAdminDto>('/api/admin/company-info', companyInfo);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(companyInfo: CompanyInfoAdminDto): Promise<CompanyInfoAdminDto> {
    try {
      const response = await apiClient.put<CompanyInfoAdminDto>('/api/admin/company-info', companyInfo);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete(): Promise<void> {
    try {
      await apiClient.delete('/api/admin/company-info');
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
