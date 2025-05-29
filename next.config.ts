import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Support for PDF viewing with react-pdf
  webpack: (config) => {
    // Disable canvas for react-pdf
    config.resolve.alias.canvas = false;
    
    // Configure worker loaders properly
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    
    // Add specific rule to handle PDF worker
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js/,
      type: 'asset/resource',
    });
    
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
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

export default nextConfig;