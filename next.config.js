/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/king-limuel-properties2' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/king-limuel-properties2' : '',
}

module.exports = nextConfig


