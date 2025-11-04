'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, UserDto } from '@/lib/api';

interface AuthContextType {
  user: UserDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    console.log('🔄 ======================== AUTH CONTEXT: LOAD USER ========================');
    console.log('🔍 Checking authentication status...');
    
    try {
      if (authService.isAuthenticated()) {
        console.log('✅ User is authenticated - fetching user data...');
        const currentUser = await authService.getCurrentUser();
        console.log('✅ User data loaded:', currentUser.email);
        setUser(currentUser);
      } else {
        console.log('⚠️ User is NOT authenticated');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Failed to load user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log('🔄 ======================== AUTH CONTEXT: LOAD USER END ========================\n');
    }
  };

  const login = async (email: string, password: string) => {
    console.log('🔐 ======================== AUTH CONTEXT: LOGIN ========================');
    console.log('📧 Email:', email);
    
    setIsLoading(true);
    try {
      console.log('🚀 Calling authService.login...');
      await authService.login({ email, password });
      
      console.log('✅ Login successful - fetching user data...');
      const currentUser = await authService.getCurrentUser();
      
      console.log('✅ User data fetched:', currentUser.email);
      setUser(currentUser);
      console.log('🔐 ======================== AUTH CONTEXT: LOGIN SUCCESS ========================\n');
    } catch (error) {
      console.error('❌ Login failed:', error);
      setUser(null);
      console.log('🔐 ======================== AUTH CONTEXT: LOGIN ERROR ========================\n');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('🚪 ======================== AUTH CONTEXT: LOGOUT ========================');
    
    setIsLoading(true);
    try {
      console.log('🚀 Calling authService.logout...');
      await authService.logout();
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
      console.log('🚪 ======================== AUTH CONTEXT: LOGOUT END ========================\n');
    }
  };

  const refreshUser = async () => {
    console.log('🔄 ======================== AUTH CONTEXT: REFRESH USER ========================');
    
    try {
      if (authService.isAuthenticated()) {
        console.log('✅ User is authenticated - refreshing user data...');
        const currentUser = await authService.getCurrentUser();
        console.log('✅ User data refreshed:', currentUser.email);
        setUser(currentUser);
      } else {
        console.log('⚠️ User is NOT authenticated');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Failed to refresh user:', error);
      setUser(null);
    } finally {
      console.log('🔄 ======================== AUTH CONTEXT: REFRESH USER END ========================\n');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
