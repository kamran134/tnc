import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminPageHeroService } from '@/lib/api';
import type { PageTag } from '@/types/api';

// Admin Page Hero Query Keys
export const adminPageHeroKeys = {
  all: ['admin', 'page-hero'] as const,
  lists: () => [...adminPageHeroKeys.all, 'list'] as const,
  list: () => [...adminPageHeroKeys.lists()] as const,
  details: () => [...adminPageHeroKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...adminPageHeroKeys.details(), id] as const,
  byTag: (tag: PageTag) => [...adminPageHeroKeys.all, 'tag', tag] as const,
};

// Admin Page Hero List Query
export function useAdminPageHeroListQuery() {
  return useQuery({
    queryKey: adminPageHeroKeys.list(),
    queryFn: () => adminPageHeroService.getAll(),
  });
}

// Admin Page Hero Detail Query
export function useAdminPageHeroDetailQuery(id: string | number) {
  return useQuery({
    queryKey: adminPageHeroKeys.detail(id),
    queryFn: () => adminPageHeroService.getById(Number(id)),
    enabled: !!id,
  });
}

// Admin Page Hero by Tag Query
export function useAdminPageHeroByTagQuery(tag: PageTag) {
  return useQuery({
    queryKey: adminPageHeroKeys.byTag(tag),
    queryFn: () => adminPageHeroService.getByTag(tag),
    enabled: !!tag,
  });
}

// Admin Page Hero Mutations
export function useActivatePageHeroMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminPageHeroService.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminPageHeroKeys.lists() });
    },
  });
}

export function useDeactivatePageHeroMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminPageHeroService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminPageHeroKeys.lists() });
    },
  });
}

export function useUpdatePageHeroMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      adminPageHeroService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminPageHeroKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminPageHeroKeys.detail(variables.id) });
    },
  });
}

export function useCreatePageHeroMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => adminPageHeroService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminPageHeroKeys.lists() });
    },
  });
}
