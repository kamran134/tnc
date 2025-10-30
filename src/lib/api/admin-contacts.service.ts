import apiClient, { handleApiError } from './client';
import {
  ContactAdminDto,
  PageContactAdminDto,
  ContactStatus,
} from '@/types/api';

export const adminContactsService = {
  // Get all contacts for admin with pagination and filters
  async getAll(params?: {
    page?: number;
    size?: number;
    sort?: string;
    name?: string;
    email?: string;
    company?: string;
    subject?: string;
    message?: string;
    status?: ContactStatus;
    startDate?: string;
    endDate?: string;
  }): Promise<PageContactAdminDto> {
    try {
      const response = await apiClient.get<PageContactAdminDto>('/admin/contacts', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get contact by ID for admin
  async getById(id: number): Promise<ContactAdminDto> {
    try {
      const response = await apiClient.get<ContactAdminDto>(`/admin/contacts/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete contact (soft delete)
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/admin/contacts/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update contact status
  async updateStatus(id: number, status: ContactStatus): Promise<ContactAdminDto> {
    try {
      const response = await apiClient.patch<ContactAdminDto>(
        `/admin/contacts/${id}/status`,
        null,
        { params: { status } }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Mark contact as replied
  async markAsReplied(id: number): Promise<ContactAdminDto> {
    try {
      const response = await apiClient.patch<ContactAdminDto>(`/admin/contacts/${id}/reply`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Add admin notes to contact
  async addAdminNotes(id: number, notes: string): Promise<ContactAdminDto> {
    try {
      const response = await apiClient.patch<ContactAdminDto>(
        `/admin/contacts/${id}/notes`,
        notes,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get contact count by status
  async getCountByStatus(status: ContactStatus): Promise<number> {
    try {
      const response = await apiClient.get<number>('/admin/contacts/stats/count-by-status', {
        params: { status },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get contact count since date
  async getCountSince(since: string): Promise<number> {
    try {
      const response = await apiClient.get<number>('/admin/contacts/stats/count-since', {
        params: { since },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
