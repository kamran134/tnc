import apiClient, { handleApiError } from './client';
import {
  ServiceCategoryAdminDto,
  ServiceCategoryUserDto,
  PageServiceCategoryAdminDto,
} from '@/types/api';

export const adminServiceCategoriesService = {
  // Get all categories for admin with pagination
  async getAll(params?: {
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PageServiceCategoryAdminDto> {
    try {
      const response = await apiClient.get<PageServiceCategoryAdminDto>('/admin/service-categories', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get all categories as list for admin
  async getAllAsList(): Promise<ServiceCategoryAdminDto[]> {
    try {
      const response = await apiClient.get<ServiceCategoryAdminDto[]>('/admin/service-categories/list');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get category by ID for admin
  async getById(id: number): Promise<ServiceCategoryAdminDto> {
    try {
      const response = await apiClient.get<ServiceCategoryAdminDto>(`/admin/service-categories/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create new category
  async create(category: Omit<ServiceCategoryAdminDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceCategoryAdminDto> {
    try {
      const response = await apiClient.post<ServiceCategoryAdminDto>('/admin/service-categories', category);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update category
  async update(id: number, category: Omit<ServiceCategoryAdminDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceCategoryAdminDto> {
    try {
      const response = await apiClient.put<ServiceCategoryAdminDto>(`/admin/service-categories/${id}`, category);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete category
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/admin/service-categories/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Reorder categories
  async reorder(ids: number[]): Promise<void> {
    try {
      await apiClient.post('/admin/service-categories/reorder', ids);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Public API для категорий
export const serviceCategoriesService = {
  // Get all active categories for public
  async getAll(lang: string = 'az'): Promise<ServiceCategoryUserDto[]> {
    try {
      const response = await apiClient.get<ServiceCategoryUserDto[]>('/service-categories', {
        params: { lang }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get category by code for public
  async getByCode(code: string, lang: string = 'az'): Promise<ServiceCategoryUserDto> {
    try {
      const response = await apiClient.get<ServiceCategoryUserDto>(`/service-categories/${code}`, {
        params: { lang }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
