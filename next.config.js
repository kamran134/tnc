/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/api/files/**',
      },
      {
        protocol: 'https',
        hostname: '*.tnc.az',
        pathname: '/api/files/**',
      },
    ],
  },
  // Rewrites НЕ НУЖНЫ для клиентских запросов
  // Клиент идет напрямую на https://tnc.az/api
  // Только /api/auth/login обрабатывается Next.js API route для установки cookies
  // Включаем standalone output для Docker оптимизации
  output: 'standalone',
  // Исправляем warning о workspace root
  outputFileTracingRoot: require('path').join(__dirname),
  // Опциональные оптимизации
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Отключаем source maps в проде для ускорения сборки
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
