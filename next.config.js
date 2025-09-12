/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Включаем standalone output для Docker оптимизации
  output: 'standalone',
  // Опциональные оптимизации
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
}

module.exports = nextConfig
