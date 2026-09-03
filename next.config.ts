import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
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
    }
    
    // In production, fallback to index.html for client-side routing
    return [
      {
        source: '/crm',
        destination: '/crm/index.html',
      },
      {
        source: '/crm/:path*',
        destination: '/crm/index.html',
      },
    ];
  },
};

export default nextConfig;
