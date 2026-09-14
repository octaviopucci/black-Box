import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const basePath = process.env.NEXT_BASE_PATH || "";
const staticExport = process.env.MESAFLOW_STATIC_EXPORT === "1";
const dir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" } : {}),
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX || "",
  },
  images: { unoptimized: true },
  outputFileTracingRoot: path.join(dir, "../.."),
};

export default nextConfig;
