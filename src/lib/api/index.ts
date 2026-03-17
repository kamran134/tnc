// Export API client and utilities
export { default as apiClient, handleApiError, ApiError } from './client';

// Export public services
export { newsService } from './news.service';
export { servicesService } from './services.service';
export { careersService } from './careers.service';
export { contactService } from './contact.service';
export { homeService, coreValuesService, membershipsService, companyInfoService, aboutContentService } from './public.service';
export { adminAboutSectionsService } from './admin-about-sections.service';
export { pageHeroService } from './page-hero.service';
export { filesService } from './files.service';
export { teamService } from './team.service';

// Export auth service from new location for backward compatibility
export { authService } from '@/lib/auth/client';
export { adminNewsService } from './admin-news.service';
export { adminServicesService } from './admin-services.service';
export { adminServiceCategoriesService, serviceCategoriesService } from './admin-service-categories.service';
export { adminCareersService } from './admin-careers.service';
export { adminContactsService } from './admin-contacts.service';
export { 
  adminMembershipsService, 
  adminCoreValuesService, 
  adminHomeContentService, 
  adminCompanyInfoService 
} from './admin-content.service';
export { adminFilesService } from './files.service';
export { adminDashboardService } from './admin-dashboard.service';
export { adminPageHeroService } from './admin-page-hero.service';
export { adminTeamService } from './admin-team.service';

// Export all types
export * from '@/types/api';
