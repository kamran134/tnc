import apiClient, { handleApiError } from './client';
import { TeamMemberDto, LanguageCode } from '@/types/api';

export const teamService = {
  // Get all active team members
  async getAll(lang: LanguageCode = 'az'): Promise<TeamMemberDto[]> {
    try {
      const response = await apiClient.get<TeamMemberDto[]>('/team', {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get team member by ID
  async getById(id: number, lang: LanguageCode = 'az'): Promise<TeamMemberDto> {
    try {
      const response = await apiClient.get<TeamMemberDto>(`/team/${id}`, {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
