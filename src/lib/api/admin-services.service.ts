import apiClient, { handleApiError } from './client';
import {
  ServiceAdminDto,
  PageServiceAdminDto,
} from '@/types/api';

export const adminServicesService = {
  // Get all services for admin with pagination
  async getAll(params?: {
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PageServiceAdminDto> {
    try {
      console.log('🔍 Fetching services with params:', params);
      const response = await apiClient.get<PageServiceAdminDto>('/admin/services', { params });
      console.log('📦 Services response data:', response.data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get all services as list for admin
  async getAllAsList(): Promise<ServiceAdminDto[]> {
    try {
      const response = await apiClient.get<ServiceAdminDto[]>('/admin/services/list');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get service by ID for admin
  async getById(id: number): Promise<ServiceAdminDto> {
    try {
      const response = await apiClient.get<ServiceAdminDto>(`/admin/services/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create new service
  async create(service: ServiceAdminDto): Promise<ServiceAdminDto> {
    try {
      const response = await apiClient.post<ServiceAdminDto>('/admin/services', service);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update service
  async update(id: number, service: ServiceAdminDto): Promise<ServiceAdminDto> {
    try {
      const response = await apiClient.put<ServiceAdminDto>(`/admin/services/${id}`, service);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete service (soft delete)
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/admin/services/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Activate service
  async activate(id: number): Promise<void> {
    try {
      await apiClient.patch(`/admin/services/${id}/activate`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Deactivate service
  async deactivate(id: number): Promise<void> {
    try {
      await apiClient.patch(`/admin/services/${id}/deactivate`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Reorder services
  async reorder(ids: number[]): Promise<void> {
    try {
      await apiClient.post('/admin/services/reorder', ids);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
