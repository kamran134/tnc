import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

// API Configuration
// В ЛЮБОМ случае используем полный URL к бекенду
// Rewrites в next.config.js нужны только для проксирования на серверной стороне Next.js
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://tnc.az/api';

console.log('🔧 API Client Config:', {
  NEXT_PUBLIC_USE_PROXY: process.env.NEXT_PUBLIC_USE_PROXY,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  API_BASE_URL,
  mode: 'DIRECT TO BACKEND'
});

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Token management utilities
export const tokenManager = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') {
      console.log('⚠️ tokenManager.getAccessToken: SSR - returning null');
      return null;
    }
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    console.log('🔑 tokenManager.getAccessToken:', token ? `EXISTS (${token.substring(0, 30)}...)` : 'MISSING');
    return token;
  },

  setAccessToken: (token: string): void => {
    if (typeof window === 'undefined') {
      console.log('⚠️ tokenManager.setAccessToken: SSR - skipping');
      return;
    }
    console.log('💾 tokenManager.setAccessToken:', token ? `SETTING (${token.substring(0, 30)}...)` : 'EMPTY');
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    console.log('✅ Access token saved to localStorage');
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') {
      console.log('⚠️ tokenManager.getRefreshToken: SSR - returning null');
      return null;
    }
    const token = localStorage.getItem(REFRESH_TOKEN_KEY);
    console.log('🔑 tokenManager.getRefreshToken:', token ? `EXISTS (${token.substring(0, 30)}...)` : 'MISSING');
    return token;
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') {
      console.log('⚠️ tokenManager.setRefreshToken: SSR - skipping');
      return;
    }
    console.log('💾 tokenManager.setRefreshToken:', token ? `SETTING (${token.substring(0, 30)}...)` : 'EMPTY');
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
    console.log('✅ Refresh token saved to localStorage');
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') {
      console.log('⚠️ tokenManager.clearTokens: SSR - skipping');
      return;
    }
    console.log('🗑️ tokenManager.clearTokens: CLEARING all tokens');
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    console.log('✅ All tokens cleared from localStorage');
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    console.log('💾 tokenManager.setTokens: SETTING both tokens');
    tokenManager.setAccessToken(accessToken);
    tokenManager.setRefreshToken(refreshToken);
    console.log('✅ Both tokens set successfully');
  }
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    
    console.log('🚀 ======================== API REQUEST START ========================');
    console.log('📍 URL:', (config.baseURL || '') + (config.url || ''));
    console.log('🔧 Method:', config.method?.toUpperCase());
    console.log('📦 Data:', JSON.stringify(config.data, null, 2));
    console.log('🔑 Access Token:', token ? `EXISTS (${token.substring(0, 30)}...)` : 'MISSING');
    console.log('📋 Headers:', JSON.stringify(config.headers, null, 2));
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header set');
    } else {
      console.log('⚠️ NO Authorization header');
    }
    
    console.log('🚀 ======================== API REQUEST END ========================\n');

    return config;
  },
  (error: AxiosError) => {
    console.log('❌ ======================== API REQUEST ERROR ========================');
    console.log('Error:', error.message);
    console.log('❌ ======================== API REQUEST ERROR END ========================\n');
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ ======================== API RESPONSE SUCCESS ========================');
    console.log('📍 URL:', response.config.url);
    console.log('✨ Status:', response.status, response.statusText);
    console.log('📦 Data:', JSON.stringify(response.data, null, 2));
    console.log('📋 Response Headers:', JSON.stringify(response.headers, null, 2));
    console.log('✅ ======================== API RESPONSE END ========================\n');
    return response;
  },
  async (error: AxiosError) => {
    console.log('❌ ======================== API RESPONSE ERROR ========================');
    console.log('📍 URL:', error.config?.url);
    console.log('💥 Status:', error.response?.status);
    console.log('📦 Error Data:', JSON.stringify(error.response?.data, null, 2));
    console.log('📋 Error Headers:', JSON.stringify(error.response?.headers, null, 2));
    console.log('🔍 Error Message:', error.message);
    
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 401 ERROR - Checking if need to refresh token...');
      
      // Check if this is a public endpoint (no auth required)
      const publicEndpoints = [
        '/home-content',
        '/core-values',
        '/memberships',
        '/company-info',
        '/services',
        '/news',
        '/careers',
        '/contact'
      ];
      
      const isPublicEndpoint = publicEndpoints.some(endpoint => 
        originalRequest.url?.includes(endpoint)
      );
      
      console.log('🔍 Is public endpoint?', isPublicEndpoint);
      
      // For public endpoints, just return the error without redirect
      if (isPublicEndpoint) {
        console.log('📖 Public endpoint - returning error without refresh');
        console.log('❌ ======================== API RESPONSE ERROR END ========================\n');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        console.log('⏳ Already refreshing token - queuing request');
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            console.log('✅ Token refreshed from queue - retrying request');
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch(err => {
            console.log('❌ Failed from queue');
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      console.log('🔄 Starting token refresh...');

      const refreshToken = tokenManager.getRefreshToken();
      console.log('🔑 Refresh Token:', refreshToken ? `EXISTS (${refreshToken.substring(0, 30)}...)` : 'MISSING');

      if (!refreshToken) {
        console.log('❌ NO REFRESH TOKEN - Clearing tokens and redirecting to login');
        // No refresh token, clear tokens and redirect to login
        tokenManager.clearTokens();
        if (typeof window !== 'undefined') {
          console.log('🔀 Redirecting to /dashboard/login');
          window.location.href = '/dashboard/login';
        }
        console.log('❌ ======================== API RESPONSE ERROR END ========================\n');
        return Promise.reject(error);
      }

      try {
        console.log('🔄 Calling refresh endpoint...');
        // Attempt to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        });

        console.log('✅ Token refresh successful!');
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        console.log('🔑 New Access Token:', accessToken ? `EXISTS (${accessToken.substring(0, 30)}...)` : 'MISSING');
        console.log('🔑 New Refresh Token:', newRefreshToken ? `EXISTS (${newRefreshToken.substring(0, 30)}...)` : 'MISSING');

        // Update tokens
        tokenManager.setTokens(accessToken, newRefreshToken);
        console.log('💾 Tokens saved to localStorage');

        // Update the failed request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          console.log('✅ Updated Authorization header in original request');
        }

        // Process queued requests
        processQueue(null, accessToken);
        console.log('✅ Processed queued requests');

        console.log('🔄 Retrying original request...');
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.log('❌ TOKEN REFRESH FAILED!');
        console.log('💥 Refresh Error:', refreshError);
        // Refresh failed, clear tokens and redirect
        processQueue(refreshError as AxiosError, null);
        tokenManager.clearTokens();
        console.log('🗑️ Tokens cleared');
        
        if (typeof window !== 'undefined') {
          console.log('🔀 Redirecting to /dashboard/login');
          window.location.href = '/dashboard/login';
        }

        console.log('❌ ======================== API RESPONSE ERROR END ========================\n');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        console.log('🔓 Refresh lock released');
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('🚫 Access forbidden:', error.response.data);
    }

    // Handle 423 Account Locked
    if (error.response?.status === 423) {
      console.error('🔒 Account locked:', error.response.data);
    }

    console.log('❌ ======================== API RESPONSE ERROR END ========================\n');
    return Promise.reject(error);
  }
);

// API Error class for better error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to handle API errors
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    const message = axiosError.response?.data?.message || 
                    axiosError.response?.data?.error ||
                    axiosError.message ||
                    'An unexpected error occurred';
    
    return new ApiError(
      message,
      axiosError.response?.status,
      axiosError.response?.data
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError('An unexpected error occurred');
};

export default apiClient;
