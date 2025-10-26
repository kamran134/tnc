import apiClient, { handleApiError } from './client';
import {
  CareerAdminDto,
  PageCareerAdminDto,
} from '@/types/api';

export const adminCareersService = {
  // Get all careers for admin with pagination and filters
  async getAll(params?: {
    page?: number;
    size?: number;
    sort?: string;
    location?: string;
    employmentType?: string;
    active?: boolean;
    title?: string;
    content?: string;
    requirements?: string;
    salaryRange?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PageCareerAdminDto> {
    try {
      const response = await apiClient.get<PageCareerAdminDto>('/api/admin/careers', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get career by ID for admin
  async getById(id: number): Promise<CareerAdminDto> {
    try {
      const response = await apiClient.get<CareerAdminDto>(`/api/admin/careers/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create new career
  async create(career: CareerAdminDto): Promise<CareerAdminDto> {
    try {
      const response = await apiClient.post<CareerAdminDto>('/api/admin/careers', career);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update career
  async update(id: number, career: CareerAdminDto): Promise<CareerAdminDto> {
    try {
      const response = await apiClient.put<CareerAdminDto>(`/api/admin/careers/${id}`, career);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete career (soft delete)
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/admin/careers/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Activate career
  async activate(id: number): Promise<void> {
    try {
      await apiClient.patch(`/api/admin/careers/${id}/activate`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Deactivate career
  async deactivate(id: number): Promise<void> {
    try {
      await apiClient.patch(`/api/admin/careers/${id}/deactivate`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
