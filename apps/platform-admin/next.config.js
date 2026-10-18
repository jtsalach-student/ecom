/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@gcp/contracts",
    "@gcp/domain",
    "@gcp/database",
    "@gcp/ui",
  ],
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return config;
  },
};

module.exports = nextConfig;
