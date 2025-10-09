/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL
let remotePatterns = []
try {
  if (supabaseUrl) {
    const { host } = new URL(supabaseUrl)
    if (host) {
      remotePatterns.push({ protocol: 'https', hostname: host })
    }
  }
} catch (e) {
  // ignore invalid URL
}

const nextConfig = {
  // output: 'export', // Commented out to enable API routes for email functionality
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns,
  },
  // Remove GitHub Pages specific configurations for Netlify
}

module.exports = nextConfig


