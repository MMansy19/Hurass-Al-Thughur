import type { Configuration as WebpackConfig } from "webpack";
import type { NextConfig } from "next/dist/server/config-shared";

const nextConfig: NextConfig = {
  // Support for PDF viewing with react-pdf
  webpack: (config: WebpackConfig) => {
    // Ensure resolve and alias exist
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};
    
    // Disable canvas for react-pdf (using type assertion to handle the complex type)
    (config.resolve.alias as Record<string, any>)['canvas'] = false;
    
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