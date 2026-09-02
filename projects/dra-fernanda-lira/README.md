# Dra. Fernanda Lira — Landing

Site premium para **Dra. Fernanda Lira**, especialista em limpeza de pele.

- Instagram: [@drafernandaliraaa](https://www.instagram.com/drafernandaliraaa)

## Dev

```bash
npm install
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Antes do deploy

Edite `src/data/site.ts` e confirme:

- WhatsApp (número + mensagem padrão)
- Cidade e endereço do consultório
- CRM / registro profissional

Para atualizar fotos e captions do Instagram:

```bash
python3 .cursor/skills/frontend/instagram-extract/references/extract.py \
  drafernandaliraaa \
  --out projects/dra-fernanda-lira/public
cp projects/dra-fernanda-lira/public/instagram/meta.json \
  projects/dra-fernanda-lira/src/data/instagram-meta.json
```

## Deploy

Importe a pasta no Vercel ou conecte um repositório dedicado.
