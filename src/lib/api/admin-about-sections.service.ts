import apiClient, { handleApiError } from './client';
import { AboutSectionAdminDto, CreateAboutSectionRequest, UpdateAboutSectionRequest } from '@/types/api';

export const adminAboutSectionsService = {
  async getAll(): Promise<AboutSectionAdminDto[]> {
    try {
      const response = await apiClient.get<AboutSectionAdminDto[]>('/admin/about-sections');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getById(id: number): Promise<AboutSectionAdminDto> {
    try {
      const response = await apiClient.get<AboutSectionAdminDto>(`/admin/about-sections/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async create(data: CreateAboutSectionRequest): Promise<AboutSectionAdminDto> {
    try {
      const response = await apiClient.post<AboutSectionAdminDto>('/admin/about-sections', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(id: number, data: UpdateAboutSectionRequest): Promise<AboutSectionAdminDto> {
    try {
      const response = await apiClient.put<AboutSectionAdminDto>(`/admin/about-sections/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/admin/about-sections/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async reorder(ids: number[]): Promise<void> {
    try {
      await apiClient.post('/admin/about-sections/reorder', ids);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
