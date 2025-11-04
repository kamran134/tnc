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
    console.log('🔐 ======================== AUTH SERVICE: LOGIN ========================');
    console.log('📧 Email:', credentials.email);
    console.log('🔑 Password:', credentials.password ? '***PROVIDED***' : 'MISSING');
    
    try {
      console.log('🚀 Calling login API...');
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      
      console.log('✅ Login API response received');
      const { accessToken, refreshToken } = response.data;
      
      console.log('🔑 Access Token received:', accessToken ? `YES (${accessToken.substring(0, 30)}...)` : 'NO');
      console.log('🔑 Refresh Token received:', refreshToken ? `YES (${refreshToken.substring(0, 30)}...)` : 'NO');
      
      // Store tokens
      console.log('💾 Storing tokens in localStorage...');
      tokenManager.setTokens(accessToken, refreshToken);
      
      console.log('✅ Tokens stored successfully');
      console.log('🔐 ======================== AUTH SERVICE: LOGIN END ========================\n');
      
      return response.data;
    } catch (error) {
      console.log('❌ Login failed!');
      console.log('💥 Error:', error);
      console.log('❌ ======================== AUTH SERVICE: LOGIN ERROR ========================\n');
      throw handleApiError(error);
    }
  },

  // Logout
  async logout(): Promise<void> {
    console.log('🚪 ======================== AUTH SERVICE: LOGOUT ========================');
    try {
      const refreshToken = tokenManager.getRefreshToken();
      console.log('🔑 Refresh Token:', refreshToken ? `EXISTS (${refreshToken.substring(0, 30)}...)` : 'MISSING');
      
      if (refreshToken) {
        console.log('🚀 Calling logout API...');
        await apiClient.post('/auth/logout', { refreshToken });
        console.log('✅ Logout API successful');
      } else {
        console.log('⚠️ No refresh token - skipping API call');
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      console.log('🗑️ Clearing tokens from localStorage...');
      tokenManager.clearTokens();
      console.log('✅ Tokens cleared');
      console.log('🚪 ======================== AUTH SERVICE: LOGOUT END ========================\n');
    }
  },

  // Logout from all devices
  async logoutAll(): Promise<void> {
    console.log('🚪🌍 ======================== AUTH SERVICE: LOGOUT ALL ========================');
    try {
      console.log('🚀 Calling logout-all API...');
      await apiClient.post('/auth/logout-all');
      console.log('✅ Logout-all API successful');
    } catch (error) {
      console.log('❌ Logout-all error:', error);
      throw handleApiError(error);
    } finally {
      console.log('🗑️ Clearing tokens from localStorage...');
      tokenManager.clearTokens();
      console.log('✅ Tokens cleared');
      console.log('🚪🌍 ======================== AUTH SERVICE: LOGOUT ALL END ========================\n');
    }
  },

  // Refresh token
  async refreshToken(request: RefreshTokenRequest): Promise<LoginResponse> {
    console.log('🔄 ======================== AUTH SERVICE: REFRESH TOKEN ========================');
    console.log('🔑 Refresh Token:', request.refreshToken ? `PROVIDED (${request.refreshToken.substring(0, 30)}...)` : 'MISSING');
    
    try {
      console.log('🚀 Calling refresh API...');
      const response = await apiClient.post<LoginResponse>('/auth/refresh', request);
      
      console.log('✅ Refresh API response received');
      const { accessToken, refreshToken } = response.data;
      
      console.log('🔑 New Access Token:', accessToken ? `YES (${accessToken.substring(0, 30)}...)` : 'NO');
      console.log('🔑 New Refresh Token:', refreshToken ? `YES (${refreshToken.substring(0, 30)}...)` : 'NO');
      
      // Update tokens
      console.log('💾 Updating tokens in localStorage...');
      tokenManager.setTokens(accessToken, refreshToken);
      
      console.log('✅ Tokens updated successfully');
      console.log('🔄 ======================== AUTH SERVICE: REFRESH TOKEN END ========================\n');
      
      return response.data;
    } catch (error) {
      console.log('❌ Token refresh failed!');
      console.log('💥 Error:', error);
      console.log('🗑️ Clearing tokens...');
      tokenManager.clearTokens();
      console.log('❌ ======================== AUTH SERVICE: REFRESH TOKEN ERROR ========================\n');
      throw handleApiError(error);
    }
  },

  // Get current user
  async getCurrentUser(): Promise<UserDto> {
    console.log('👤 ======================== AUTH SERVICE: GET CURRENT USER ========================');
    console.log('🔑 Access Token:', tokenManager.getAccessToken() ? 'EXISTS' : 'MISSING');
    
    try {
      console.log('🚀 Calling /auth/me API...');
      const response = await apiClient.get<UserDto>('/auth/me');
      
      console.log('✅ User data received');
      console.log('👤 User:', response.data.email, '- Role:', response.data.role);
      console.log('👤 ======================== AUTH SERVICE: GET CURRENT USER END ========================\n');
      
      return response.data;
    } catch (error) {
      console.log('❌ Failed to get current user');
      console.log('💥 Error:', error);
      console.log('❌ ======================== AUTH SERVICE: GET CURRENT USER ERROR ========================\n');
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
  isAuthenticated(): boolean {
    return !!tokenManager.getAccessToken();
  },
};
