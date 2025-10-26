import apiClient, { handleApiError } from './client';
import { DashboardDataDto } from '@/types/api';

export const adminDashboardService = {
  // Get dashboard statistics
  async getStatistics(): Promise<DashboardDataDto> {
    try {
      const response = await apiClient.get<DashboardDataDto>('/api/admin/dashboard/statistics');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
