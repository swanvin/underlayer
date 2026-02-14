/** @type {import("next").NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,

  // Silence Next 16 warning when Turbopack is enabled by default
  turbopack: {},

  // Keep devtools off in webpack mode
  webpack: (config) => {
    config.devtool = false;
    return config;
  },
};

module.exports = nextConfig;
