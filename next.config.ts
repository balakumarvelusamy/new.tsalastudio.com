import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'https://ldnji2rlcc.execute-api.us-east-1.amazonaws.com/:path*',
      },
    ];
  },
};

export default nextConfig;
