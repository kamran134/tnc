# API Documentation for TnC Tax & Consulting Website

## Overview
This document outlines the API endpoints and data models required for the TnC Tax & Consulting website backend integration.

## Base URL
```
https://api.tnc.az/v1
```

## Authentication
All admin/dashboard endpoints require JWT authentication:
```
Authorization: Bearer <token>
```

## Data Models

### Company Information Model
```typescript
interface CompanyInfo {
  id: string
  name: string
  email: string
  phone: string
  address: string
  mission: string
  vision: string
  founded_year: number
  description: string
  social_links: {
    linkedin?: string
    twitter?: string
    facebook?: string
  }
  created_at: string
  updated_at: string
}
```

### Service Model
```typescript
interface Service {
  id: string
  name: string
  category: 'accounting' | 'tax-compliance' | 'tax-advisory' | 'legal' | 'hr'
  description: string
  features: string[]
  icon?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}
```

### News Article Model
```typescript
interface NewsArticle {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  category: string
  author: string
  featured_image?: string
  is_published: boolean
  published_at: string
  read_time_minutes: number
  tags: string[]
  created_at: string
  updated_at: string
}
```

### Job Opening Model
```typescript
interface JobOpening {
  id: string
  title: string
  department: string
  location: string
  employment_type: 'full-time' | 'part-time' | 'contract' | 'internship'
  experience_level: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  salary_range?: string
  is_active: boolean
  application_deadline?: string
  created_at: string
  updated_at: string
}
```

### Contact Inquiry Model
```typescript
interface ContactInquiry {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  service_interest?: string
  message: string
  status: 'new' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  assigned_to?: string
  response_notes?: string
  created_at: string
  updated_at: string
}
```

### Core Value Model
```typescript
interface CoreValue {
  id: string
  title: string
  description: string
  icon: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}
```

### Membership Model
```typescript
interface Membership {
  id: string
  name: string
  full_name: string
  description: string
  logo_url?: string
  website_url?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}
```

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Company Information
```
GET /company/info
Response: CompanyInfo
```

#### Services
```
GET /services
Query Parameters:
  - category?: string
  - is_active?: boolean
Response: Service[]

GET /services/{id}
Response: Service
```

#### News Articles
```
GET /news
Query Parameters:
  - category?: string
  - is_published?: boolean
  - limit?: number (default: 10)
  - offset?: number (default: 0)
  - search?: string
Response: {
  articles: NewsArticle[]
  total: number
  limit: number
  offset: number
}

GET /news/{slug}
Response: NewsArticle
```

#### Job Openings
```
GET /jobs
Query Parameters:
  - department?: string
  - employment_type?: string
  - is_active?: boolean
  - limit?: number (default: 10)
  - offset?: number (default: 0)
Response: {
  jobs: JobOpening[]
  total: number
  limit: number
  offset: number
}

GET /jobs/{id}
Response: JobOpening
```

#### Contact Form Submission
```
POST /contact/inquiries
Body: {
  name: string
  email: string
  phone?: string
  company?: string
  service_interest?: string
  message: string
}
Response: {
  success: boolean
  message: string
  inquiry_id: string
}
```

#### Core Values
```
GET /core-values
Query Parameters:
  - is_active?: boolean
Response: CoreValue[]
```

#### Memberships
```
GET /memberships
Query Parameters:
  - is_active?: boolean
Response: Membership[]
```

### Admin/Dashboard Endpoints (Authentication Required)

#### Company Management
```
PUT /admin/company/info
Body: Partial<CompanyInfo>
Response: CompanyInfo
```

#### Services Management
```
GET /admin/services
Response: Service[]

POST /admin/services
Body: Omit<Service, 'id' | 'created_at' | 'updated_at'>
Response: Service

PUT /admin/services/{id}
Body: Partial<Service>
Response: Service

DELETE /admin/services/{id}
Response: { success: boolean }
```

#### News Management
```
GET /admin/news
Query Parameters:
  - limit?: number
  - offset?: number
  - search?: string
Response: {
  articles: NewsArticle[]
  total: number
}

POST /admin/news
Body: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>
Response: NewsArticle

PUT /admin/news/{id}
Body: Partial<NewsArticle>
Response: NewsArticle

DELETE /admin/news/{id}
Response: { success: boolean }
```

#### Job Management
```
GET /admin/jobs
Response: JobOpening[]

POST /admin/jobs
Body: Omit<JobOpening, 'id' | 'created_at' | 'updated_at'>
Response: JobOpening

PUT /admin/jobs/{id}
Body: Partial<JobOpening>
Response: JobOpening

DELETE /admin/jobs/{id}
Response: { success: boolean }
```

#### Contact Inquiries Management
```
GET /admin/contact/inquiries
Query Parameters:
  - status?: string
  - priority?: string
  - limit?: number
  - offset?: number
Response: {
  inquiries: ContactInquiry[]
  total: number
}

PUT /admin/contact/inquiries/{id}
Body: {
  status?: string
  priority?: string
  assigned_to?: string
  response_notes?: string
}
Response: ContactInquiry

DELETE /admin/contact/inquiries/{id}
Response: { success: boolean }
```

#### Core Values Management
```
GET /admin/core-values
Response: CoreValue[]

POST /admin/core-values
Body: Omit<CoreValue, 'id' | 'created_at' | 'updated_at'>
Response: CoreValue

PUT /admin/core-values/{id}
Body: Partial<CoreValue>
Response: CoreValue

DELETE /admin/core-values/{id}
Response: { success: boolean }
```

#### Memberships Management
```
GET /admin/memberships
Response: Membership[]

POST /admin/memberships
Body: Omit<Membership, 'id' | 'created_at' | 'updated_at'>
Response: Membership

PUT /admin/memberships/{id}
Body: Partial<Membership>
Response: Membership

DELETE /admin/memberships/{id}
Response: { success: boolean }
```

#### Dashboard Analytics
```
GET /admin/dashboard/stats
Response: {
  total_services: number
  total_news: number
  total_jobs: number
  total_inquiries: number
  recent_inquiries: ContactInquiry[]
  popular_services: string[]
}
```

## Error Responses
All endpoints return errors in the following format:
```typescript
interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: any
  }
  timestamp: string
}
```

## Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting
- Public endpoints: 100 requests per minute per IP
- Admin endpoints: 1000 requests per minute per authenticated user

## File Upload
For file uploads (images, documents), use multipart/form-data:
```
POST /admin/upload
Content-Type: multipart/form-data
Body: file (max 10MB)
Response: {
  url: string
  filename: string
  size: number
}
```

## Notes for Backend Implementation
1. Implement proper validation for all input data
2. Use slug generation for news articles (URL-friendly)
3. Implement search functionality for news and jobs
4. Add email notifications for contact inquiries
5. Implement audit logging for admin actions
6. Add backup and restore functionality
7. Consider implementing caching for frequently accessed data
8. Implement proper CORS settings for frontend integration
