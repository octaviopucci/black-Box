import { cpSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = '.vercel/output'

mkdirSync(join(root, 'static'), { recursive: true })
mkdirSync(join(root, 'functions/api/iphone-imports.func'), { recursive: true })

cpSync('out', join(root, 'static'), { recursive: true })
cpSync('api/iphone-imports.js', join(root, 'functions/api/iphone-imports.func/index.js'))

writeFileSync(
  join(root, 'config.json'),
  JSON.stringify(
    {
      version: 3,
      routes: [
        { src: '/api/iphone-imports', dest: '/api/iphone-imports?path=health' },
        { src: '/api/iphone-imports/(.*)', dest: '/api/iphone-imports?path=$1' },
        { handle: 'filesystem' },
        { src: '/gestor', dest: '/gestor/index.html' },
        { src: '/gestor/(.*)', dest: '/gestor/index.html' },
      ],
    },
    null,
    2,
  ),
)

console.log('.vercel/output gerado (static + api/iphone-imports.func)')
