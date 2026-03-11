/** @type {import('next').NextConfig} */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const nextConfig = {
  reactStrictMode: true,
    typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    return [
      { source: '/api/shop/:path*', destination: `${API_URL}/api/shop/:path*` },
      { source: '/api/shop', destination: `${API_URL}/api/shop` },
      { source: '/api/users/:path*', destination: `${API_URL}/api/users/:path*` },
      { source: '/api/staking/:path*', destination: `${API_URL}/api/staking/:path*` },
      { source: '/api/staking', destination: `${API_URL}/api/staking` },
      { source: '/api/admin/:path*', destination: `${API_URL}/api/admin/:path*` },
      { source: '/api/admin', destination: `${API_URL}/api/admin` },
      { source: '/api/stars/:path*', destination: `${API_URL}/api/stars/:path*` },
      { source: '/api/minerals/:path*', destination: `${API_URL}/api/minerals/:path*` },
      { source: '/api/levels/:path*', destination: `${API_URL}/api/levels/:path*` },
      { source: '/api/boosts/:path*', destination: `${API_URL}/api/boosts/:path*` },
    ];
  },
};
export default nextConfig;
