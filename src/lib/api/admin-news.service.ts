import apiClient, { handleApiError } from './client';
import {
  NewsAdminDto,
  PageNewsAdminDto,
} from '@/types/api';

export const adminNewsService = {
  // Get all news for admin with pagination and filters
  async getAll(params?: {
    page?: number;
    size?: number;
    sort?: string;
    category?: string;
    author?: string;
    published?: boolean;
    title?: string;
    content?: string;
    tags?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PageNewsAdminDto> {
    try {
      const response = await apiClient.get<PageNewsAdminDto>('/admin/news', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get news by ID for admin
  async getById(id: number): Promise<NewsAdminDto> {
    try {
      const response = await apiClient.get<NewsAdminDto>(`/admin/news/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create new news
  async create(news: NewsAdminDto): Promise<NewsAdminDto> {
    try {
      const response = await apiClient.post<NewsAdminDto>('/admin/news', news);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update news
  async update(id: number, news: NewsAdminDto): Promise<NewsAdminDto> {
    try {
      const response = await apiClient.put<NewsAdminDto>(`/admin/news/${id}`, news);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete news (soft delete)
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/admin/news/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Publish news
  async publish(id: number): Promise<void> {
    try {
      await apiClient.patch(`/api/admin/news/${id}/publish`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Unpublish news
  async unpublish(id: number): Promise<void> {
    try {
      await apiClient.patch(`/api/admin/news/${id}/unpublish`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
