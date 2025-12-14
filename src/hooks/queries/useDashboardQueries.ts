import { useQuery } from '@tanstack/react-query';
import type { DashboardDataDto } from '@/types/api';

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
      // Используем относительный URL - запрос пойдет через Next.js API route
      // который проксирует на бэкенд
      const response = await fetch('/api/admin/dashboard/statistics', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      return response.json();
    },
  });
}
