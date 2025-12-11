import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminServicesService } from '@/lib/api';
import type { ServiceAdminDto } from '@/types/api';

// Admin Services Query Keys
export const adminServicesKeys = {
  all: ['admin', 'services'] as const,
  lists: () => [...adminServicesKeys.all, 'list'] as const,
  list: () => [...adminServicesKeys.lists()] as const,
  details: () => [...adminServicesKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...adminServicesKeys.details(), id] as const,
};

// Admin Services List Query
export function useAdminServicesListQuery() {
  return useQuery({
    queryKey: adminServicesKeys.list(),
    queryFn: () => adminServicesService.getAll(),
  });
}

// Admin Service Detail Query
export function useAdminServiceDetailQuery(id: string | number) {
  return useQuery({
    queryKey: adminServicesKeys.detail(id),
    queryFn: () => adminServicesService.getById(Number(id)),
    enabled: !!id,
  });
}

// Admin Services Mutations
export function useDeleteServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminServicesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminServicesKeys.lists() });
    },
  });
}

export function useCreateServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => adminServicesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminServicesKeys.lists() });
    },
  });
}

export function useUpdateServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      adminServicesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminServicesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminServicesKeys.detail(variables.id) });
    },
  });
}
