# Repositório standalone — lpgestor

O produto existe como **repositório próprio** para deploy em `lpgestor.com.br`.

## Primeira publicação

1. Gere/atualize a pasta local: `node scripts/publish-lpgestor.mjs`
2. Siga **`lpgestor/GITHUB-SETUP.md`** (criar repo vazio + push + Vercel)

Repo alvo: **https://github.com/octaviopucci/lpgestor**

## Atualizar o repo standalone a partir do monorepo

```bash
node scripts/publish-lpgestor.mjs
cd lpgestor && git push
```

## Quando usar qual

| | black-Box (monorepo) | lpgestor (standalone) |
|--|----------------------|------------------------|
| URL | blckbox.vercel.app/lp-motors/ | lpgestor.com.br |
| Domínio cliente | Rewrite por host | Nativo na raiz |
| Outros produtos | Sim (Maciel, portal…) | Só LP Gestor |

Para domínio **lpgestor.com.br**, use o repo **lpgestor** + projeto Vercel dedicado.
