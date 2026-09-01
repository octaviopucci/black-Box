import type { NextConfig } from "next";

const isGhPages = process.env.GITHUB_PAGES === "true";
const ghBasePath = "/black-Box";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGhPages ? ghBasePath : "",
  assetPrefix: isGhPages ? `${ghBasePath}/` : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.base44.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
