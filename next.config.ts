import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/crm',
        destination: 'http://localhost:3001/crm',
      },
      {
        source: '/crm/:path*',
        destination: 'http://localhost:3001/crm/:path*',
      },
    ];
  },
};

export default nextConfig;
