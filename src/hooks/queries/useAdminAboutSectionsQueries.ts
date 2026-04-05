import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAboutSectionsService } from '@/lib/api';
import type { CreateAboutSectionRequest, UpdateAboutSectionRequest } from '@/types/api';

export const adminAboutSectionsKeys = {
  all: ['admin', 'about-sections'] as const,
  lists: () => [...adminAboutSectionsKeys.all, 'list'] as const,
  detail: (id: number) => [...adminAboutSectionsKeys.all, 'detail', id] as const,
};

export function useAdminAboutSectionsQuery() {
  return useQuery({
    queryKey: adminAboutSectionsKeys.lists(),
    queryFn: () => adminAboutSectionsService.getAll(),
  });
}

export function useAdminAboutSectionDetailQuery(id: number) {
  return useQuery({
    queryKey: adminAboutSectionsKeys.detail(id),
    queryFn: () => adminAboutSectionsService.getById(id),
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
  });
}

export function useCreateAboutSectionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAboutSectionRequest) => adminAboutSectionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminAboutSectionsKeys.lists() });
    },
  });
}

export function useUpdateAboutSectionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAboutSectionRequest }) =>
      adminAboutSectionsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminAboutSectionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminAboutSectionsKeys.detail(id) });
    },
  });
}

export function useDeleteAboutSectionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminAboutSectionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminAboutSectionsKeys.lists() });
    },
  });
}

export function useReorderAboutSectionsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: number[]) => adminAboutSectionsService.reorder(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminAboutSectionsKeys.lists() });
    },
  });
}
