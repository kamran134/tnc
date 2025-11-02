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
  // Включаем standalone output для Docker оптимизации
  output: 'standalone',
  // Исправляем warning о workspace root
  outputFileTracingRoot: require('path').join(__dirname),
  // Опциональные оптимизации
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
}

module.exports = nextConfig
