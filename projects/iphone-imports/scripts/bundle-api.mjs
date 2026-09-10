import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['api/_iphone-imports/handler.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'api/iphone-imports.js',
  format: 'cjs',
  sourcemap: true,
  loader: { '.json': 'json' },
})

console.log('api/iphone-imports.js gerado')
