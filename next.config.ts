import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Support for PDF viewing with react-pdf
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;