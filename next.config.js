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
  // Включаем instrumentation для runtime env vars
  experimental: {
    instrumentationHook: true,
    serverActions: {
      allowedOrigins: ['tnc.az', 'www.tnc.az'],
    },
    optimizePackageImports: ['@heroicons/react'],
  },
  compiler: {
    // 🔧 ВРЕМЕННО ВКЛЮЧИЛИ ЛОГИ НА ПРОДЕ ДЛЯ ОТЛАДКИ
    // TODO: Вернуть обратно после проверки: removeConsole: process.env.NODE_ENV === 'production',
    removeConsole: false,
  },
  // Отключаем source maps в проде для ускорения сборки
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
