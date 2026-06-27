// Common Types
export type LanguageCode = 'az' | 'en' | 'ru';
export type UserRole = 'ADMIN' | 'MODERATOR';
export type ContactStatus = 'NEW' | 'READ' | 'REPLIED' | 'CLOSED';
export type FileType = 'NEWS_IMAGE' | 'CAREER_IMAGE' | 'SERVICE_IMAGE' | 'COMPANY_LOGO' | 'USER_AVATAR' | 'DOCUMENT' | 'OTHER';
export type PageTag = 'HOME' | 'ABOUT' | 'SERVICES' | 'CAREER' | 'NEWS' | 'CONTACT' | 'TEAM' | 'MEMBERSHIP';

// Pagination
export interface PageableObject {
  offset: number;
  sort: SortObject[];
  unpaged: boolean;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
}

export interface SortObject {
  direction: string;
  nullHandling: string;
  ascending: boolean;
  property: string;
  ignoreCase: boolean;
}

export interface Page<T> {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  sort: SortObject[];
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: PageableObject;
  empty: boolean;
}

// Translation DTOs
export interface ServiceTranslationDto {
  id?: number;
  languageCode: LanguageCode;
  title: string;
  content: string;
  excerpt?: string;
}

export interface NewsTranslationDto {
  id?: number;
  languageCode: LanguageCode;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
}

export interface CareerTranslationDto {
  id?: number;
  languageCode: LanguageCode;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  requirements?: string;
  position?: string;
  company?: string;
  department?: string;
}

export interface MembershipTranslationDto {
  id?: number;
  languageCode: LanguageCode;
  title: string;
  content?: string;
  excerpt?: string;
  servicesProvided?: string;
  partnershipDetails?: string;
  contactInfo?: string;
}

export interface CoreValueTranslationDto {
  id?: number;
  languageCode: LanguageCode;
  title: string;
  content: string;
  excerpt?: string;
}

export interface HomeContentTranslationDto {
  id?: number;
  languageCode: LanguageCode;
  title: string;
  content?: string;
  excerpt?: string;
  mission: string;
  vision: string;
}

export interface TeamMemberTranslationDto {
  id?: number;
  languageCode: LanguageCode;
  fullName: string;
  position?: string;
  bio?: string;
  positionDescription?: string;
}

export interface MissionVisionValueItemDto {
  id?: number;
  title: string;
  description: string;
  icon?: string;
  displayOrder?: number;
}

// Page Hero DTOs
export interface PageHeroTranslationDto {
  id?: number;
  languageCode: LanguageCode;
  title: string;
  subtitle?: string;
  heroDescription?: string;
  buttonText?: string;
  buttonUrl?: string;
  backgroundImageUrl?: string;
  heroImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageHeroAdminDto {
  id?: number;
  pageTag: PageTag;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
  translations: PageHeroTranslationDto[];
}

export interface CreatePageHeroRequest {
  pageTag: PageTag;
  isActive?: boolean;
  sortOrder?: number;
  translations: PageHeroTranslationDto[];
}

export interface UpdatePageHeroRequest {
  pageTag?: PageTag;
  isActive?: boolean;
  sortOrder?: number;
  translations: PageHeroTranslationDto[];
}

/** Public (user-facing) response for a single hero slide */
export interface PageHeroUserDto {
  id: number;
  pageTag: PageTag;
  sortOrder: number;
  title: string;
  subtitle?: string;
  heroDescription?: string;
  buttonText?: string;
  buttonUrl?: string;
  backgroundImageUrl?: string;
  heroImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  languageCode: string;
}

export interface CompanyInfoTranslationDto {
  id?: number;
  languageCode: LanguageCode;
  address: string;
  description?: string;
  history?: string;
  missionTitle: string;
  missionDescription?: string;
  missions: MissionVisionValueItemDto[];
  visionTitle: string;
  visionDescription?: string;
  visions: MissionVisionValueItemDto[];
  valuesTitle: string;
  valuesDescription?: string;
  values: MissionVisionValueItemDto[];
}

// Public DTOs
export interface ServiceDto {
  id: number;
  title: string;
  slug: string;
  content: string;
  languageCode: LanguageCode;
  excerpt?: string;
  imageUrl?: string;
  iconUrl?: string;
  category: string;
  displayOrder?: number;
  featured: boolean;
}

export interface NewsDto {
  id: number;
  languageCode: LanguageCode;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  author?: string;
  publishDate: string;
  published: boolean;
  category?: string;
  readTimeMinutes?: number;
  tags?: string;
}

export interface CareerDto {
  id: number;
  title: string;
  slug: string;
  languageCode: LanguageCode;
  content: string;
  excerpt?: string;
  requirements?: string;
  position: string;
  company?: string;
  department?: string;
  location: string;
  employmentType?: string;
  salaryRange?: string;
  postDate: string;
  expiryDate?: string;
}

export interface MembershipDto {
  id: number;
  title: string;
  description?: string;
  languageCode: LanguageCode;
  servicesProvided?: string;
  partnershipDetails?: string;
  contactInfo?: string;
  imageUrl?: string;
  logoUrl?: string;
  websiteUrl?: string;
  partnershipType?: string;
  establishedDate?: string;
  active: boolean;
}

export interface CoreValueDto {
  id: number;
  languageCode: LanguageCode;
  title: string;
  content: string;
  excerpt?: string;
  icon?: string;
  sortOrder?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface TeamMemberDto {
  id: number;
  fullName: string;
  position?: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  bio?: string;
  positionDescription?: string;
  sortOrder?: number;
}

export interface HomeContentDto {
  id: number;
  languageCode: LanguageCode;
  title: string;
  subtitle?: string;
  content?: string;
  excerpt?: string;
  heroImageUrl?: string;
  ctaButtonText?: string;
  ctaButtonUrl?: string;
  mission: string;
  vision: string;
  section1Title?: string;
  section1Content?: string;
  section2Title?: string;
  section2Content?: string;
  statisticsTitle?: string;
  statsNumbers?: string;
  values: CoreValueDto[];
  memberships: MembershipDto[];
}

export interface CompanyInfoDto {
  id: number;
  languageCode: LanguageCode;
  companyName: string;
  logoUrl?: string;
  description?: string;
  history?: string;
  missionTitle: string;
  missionDescription?: string;
  missions: MissionVisionValueItemDto[];
  visionTitle: string;
  visionDescription?: string;
  visions: MissionVisionValueItemDto[];
  valuesTitle: string;
  valuesDescription?: string;
  values: MissionVisionValueItemDto[];
  address: string;
  phone: string;
  email: string;
  website?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  foundedYear?: string;
  teamSize?: string;
}

export interface ContactDto {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  submissionDate?: string;
  status?: string;
}

// Admin DTOs
export interface ServiceAdminDto {
  id?: number;
  category: string;
  serviceCategoryId?: number;
  categoryCode?: string;
  categoryName?: string;
  iconUrl?: string;
  sortOrder?: number;
  categorySortOrder?: number;
  active?: boolean;
  translations: ServiceTranslationDto[];
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface NewsAdminDto {
  id?: number;
  imageUrl?: string;
  author?: string;
  publishedDate?: string;
  published?: boolean;
  category?: string;
  readTimeMinutes?: number;
  tags?: string;
  translations: NewsTranslationDto[];
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface CareerAdminDto {
  id?: number;
  location?: string;
  employmentType?: string;
  salaryRange?: string;
  postDate?: string;
  expiryDate?: string;
  active?: boolean;
  translations: CareerTranslationDto[];
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface MembershipAdminDto {
  id?: number;
  name: string;
  fullName?: string;
  logoUrl?: string;
  imageUrl?: string;
  websiteUrl?: string;
  partnershipType?: string;
  establishedDate?: string;
  sortOrder?: number;
  active?: boolean;
  translations: MembershipTranslationDto[];
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface TeamMemberAdminDto {
  id?: number;
  email?: string;
  phone?: string;
  imageUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  active?: boolean;
  sortOrder?: number;
  translations: TeamMemberTranslationDto[];
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface CoreValueAdminDto {
  id?: number;
  icon?: string;
  sortOrder?: number;
  active?: boolean;
  translations: CoreValueTranslationDto[];
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface HomeContentAdminDto {
  id?: number;
  translations: HomeContentTranslationDto[];
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface CompanyInfoAdminDto {
  id?: number;
  companyName: string;
  logoUrl?: string;
  foundedYear?: string;
  email: string;
  phone: string;
  website?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  teamSize?: string;
  translations: CompanyInfoTranslationDto[];
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface ContactAdminDto extends ContactDto {
  adminNotes?: string;
  repliedAt?: string;
  repliedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

// Auth DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserInfo;
}

export interface UserInfo {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  lastLogin?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  active?: boolean;
}

export interface UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  active: boolean;
  lastLogin?: string;
  failedLoginAttempts: number;
  lockedUntil?: string;
  createdAt: string;
  updatedAt: string;
  accountLocked: boolean;
}

// File Upload DTOs
export interface FileUploadDto {
  id: number;
  fileName: string;
  originalFileName: string;
  filePath: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
  uploadDate: string;
  uploadedBy: string;
}

export interface FileStatistics {
  totalFiles: number;
  cleanFiles: number;
  infectedFiles: number;
  pendingScans: number;
  totalSizeBytes: number;
}

// Dashboard DTOs
export interface DashboardDataDto {
  totalServices: number;
  activeServices: number;
  totalNews: number;
  publishedNews: number;
  totalCareers: number;
  activeCareers: number;
  totalContacts: number;
  newContacts: number;
}

export interface MonthlyStatDto {
  year: number;
  month: number;
  count: number;
}

export interface AnalyticsDto {
  contactsByMonth: MonthlyStatDto[];
  newsByMonth: MonthlyStatDto[];
}

// Service Category DTOs
export interface ServiceCategoryTranslationDto {
  id?: number;
  languageCode: LanguageCode;
  name: string;
  description?: string;
}

export interface ServiceCategoryAdminDto {
  id: number;
  code: string;
  iconUrl?: string;
  sortOrder?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  translations: ServiceCategoryTranslationDto[];
}

export interface ServiceCategoryUserDto {
  id: number;
  code: string;
  name: string;
  description?: string;
  iconUrl?: string;
  sortOrder?: number;
}

// About Section DTOs
export interface AboutSectionTranslationDto {
  id?: number;
  languageCode: LanguageCode;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
}

export interface AboutSectionAdminDto {
  id: number;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
  translations: AboutSectionTranslationDto[];
}

export interface AboutSectionUserDto {
  id: number;
  sortOrder: number;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
}

export interface AboutContentUserResponse {
  sections: AboutSectionUserDto[];
}

export interface CreateAboutSectionRequest {
  sortOrder?: number;
  translations: AboutSectionTranslationDto[];
}

export type UpdateAboutSectionRequest = CreateAboutSectionRequest;

// API Response Types
export type PageNewsDto = Page<NewsDto>;
export type PageCareerDto = Page<CareerDto>;
export type PageServiceAdminDto = Page<ServiceAdminDto>;
export type PageNewsAdminDto = Page<NewsAdminDto>;
export type PageCareerAdminDto = Page<CareerAdminDto>;
export type PageMembershipAdminDto = Page<MembershipAdminDto>;
export type PageCoreValueAdminDto = Page<CoreValueAdminDto>;
export type PageContactAdminDto = Page<ContactAdminDto>;
export type PageUserDto = Page<UserDto>;
export type PageFileUploadDto = Page<FileUploadDto>;
export type PageTeamMemberAdminDto = Page<TeamMemberAdminDto>;
export type PageServiceCategoryAdminDto = Page<ServiceCategoryAdminDto>;
export type PageString = Page<string>;
