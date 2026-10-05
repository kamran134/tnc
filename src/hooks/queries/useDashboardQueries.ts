import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { AnalyticsDto, DashboardDataDto, TrafficAnalyticsDto } from '@/types/api';
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

export function useTrafficQuery(days: number) {
  return useQuery({
    queryKey: [...dashboardKeys.all, 'traffic', days] as const,
    queryFn: async (): Promise<TrafficAnalyticsDto> => {
      const { data } = await apiClient.get<TrafficAnalyticsDto>('/admin/dashboard/traffic', { params: { days } });
      return data;
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
    placeholderData: keepPreviousData,
  });
}
