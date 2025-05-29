import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Support for PDF viewing with react-pdf
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  
  // Configure supported locales
  i18n: {
    locales: ["ar", "en"],
    defaultLocale: "ar",
    // localeDetection: true,
  },
};

export default nextConfig;
