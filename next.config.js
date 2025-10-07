/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Commented out to enable API routes for email functionality
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Remove GitHub Pages specific configurations for Netlify
}

module.exports = nextConfig


