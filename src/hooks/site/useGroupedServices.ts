import { useMemo } from 'react';
import { useServiceCategories, useServicesListQuery } from '@/hooks/queries';
import type { LanguageCode, ServiceCategoryUserDto, ServiceDto } from '@/types/api';

export interface ServiceCategoryGroup {
  category: ServiceCategoryUserDto;
  services: ServiceDto[];
}

/** Service categories (sorted) each with their services (sorted), built from two cached queries. */
export function useGroupedServices(lang: LanguageCode) {
  const categoriesQuery = useServiceCategories(lang);
  const servicesQuery = useServicesListQuery(lang);

  const groups = useMemo<ServiceCategoryGroup[]>(() => {
    const categories = [...(categoriesQuery.data ?? [])].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    const services = servicesQuery.data ?? [];
    return categories.map((category) => ({
      category,
      services: services
        .filter((s) => s.categoryCode === category.code)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    }));
  }, [categoriesQuery.data, servicesQuery.data]);

  return {
    groups,
    isLoading: categoriesQuery.isLoading || servicesQuery.isLoading,
    error: categoriesQuery.error || servicesQuery.error,
  };
}
