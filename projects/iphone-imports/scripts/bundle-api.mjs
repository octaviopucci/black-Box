import * as esbuild from 'esbuild'
import { mkdirSync } from 'node:fs'

mkdirSync('api/dist', { recursive: true })

await esbuild.build({
  entryPoints: ['api/iphone-imports.ts'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  outfile: 'api/dist/handler.cjs',
  format: 'cjs',
  sourcemap: true,
  external: ['@vercel/blob'],
})

console.log('api/dist/handler.cjs gerado')
