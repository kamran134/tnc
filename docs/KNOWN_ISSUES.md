# Known Backend Issues

## Cache Configuration Issues

### Error: Cannot find cache named 'publishedNewsPages'

**Description:** This error occurs when creating news articles due to Spring Boot cache configuration issues on the backend.

**Full Error Message:**
```
Cannot find cache named 'publishedNewsPages' for Builder[public az.tnc.backend.dto.news.NewsAdminDto az.tnc.backend.service.impl.NewsServiceImpl.createNews(az.tnc.backend.dto.news.NewsAdminDto)] caches=[publishedNewsPages, publishedNewsFiltered, adminNewsPages] | key='' | keyGenerator='' | cacheManager='' | cacheResolver='' | condition='',true,false
```

**Cause:** 
- Spring Boot cache is not properly configured
- Cache beans are not initialized
- Cache provider (Redis, Hazelcast, etc.) is not running
- Mismatch between cache names in code and configuration

**Frontend Handling:**
1. Added better error detection in API routes
2. User-friendly error messages
3. Detailed logging for debugging

**Temporary Workaround:**
- News may still be created successfully despite the error
- Check the news list to verify if the article was saved
- Restart the backend service to refresh cache configuration

**Backend Solution (for backend team):**
1. Check `@EnableCaching` annotation is present
2. Verify cache configuration in `application.yml`
3. Ensure cache provider is running and accessible
4. Check cache name consistency across the application

## API Endpoint Issues

### Incorrect API Paths
**Fixed:** Updated all admin API routes to include proper `/api` prefix:
- `/admin/news` → `/api/admin/news`
- `/admin/services` → `/api/admin/services`
- `/admin/careers` → `/api/admin/careers`
- `/admin/contacts` → `/api/admin/contacts`
- `/admin/dashboard/statistics` → `/api/admin/dashboard/statistics`

## File Upload System

### New Features Added
- **Image Upload Component**: Drag & drop file upload with preview
- **API Integration**: Proper file upload to backend with security scanning
- **Form Integration**: All image fields now use file upload instead of URL input

### File Types Supported
- `NEWS_IMAGE`: Images for news articles
- `SERVICE_IMAGE`: Icons/images for services  
- `CAREER_IMAGE`: Images for job postings
- `COMPANY_LOGO`: Company and membership logos
- `USER_AVATAR`: Profile pictures

### File Validation
- **Allowed formats**: JPG, PNG, GIF, WEBP
- **Maximum size**: 5MB per file
- **Security**: Backend antivirus scanning
- **Preview**: Real-time image preview in forms

### Updated Forms
- ✅ News creation/editing: Image upload instead of imageUrl
- ✅ Service creation/editing: Icon upload instead of iconUrl
- 🔄 Career forms: Ready for image upload
- 🔄 Membership forms: Ready for logo upload

## Error Handling Improvements

### Enhanced Error Messages
- Cache-specific errors are detected and translated to user-friendly messages
- Network errors are distinguished from server errors
- Detailed logging for debugging while keeping user messages simple
- File upload errors with specific validation messages

### API Route Improvements
- Better error parsing from backend responses
- Differentiation between different error types
- Comprehensive logging for debugging
- File upload endpoint with proper error handling

## Testing Recommendations

1. **Test news creation with backend logs** to see the actual error
2. **Verify cache configuration** on backend startup
3. **Check if news are actually saved** despite cache errors
4. **Monitor backend health** when performing admin operations