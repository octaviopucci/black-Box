# Publicar no GitHub (5 minutos)

O código já está pronto localmente. Falta **criar o repositório vazio** na sua conta e fazer o push.

## Passo 1 — Criar repo vazio

Abra (já preenche nome e descrição):

**https://github.com/new?name=lpgestor&description=LP+Gestor+%E2%80%94+gest%C3%A3o+de+estoque+para+lojas+de+ve%C3%ADculos**

- Owner: **octaviopucci**
- Public
- **Não** marque README, .gitignore nem license (repo vazio)

Clique em **Create repository**.

## Passo 2 — Push do código local

No terminal, na pasta do monorepo black-Box:

```bash
cd lpgestor
git branch -M main
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/octaviopucci/lpgestor.git
git push -u origin main
```

Se pedir autenticação, use seu token GitHub ou `gh auth login`.

## Passo 3 — Vercel (projeto novo)

1. https://vercel.com/new → import **octaviopucci/lpgestor**
2. Framework: **Other** · Build: `npm run vercel-build` · Output: `dist`
3. **Storage → Blob** → conectar ao projeto
4. **Settings → Domains** → `lpgestor.com.br` e `www.lpgestor.com.br`

## Passo 4 — DNS Hostinger (só depois do Vercel)

| Tipo | Nome | Valor |
|------|------|--------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Detalhes: [DOMAIN.md](./DOMAIN.md)

## Validar

```bash
curl -s https://lpgestor.com.br/api/lp-motors/health
```

Esperado: `"blob": true`

---

## Atualizar o standalone depois (sync do monorepo)

```bash
node scripts/publish-lpgestor.mjs
```
