import { useQuery } from '@tanstack/react-query';
import type { DashboardDataDto } from '@/types/api';
import apiClient from '@/lib/api/client';

// Dashboard Stats Query Keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
};

// Dashboard Stats Query
export function useDashboardStatsQuery() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async (): Promise<DashboardDataDto> => {
      const { data } = await apiClient.get<DashboardDataDto>('/admin/dashboard/statistics');
      return data;
    },
  });
}
