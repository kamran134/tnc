'use client';

import { createContext, useContext, ReactNode } from 'react';
import { UserDto } from '@/types/api';

/**
 * Контекст для dashboard с данными пользователя
 */
interface DashboardContextType {
  user: UserDto;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardClientWrapper');
  }
  return context;
}

interface DashboardClientWrapperProps {
  user: UserDto;
  children: ReactNode;
}

/**
 * Client wrapper для dashboard
 * Предоставляет данные пользователя через контекст
 */
export default function DashboardClientWrapper({
  user,
  children,
}: DashboardClientWrapperProps) {
  return (
    <DashboardContext.Provider value={{ user }}>
      {children}
    </DashboardContext.Provider>
  );
}
