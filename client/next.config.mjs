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
            {
        source: '/api/staking/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/staking/:path*`,
      },
      {
        source: '/api/staking',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/staking`,
      },
      {
        source: '/api/stars/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/stars/:path*`,
      },
      {
        source: '/api/minerals/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/minerals/:path*`,
      },
      {
        source: '/api/levels/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/levels/:path*`,
      },
    ];
  },
};

export default nextConfig;
