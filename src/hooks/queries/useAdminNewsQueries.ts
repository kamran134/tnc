import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminNewsService } from '@/lib/api';
import type { NewsAdminDto } from '@/types/api';

// Admin Query Keys
export const adminNewsKeys = {
  all: ['admin', 'news'] as const,
  lists: () => [...adminNewsKeys.all, 'list'] as const,
  list: (params?: { page?: number; size?: number; published?: boolean }) =>
    [...adminNewsKeys.lists(), params] as const,
  details: () => [...adminNewsKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...adminNewsKeys.details(), id] as const,
};

// Admin News List Query
export function useAdminNewsListQuery(params?: {
  page?: number;
  size?: number;
  published?: boolean;
}) {
  return useQuery({
    queryKey: adminNewsKeys.list(params),
    queryFn: () => adminNewsService.getAll(params),
  });
}

// Admin News Detail Query
export function useAdminNewsDetailQuery(id: string | number) {
  return useQuery({
    queryKey: adminNewsKeys.detail(id),
    queryFn: () => adminNewsService.getById(Number(id)),
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
  });
}

// Admin News Mutations
export function usePublishNewsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminNewsService.publish(id),
    onSuccess: (_, id) => {
      // Обновляем published в кеше БЕЗ перезагрузки с сервера
      queryClient.setQueriesData<any>({ queryKey: adminNewsKeys.lists() }, (old: any) => {
        if (!old?.content) return old;
        return {
          ...old,
          content: old.content.map((article: any) => 
            article.id === id ? { ...article, published: true } : article
          )
        };
      });
    },
  });
}

export function useUnpublishNewsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminNewsService.unpublish(id),
    onSuccess: (_, id) => {
      // Обновляем published в кеше БЕЗ перезагрузки с сервера
      queryClient.setQueriesData<any>({ queryKey: adminNewsKeys.lists() }, (old: any) => {
        if (!old?.content) return old;
        return {
          ...old,
          content: old.content.map((article: any) => 
            article.id === id ? { ...article, published: false } : article
          )
        };
      });
    },
  });
}

export function useDeleteNewsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminNewsService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: adminNewsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminNewsKeys.detail(id) });
    },
  });
}

export function useCreateNewsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => adminNewsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminNewsKeys.lists() });
    },
  });
}

export function useUpdateNewsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      adminNewsService.update(id, data),
    onSuccess: (_, variables) => {
      // Инвалидируем списки и конкретную новость
      queryClient.invalidateQueries({ queryKey: adminNewsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminNewsKeys.detail(variables.id) });
    },
  });
}
