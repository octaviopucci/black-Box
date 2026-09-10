import { cpSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = '.vercel/output'
const staticDir = join(root, 'static')

mkdirSync(staticDir, { recursive: true })
mkdirSync(join(root, 'functions/api/w-tube.func'), { recursive: true })

// Copia conteúdo de out/ para static/ (não out/ como subpasta)
for (const entry of readdirSync('out')) {
  cpSync(join('out', entry), join(staticDir, entry), { recursive: true })
}
const funcDir = join(root, 'functions/api/w-tube.func')
cpSync('api/w-tube.js', join(funcDir, 'index.js'))
writeFileSync(
  join(funcDir, '.vc-config.json'),
  JSON.stringify({ runtime: 'nodejs22.x', memory: 512, maxDuration: 30 }, null, 2),
)

writeFileSync(
  join(root, 'config.json'),
  JSON.stringify(
    {
      version: 3,
      routes: [
        { src: '/api/w-tube', dest: '/api/w-tube?path=health' },
        { src: '/api/w-tube/(.*)', dest: '/api/w-tube?path=$1' },
        { handle: 'filesystem' },
        { src: '/gestor', dest: '/gestor/index.html' },
        { src: '/gestor/(.*)', dest: '/gestor/index.html' },
      ],
    },
    null,
    2,
  ),
)

console.log('.vercel/output gerado (static + api/w-tube.func)')
