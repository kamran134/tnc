import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  adminCompanyInfoService,
  adminHomeContentService,
  adminCoreValuesService,
  adminMembershipsService,
} from '@/lib/api';
import {
  CompanyInfoAdminDto,
  HomeContentAdminDto,
  CoreValueAdminDto,
  MembershipAdminDto,
} from '@/types/api';

// Query keys
export const contentQueryKeys = {
  companyInfo: ['admin', 'company-info'] as const,
  homeContent: ['admin', 'home-content'] as const,
  coreValues: {
    all: ['admin', 'core-values'] as const,
    list: () => [...contentQueryKeys.coreValues.all, 'list'] as const,
    detail: (id: number) => [...contentQueryKeys.coreValues.all, id] as const,
  },
  memberships: {
    all: ['admin', 'memberships'] as const,
    list: () => [...contentQueryKeys.memberships.all, 'list'] as const,
    detail: (id: number) => [...contentQueryKeys.memberships.all, id] as const,
  },
};

// Company Info Queries
export function useCompanyInfoQuery() {
  return useQuery({
    queryKey: contentQueryKeys.companyInfo,
    queryFn: () => adminCompanyInfoService.get(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
}

export function useCompanyInfoMutation() {
  const queryClient = useQueryClient();

  return {
    create: useMutation({
      mutationFn: (data: CompanyInfoAdminDto) => adminCompanyInfoService.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contentQueryKeys.companyInfo });
      },
    }),
    update: useMutation({
      mutationFn: (data: CompanyInfoAdminDto) => adminCompanyInfoService.update(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contentQueryKeys.companyInfo });
      },
    }),
    delete: useMutation({
      mutationFn: () => adminCompanyInfoService.delete(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contentQueryKeys.companyInfo });
      },
    }),
  };
}

// Home Content Queries
export function useHomeContentQuery() {
  return useQuery({
    queryKey: contentQueryKeys.homeContent,
    queryFn: () => adminHomeContentService.get(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}

export function useHomeContentMutation() {
  const queryClient = useQueryClient();

  return {
    create: useMutation({
      mutationFn: (data: HomeContentAdminDto) => adminHomeContentService.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contentQueryKeys.homeContent });
      },
    }),
    update: useMutation({
      mutationFn: (data: HomeContentAdminDto) => adminHomeContentService.update(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contentQueryKeys.homeContent });
      },
    }),
    delete: useMutation({
      mutationFn: () => adminHomeContentService.delete(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contentQueryKeys.homeContent });
      },
    }),
  };
}

// Core Values Queries
export function useAdminCoreValuesListQuery() {
  return useQuery({
    queryKey: contentQueryKeys.coreValues.list(),
    queryFn: () => adminCoreValuesService.getAllAsList(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useAdminCoreValueQuery(id: number) {
  return useQuery({
    queryKey: contentQueryKeys.coreValues.detail(id),
    queryFn: () => adminCoreValuesService.getById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useAdminCoreValueMutation() {
  const queryClient = useQueryClient();

  return {
    create: useMutation({
      mutationFn: (data: CoreValueAdminDto) => adminCoreValuesService.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contentQueryKeys.coreValues.all });
      },
    }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: number; data: CoreValueAdminDto }) =>
        adminCoreValuesService.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contentQueryKeys.coreValues.all });
      },
    }),
    delete: useMutation({
      mutationFn: (id: number) => adminCoreValuesService.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contentQueryKeys.coreValues.all });
      },
    }),
    activate: useMutation({
      mutationFn: (id: number) => adminCoreValuesService.activate(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contentQueryKeys.coreValues.all });
      },
    }),
    deactivate: useMutation({
      mutationFn: (id: number) => adminCoreValuesService.deactivate(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contentQueryKeys.coreValues.all });
      },
    }),
    reorder: useMutation({
      mutationFn: (ids: number[]) => adminCoreValuesService.reorder(ids),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contentQueryKeys.coreValues.all });
      },
    }),
  };
}

// Memberships Queries
export function useAdminMembershipsListQuery() {
  return useQuery({
    queryKey: contentQueryKeys.memberships.list(),
    queryFn: () => adminMembershipsService.getAllAsList(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useAdminMembershipQuery(id: number) {
  return useQuery({
    queryKey: contentQueryKeys.memberships.detail(id),
    queryFn: () => adminMembershipsService.getById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useAdminMembershipMutation() {
  const queryClient = useQueryClient();

  return {
    create: useMutation({
      mutationFn: (data: MembershipAdminDto) => adminMembershipsService.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contentQueryKeys.memberships.all });
      },
    }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: number; data: MembershipAdminDto }) =>
        adminMembershipsService.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contentQueryKeys.memberships.all });
      },
    }),
    delete: useMutation({
      mutationFn: (id: number) => adminMembershipsService.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contentQueryKeys.memberships.all });
      },
    }),
    activate: useMutation({
      mutationFn: (id: number) => adminMembershipsService.activate(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contentQueryKeys.memberships.all });
      },
    }),
    deactivate: useMutation({
      mutationFn: (id: number) => adminMembershipsService.deactivate(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contentQueryKeys.memberships.all });
      },
    }),
    reorder: useMutation({
      mutationFn: (ids: number[]) => adminMembershipsService.reorder(ids),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contentQueryKeys.memberships.all });
      },
    }),
  };
}
