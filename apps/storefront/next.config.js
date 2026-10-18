/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@gcp/contracts",
    "@gcp/domain",
    "@gcp/database",
    "@gcp/ui",
    "@gcp/animation-engine",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return config;
  },
};

module.exports = nextConfig;
