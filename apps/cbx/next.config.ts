import type { NextConfig } from 'next'

const basePath = process.env.NEXT_BASE_PATH || ''
/** Static Black Box demo — no API routes. Server mode when unset. */
const isStatic = process.env.CBX_STATIC === '1' || Boolean(basePath)

const nextConfig: NextConfig = {
  ...(isStatic ? { output: 'export' as const } : {}),
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_USE_API: isStatic ? '0' : '1',
  },
  reactStrictMode: true,
}

export default nextConfig
