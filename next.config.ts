import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Support for PDF viewing with react-pdf
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  // Add proper Content Security Policy for PDF worker
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};

export default nextConfig;