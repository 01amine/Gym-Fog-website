/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'minio',
      },
      {
        protocol: 'http',
        hostname: 'backend',
      },
      // Production - Render backend
      {
        protocol: 'https',
        hostname: '*.onrender.com',
      },
      // Production - S3/Cloud storage
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      // Allow all HTTPS for flexibility
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
