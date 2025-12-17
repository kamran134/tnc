/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Разрешаем все локальные домены для разработки
    domains: ['localhost', '127.0.0.1'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/api/files/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8080',
        pathname: '/api/files/**',
      },
      {
        protocol: 'https',
        hostname: 'tnc.az',
        pathname: '/api/files/**',
      },
      {
        protocol: 'https',
        hostname: '*.tnc.az',
        pathname: '/api/files/**',
      },
    ],
    // Разрешаем локальные паттерны для проксированных изображений
    unoptimized: false,
  },
  // Rewrites НЕ НУЖНЫ для клиентских запросов
  // Клиент идет напрямую на https://tnc.az/api
  // Только /api/auth/login обрабатывается Next.js API route для установки cookies
  // Включаем standalone output для Docker оптимизации
  output: 'standalone',
  // Включаем instrumentation для runtime env vars
  experimental: {
    instrumentationHook: true,
    serverActions: {
      allowedOrigins: ['tnc.az', 'www.tnc.az'],
    },
    optimizePackageImports: ['@heroicons/react'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    // removeConsole: false, // Временно включаем для отладки
  },
  // Отключаем source maps в проде для ускорения сборки
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
