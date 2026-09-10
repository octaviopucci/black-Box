import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['api/_w-tube/handler.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'api/w-tube.js',
  format: 'cjs',
  sourcemap: true,
  loader: { '.json': 'json' },
})

console.log('api/w-tube.js gerado')
