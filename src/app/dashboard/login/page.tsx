'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    setError('');

    try {
      console.log('========================================================================');
      console.log('🔐 CLIENT: ==================== LOGIN START ====================');
      console.log('⏰ Time:', new Date().toISOString());
      console.log('📧 Email:', formData.email);
      console.log('🌐 Current URL:', window.location.href);
      console.log('🍪 Cookies BEFORE login:', document.cookie);
      console.log('🚀 Sending POST to /api/auth/login...');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // ВАЖНО! Для cookies
      });

      console.log('📥 CLIENT: Response received!');
      console.log('📥 Status:', response.status, response.statusText);
      console.log('📥 Response headers:');
      const headers = Object.fromEntries(response.headers.entries());
      Object.keys(headers).forEach(key => {
        console.log(`   ${key}: ${headers[key]}`);
      });
      console.log('🍪 Cookies AFTER response:', document.cookie);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ CLIENT: Login successful!');
        console.log('📦 Response data:', JSON.stringify(data, null, 2));
        console.log('🔑 Access token:', data.accessToken ? `EXISTS (${data.accessToken.substring(0, 30)}...)` : '❌ MISSING');
        console.log('🔑 Refresh token:', data.refreshToken ? `EXISTS (${data.refreshToken.substring(0, 30)}...)` : '❌ MISSING');
        
        if (!data.accessToken) {
          console.error('❌ CLIENT: ERROR - No access token in response!');
          console.log('🔐 CLIENT: ==================== LOGIN FAILED (NO TOKEN) ====================');
          console.log('========================================================================\n');
          setError('Ошибка: токен не получен');
          setIsLoading(false);
          return;
        }
        
        // НЕ сохраняем в localStorage - используем только HTTP-only cookies!
        console.log('✅ Tokens received, cookies should be set by server');
        
        // Проверяем cookies после установки
        console.log('🍪 Checking cookies after login...');
        console.log('🍪 document.cookie:', document.cookie);
        
        // Небольшая задержка чтобы cookies точно установились
        console.log('⏳ Waiting 500ms for cookies to be set...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('🍪 Cookies after 500ms delay:', document.cookie);
        console.log('🔄 Redirecting to /dashboard...');
        console.log('🔐 CLIENT: ==================== LOGIN SUCCESS ====================');
        console.log('========================================================================\n');
        
        // Используем window.location для полной перезагрузки и применения cookies
        window.location.href = '/dashboard';
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ CLIENT: Login failed:', errorData);
        setError(errorData.message || 'Ошибка входа');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('💥 CLIENT: Login error:', error);
      setError('Ошибка сети: ' + (error instanceof Error ? error.message : String(error)));
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <span className="text-2xl font-bold text-white">T</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TnC Admin</h1>
          <p className="text-gray-600">Tax & Consulting Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">Please sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 placeholder:text-gray-400"
                  placeholder="admin@tnc.az"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 placeholder:text-gray-400"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="ml-2 text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
            ← Back to Home
          </Link>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>This is a secure admin area. All actions are logged.</p>
        </div>
      </div>
    </div>
  );
}
