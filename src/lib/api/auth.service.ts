import apiClient, { handleApiError, tokenManager } from './client';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  ChangePasswordRequest,
  CreateUserRequest,
  UpdateUserRequest,
  UserDto,
  PageUserDto,
} from '@/types/api';

export const authService = {
  // Login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      const { accessToken, refreshToken } = response.data;
      
      // Store tokens
      tokenManager.setTokens(accessToken, refreshToken);
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearTokens();
    }
  },

  // Logout from all devices
  async logoutAll(): Promise<void> {
    try {
      await apiClient.post('/auth/logout-all');
    } catch (error) {
      throw handleApiError(error);
    } finally {
      tokenManager.clearTokens();
    }
  },

  // Refresh token
  async refreshToken(request: RefreshTokenRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/refresh', request);
      const { accessToken, refreshToken } = response.data;
      
      // Update tokens
      tokenManager.setTokens(accessToken, refreshToken);
      
      return response.data;
    } catch (error) {
      tokenManager.clearTokens();
      throw handleApiError(error);
    }
  },

  // Get current user
  async getCurrentUser(): Promise<UserDto> {
    try {
      const response = await apiClient.get<UserDto>('/auth/me');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Change password
  async changePassword(request: ChangePasswordRequest): Promise<void> {
    try {
      await apiClient.post('/auth/change-password', request);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get users list (Admin only)
  async getUsers(params?: {
    page?: number;
    size?: number;
    sort?: string;
    direction?: string;
  }): Promise<PageUserDto> {
    try {
      const response = await apiClient.get<PageUserDto>('/auth/users', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get user by ID (Admin only)
  async getUserById(id: number): Promise<UserDto> {
    try {
      const response = await apiClient.get<UserDto>(`/auth/users/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create user (Admin only)
  async createUser(request: CreateUserRequest): Promise<UserDto> {
    try {
      const response = await apiClient.post<UserDto>('/auth/users', request);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update user (Admin only)
  async updateUser(id: number, request: UpdateUserRequest): Promise<UserDto> {
    try {
      const response = await apiClient.put<UserDto>(`/auth/users/${id}`, request);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Activate user (Admin only)
  async activateUser(id: number): Promise<void> {
    try {
      await apiClient.post(`/auth/users/${id}/activate`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Deactivate user (Admin only)
  async deactivateUser(id: number): Promise<void> {
    try {
      await apiClient.post(`/auth/users/${id}/deactivate`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Unlock user (Admin only)
  async unlockUser(id: number): Promise<void> {
    try {
      await apiClient.post(`/auth/users/${id}/unlock`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  },
};
