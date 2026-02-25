import apiClient, { handleApiError } from './client';
import { PageHeroAdminDto, CreatePageHeroRequest, UpdatePageHeroRequest, PageTag } from '@/types/api';

export const adminPageHeroService = {
  /**
   * Get all page heroes
   */
  async getAll(): Promise<PageHeroAdminDto[]> {
    try {
      const response = await apiClient.get<PageHeroAdminDto[]>('/admin/page-hero');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get page hero by ID
   */
  async getById(id: number): Promise<PageHeroAdminDto> {
    try {
      const response = await apiClient.get<PageHeroAdminDto>(`/admin/page-hero/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get all hero slides for a page tag (admin)
   */
  async getByTag(pageTag: PageTag): Promise<PageHeroAdminDto[]> {
    try {
      const response = await apiClient.get<PageHeroAdminDto[]>(`/admin/page-hero/tag/${pageTag}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create new page hero
   */
  async create(data: CreatePageHeroRequest): Promise<PageHeroAdminDto> {
    try {
      const response = await apiClient.post<PageHeroAdminDto>('/admin/page-hero', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update page hero
   */
  async update(id: number, data: UpdatePageHeroRequest): Promise<PageHeroAdminDto> {
    try {
      const response = await apiClient.put<PageHeroAdminDto>(`/admin/page-hero/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete page hero
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/admin/page-hero/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Activate page hero
   */
  async activate(id: number): Promise<void> {
    try {
      await apiClient.patch(`/admin/page-hero/${id}/activate`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Deactivate page hero
   */
  async deactivate(id: number): Promise<void> {
    try {
      await apiClient.patch(`/admin/page-hero/${id}/deactivate`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
