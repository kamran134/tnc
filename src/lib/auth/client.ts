/**
 * Client-side authentication service
 * Работает через Next.js API routes, которые управляют HTTP-only cookies
 */

import { UserDto, LoginRequest } from '@/types/api';

class AuthService {
  /**
   * Логин через API route
   */
  async login(credentials: LoginRequest): Promise<UserDto> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include', // Важно для cookies
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || 'Invalid credentials');
    }

    const data = await response.json();
    return data.user;
  }

  /**
   * Logout через API route
   */
  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Не пробрасываем ошибку, чтобы logout всегда работал на клиенте
    }
  }

  /**
   * Получить текущего пользователя через API route
   */
  async getCurrentUser(): Promise<UserDto> {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Not authenticated');
    }

    return response.json();
  }

  /**
   * Проверка авторизации (проверяем возможность получить пользователя)
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Refresh token через API route
   */
  async refreshToken(): Promise<void> {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
  }
}

export const authService = new AuthService();
