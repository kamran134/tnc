import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { removeEmptyFields } from '../utils/cleanup';

// API Configuration
// Используем относительный путь /api для всех запросов
// Это заставляет их идти через Next.js API routes которые читают httpOnly cookies
// и добавляют Authorization header при проксировании на бэкенд
export const API_BASE_URL = '/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // Отправляем cookies с запросами (критично для httpOnly cookies)
  headers: {
    'Content-Type': 'application/json',
  },
  // Add default params to prevent validation errors
  params: {
    lang: 'az', // Default language parameter
  },
});

// Request interceptor - Clean data and ensure lang parameter
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Ensure lang param exists, use 'az' as default if not provided
    if (!config.params) {
      config.params = { lang: 'az' };
    } else if (!config.params.lang) {
      config.params.lang = 'az';
    }
    
    // Clean empty fields from request data for POST, PUT, PATCH requests
    // Skip cleaning if data is an array (e.g., for reorder endpoints)
    if (config.data && 
        ['post', 'put', 'patch'].includes(config.method?.toLowerCase() || '') &&
        !Array.isArray(config.data)) {
      config.data = removeEmptyFields(config.data);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Single-flight refresh: все параллельные 401 ждут один и тот же промис, а не запускают
// по своему собственному рефрешу (без ротации refresh-токена это безопасно — см. §2 ТЗ).
// Это модульное состояние живёт ТОЛЬКО в браузере (клиентский код), на сервере такое
// делать нельзя — там cookies() привязаны к контексту конкретного запроса.
let refreshPromise: Promise<boolean> | null = null;

function requestRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// Response interceptor - Simple error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalConfig = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    // Handle 401 Unauthorized - попытка обновить токен и повторить запрос ровно один раз.
    if (
      error.response?.status === 401 &&
      originalConfig &&
      !originalConfig._retry &&
      !originalConfig.url?.startsWith('/auth/') // не рефрешим сам /auth/*, чтобы не зациклиться
    ) {
      originalConfig._retry = true;

      const refreshed = await requestRefresh();

      if (refreshed) {
        return apiClient(originalConfig);
      }

      // Рефреш не удался — сессия мертва. Редиректим на логин только если мы в админке.
      if (
        typeof window !== 'undefined' &&
        window.location.pathname.startsWith('/dashboard') &&
        !window.location.pathname.startsWith('/dashboard/login')
      ) {
        window.location.href =
          '/dashboard/login?redirect=' + encodeURIComponent(window.location.pathname);
      }

      return Promise.reject(error);
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }

    // Handle 423 Account Locked
    if (error.response?.status === 423) {
      console.error('Account locked:', error.response.data);
    }

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
