/** @type {import('next').NextConfig} */
const API_HOST = process.env.NEXT_PUBLIC_API_HOST || 'localhost'
const API_PORT = process.env.NEXT_PUBLIC_API_PORT || '5000'
const API_PROTOCOL = API_HOST === 'localhost' ? 'http' : 'https'

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: API_PROTOCOL,
        hostname: API_HOST,
        port: API_PORT,
        pathname: '/uploads/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ]
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
}

export default nextConfig
