import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { removeEmptyFields } from '../utils/cleanup';

// API Configuration
// В ЛЮБОМ случае используем полный URL к бекенду
// Rewrites в next.config.js нужны только для проксирования на серверной стороне Next.js
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://tnc.az/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
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
    if (config.data && ['post', 'put', 'patch'].includes(config.method?.toLowerCase() || '')) {
      config.data = removeEmptyFields(config.data);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Simple error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
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
