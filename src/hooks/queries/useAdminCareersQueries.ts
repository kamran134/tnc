import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCareersService } from '@/lib/api';
import type { CareerAdminDto } from '@/types/api';

// Admin Careers Query Keys
export const adminCareersKeys = {
  all: ['admin', 'careers'] as const,
  lists: () => [...adminCareersKeys.all, 'list'] as const,
  list: (params?: Record<string, any>) =>
    [...adminCareersKeys.lists(), params] as const,
  details: () => [...adminCareersKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...adminCareersKeys.details(), id] as const,
};

// Admin Careers List Query
export function useAdminCareersListQuery(params?: {
  page?: number;
  size?: number;
  title?: string;
  location?: string;
  employmentType?: string;
  active?: boolean;
}) {
  return useQuery({
    queryKey: adminCareersKeys.list(params),
    queryFn: () => adminCareersService.getAll(params),
  });
}

// Admin Career Detail Query
export function useAdminCareerDetailQuery(id: string | number) {
  return useQuery({
    queryKey: adminCareersKeys.detail(id),
    queryFn: () => adminCareersService.getById(Number(id)),
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
  });
}

// Admin Careers Mutations
export function useDeleteCareerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminCareersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCareersKeys.lists() });
    },
  });
}

export function useCreateCareerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => adminCareersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCareersKeys.lists() });
    },
  });
}

export function useUpdateCareerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      adminCareersService.update(id, data),
    onSuccess: (updatedCareer, variables) => {
      queryClient.setQueryData(adminCareersKeys.detail(variables.id), updatedCareer);
      queryClient.invalidateQueries({ queryKey: adminCareersKeys.lists() });
    },
  });
}

export function useActivateCareerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminCareersService.activate(id),
    onSuccess: (_, id) => {
      queryClient.setQueriesData<any>({ queryKey: adminCareersKeys.lists() }, (old: any) => {
        if (!old?.content) return old;
        return {
          ...old,
          content: old.content.map((career: any) =>
            career.id === id ? { ...career, active: true } : career
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: adminCareersKeys.detail(id) });
    },
  });
}

export function useDeactivateCareerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminCareersService.deactivate(id),
    onSuccess: (_, id) => {
      queryClient.setQueriesData<any>({ queryKey: adminCareersKeys.lists() }, (old: any) => {
        if (!old?.content) return old;
        return {
          ...old,
          content: old.content.map((career: any) =>
            career.id === id ? { ...career, active: false } : career
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: adminCareersKeys.detail(id) });
    },
  });
}
