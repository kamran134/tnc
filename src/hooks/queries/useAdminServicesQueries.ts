import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminServicesService } from '@/lib/api';
import type { ServiceAdminDto } from '@/types/api';

// Admin Services Query Keys
export const adminServicesKeys = {
  all: ['admin', 'services'] as const,
  lists: () => [...adminServicesKeys.all, 'list'] as const,
  list: (params?: { page?: number; size?: number; sort?: string; title?: string; content?: string; categoryCode?: string; active?: boolean }) => [...adminServicesKeys.lists(), params] as const,
  details: () => [...adminServicesKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...adminServicesKeys.details(), id] as const,
};

// Admin Services List Query
export function useAdminServicesListQuery(params?: {
  page?: number;
  size?: number;
  sort?: string;
  title?: string;
  content?: string;
  categoryCode?: string;
  active?: boolean;
}) {
  return useQuery({
    queryKey: adminServicesKeys.list(params),
    queryFn: () => adminServicesService.getAll(params),
    placeholderData: (previousData) => previousData,
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

export function useToggleServiceActiveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, activate }: { id: number; activate: boolean }) => {
      const action = activate ? 'activate' : 'deactivate';
      const response = await fetch(`/api/admin/services/${id}/${action}`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error(`Failed to ${action} service`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminServicesKeys.lists() });
    },
  });
}
