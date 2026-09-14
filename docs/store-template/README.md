# Store template — replicar lojas sem refazer o motor

Kit para abrir novas lojas (mesmo deploy Vercel) mantendo o fluxo **gestor → estoque → site automático**.

## Documentos

| Arquivo | Para quê |
|---------|----------|
| [MOTOR-CONTRATO.md](./MOTOR-CONTRATO.md) | O que não pode quebrar (estoque → vitrine) |
| [DEPLOY-CHECKLIST.md](./DEPLOY-CHECKLIST.md) | Passo a passo Vercel, Blob, seed, validação |

## Criar nova loja (irmã do W-Tube)

Na raiz do monorepo:

```bash
npm run new:store -- \
  --slug moda-bella \
  --name "Moda Bella" \
  --whatsapp 5511999887766
```

Opções:

| Flag | Descrição |
|------|-----------|
| `--slug` | Identificador kebab-case (ex.: `moda-bella`) |
| `--name` | Nome exibido na loja |
| `--whatsapp` | Número com DDI (ex.: `5511...`) |
| `--dry-run` | Mostra o que faria sem criar arquivos |

O script:

1. Copia o projeto `w-tube` → `projects/<slug>/`
2. Ajusta API, paths, Blob, JWT, seed
3. Registra a loja em `projects/iphone-imports/sibling-stores.json`
4. Atualiza `vercel.json` e scripts de build do deploy host
5. Gera `store.manifest.json` e `DEPLOY.md` na nova loja

Depois: siga [DEPLOY-CHECKLIST.md](./DEPLOY-CHECKLIST.md).

## Modelos de deploy

| Modelo | Quando usar | Exemplo |
|--------|-------------|---------|
| **Loja raiz** | Marca principal no `/` | iPhone Imports |
| **Loja irmã** | Outra marca no mesmo domínio | W-Tube em `/w-tube` |

`new:store` cria **loja irmã** (padrão seguro). Loja raiz continua manual — é um deploy diferente.

## O que você personaliza depois

- `src/data/products.ts` e `categories.ts`
- `src/config/store.ts`
- Tema em `src/app/globals.css`
- Logo em `public/brand/` (se existir)

O motor (API + sync + regra de estoque) **não precisa ser tocado**.
