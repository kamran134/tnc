import { useQuery } from '@tanstack/react-query';
import { adminContactsService } from '@/lib/api';
import type { ContactAdminDto } from '@/types/api';

// Admin Contacts Query Keys
export const adminContactsKeys = {
  all: ['admin', 'contacts'] as const,
  lists: () => [...adminContactsKeys.all, 'list'] as const,
  list: (params?: { page?: number; size?: number }) =>
    [...adminContactsKeys.lists(), params] as const,
};

// Admin Contacts List Query
export function useAdminContactsListQuery(params?: {
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: adminContactsKeys.list(params),
    queryFn: () => adminContactsService.getAll(params),
  });
}
