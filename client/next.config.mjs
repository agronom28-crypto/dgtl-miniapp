/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/shop/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/shop/:path*`,
      },
      {
        source: '/api/shop',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/shop`,
      },
      {
        source: '/api/users/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/users/:path*`,
      },
    ];
  },
};

export default nextConfig;
