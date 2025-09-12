/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
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
