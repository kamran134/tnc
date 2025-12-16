import apiClient, { handleApiError } from './client';
import {
  TeamMemberAdminDto,
  PageTeamMemberAdminDto,
} from '@/types/api';

export const adminTeamService = {
  async getAll(params?: {
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PageTeamMemberAdminDto> {
    try {
      const response = await apiClient.get<PageTeamMemberAdminDto>('/admin/team', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getAllAsList(): Promise<TeamMemberAdminDto[]> {
    try {
      const response = await apiClient.get<TeamMemberAdminDto[]>('/admin/team/list');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getById(id: number): Promise<TeamMemberAdminDto> {
    try {
      const response = await apiClient.get<TeamMemberAdminDto>(`/admin/team/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async create(teamMember: TeamMemberAdminDto): Promise<TeamMemberAdminDto> {
    try {
      const response = await apiClient.post<TeamMemberAdminDto>('/admin/team', teamMember);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(id: number, teamMember: TeamMemberAdminDto): Promise<TeamMemberAdminDto> {
    try {
      const response = await apiClient.put<TeamMemberAdminDto>(`/admin/team/${id}`, teamMember);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/admin/team/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async activate(id: number): Promise<void> {
    try {
      await apiClient.patch(`/admin/team/${id}/activate`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async deactivate(id: number): Promise<void> {
    try {
      await apiClient.patch(`/admin/team/${id}/deactivate`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async reorder(ids: number[]): Promise<void> {
    try {
      await apiClient.post('/admin/team/reorder', ids);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
