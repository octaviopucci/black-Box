# Deploy NA Veículos (Netlify)

Preview standalone na raiz do domínio Netlify (sem `/na-veiculos/`).

## CLI (com token — domínio fixo `na-veiculos.netlify.app`)

```bash
cd projects/na-veiculos
npm ci
NEXT_BASE_PATH= npm run build
npx netlify-cli deploy --dir=out --prod --auth "$NETLIFY_AUTH_TOKEN" --site-name na-veiculos
```

Senha HTTP Basic: **Site** (usuário: `site`)

## Sem token (Drop anônimo ~60 min)

```bash
cd projects/na-veiculos
npm ci && NEXT_BASE_PATH= npm run build
npx netlify-cli deploy --dir=out --allow-anonymous --message "NA Veículos preview"
```

Senha Drop: `My-Drop-Site` · HTTP Basic: usuário `site` / senha `Site`
