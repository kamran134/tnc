import { useQuery } from '@tanstack/react-query';
import type { AnalyticsDto, DashboardDataDto } from '@/types/api';
import apiClient from '@/lib/api/client';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  analytics: () => [...dashboardKeys.all, 'analytics'] as const,
};

export function useDashboardStatsQuery() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async (): Promise<DashboardDataDto> => {
      const { data } = await apiClient.get<DashboardDataDto>('/admin/dashboard/statistics');
      return data;
    },
  });
}

export function useAnalyticsQuery() {
  return useQuery({
    queryKey: dashboardKeys.analytics(),
    queryFn: async (): Promise<AnalyticsDto> => {
      const { data } = await apiClient.get<AnalyticsDto>('/admin/dashboard/analytics');
      return data;
    },
  });
}
