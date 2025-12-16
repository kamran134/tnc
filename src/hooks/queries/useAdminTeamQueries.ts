import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminTeamService } from '@/lib/api';
import type { TeamMemberAdminDto } from '@/types/api';

// Admin Team Query Keys
export const adminTeamKeys = {
  all: ['admin', 'team'] as const,
  lists: () => [...adminTeamKeys.all, 'list'] as const,
  list: (params?: { page?: number; size?: number; sort?: string }) =>
    [...adminTeamKeys.lists(), params] as const,
  details: () => [...adminTeamKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...adminTeamKeys.details(), id] as const,
};

// Admin Team List Query (paginated)
export function useAdminTeamListQuery(params?: {
  page?: number;
  size?: number;
  sort?: string;
}) {
  return useQuery({
    queryKey: adminTeamKeys.list(params),
    queryFn: () => adminTeamService.getAll(params),
  });
}

// Admin Team List Query (all as array)
export function useAdminTeamListAllQuery() {
  return useQuery({
    queryKey: [...adminTeamKeys.lists(), 'all'],
    queryFn: () => adminTeamService.getAllAsList(),
  });
}

// Admin Team Detail Query
export function useAdminTeamDetailQuery(id: string | number) {
  return useQuery({
    queryKey: adminTeamKeys.detail(id),
    queryFn: () => adminTeamService.getById(Number(id)),
    enabled: !!id,
  });
}

// Create Team Member Mutation
export function useCreateTeamMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TeamMemberAdminDto) => adminTeamService.create(data),
    onSuccess: () => {
      // Invalidate all team lists
      queryClient.invalidateQueries({ queryKey: adminTeamKeys.lists() });
    },
  });
}

// Update Team Member Mutation
export function useUpdateTeamMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TeamMemberAdminDto }) =>
      adminTeamService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate lists and specific detail
      queryClient.invalidateQueries({ queryKey: adminTeamKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminTeamKeys.detail(variables.id) });
    },
  });
}

// Delete Team Member Mutation
export function useDeleteTeamMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminTeamService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTeamKeys.lists() });
    },
  });
}

// Activate Team Member Mutation
export function useActivateTeamMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminTeamService.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTeamKeys.lists() });
    },
  });
}

// Deactivate Team Member Mutation
export function useDeactivateTeamMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminTeamService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTeamKeys.lists() });
    },
  });
}

// Reorder Team Members Mutation
export function useReorderTeamMembersMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => adminTeamService.reorder(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTeamKeys.lists() });
    },
  });
}
