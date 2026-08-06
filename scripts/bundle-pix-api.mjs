import { build } from 'esbuild'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

const outfile = join(process.cwd(), 'api/_pix_gateway.cjs')
mkdirSync(dirname(outfile), { recursive: true })

await build({
  entryPoints: [join(process.cwd(), 'apps/pix-gateway/src/serverless.ts')],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  outfile,
  sourcemap: false,
  external: ['@vercel/blob'],
  logLevel: 'info',
})

console.log('bundled', outfile)
