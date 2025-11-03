'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Не проверяем токен на странице логина
    if (pathname === '/dashboard/login') {
      return;
    }

    // Проверяем наличие токена в localStorage
    const token = localStorage.getItem('access_token');
    
    console.log('🔐 Dashboard auth check');
    console.log('Path:', pathname);
    console.log('Token:', token ? 'present' : 'missing');
    
    if (!token) {
      console.log('❌ No token, redirecting to login');
      router.push('/dashboard/login');
    } else {
      console.log('✅ Token found, access granted');
    }
  }, [pathname, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        {children}
      </div>
    </div>
  );
}
