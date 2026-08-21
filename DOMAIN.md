# Domínio — lpgestor.com.br

## 1. Vercel — novo projeto

1. [vercel.com/new](https://vercel.com/new) → Import **octaviopucci/lpgestor**
2. Framework: **Other**
3. Build: `npm run vercel-build` · Output: `dist`
4. **Settings → Domains** → Add `lpgestor.com.br` e `www.lpgestor.com.br`
5. **Storage → Blob** → conectar ao projeto (`BLOB_STORE_ID`)

## 2. Hostinger — DNS

| Tipo | Nome | Valor |
|------|------|--------|
| **A** | `@` | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

Apague AAAA conflitantes no `@`. Salve e aguarde propagação.

## 3. Validar

```bash
curl -s https://lpgestor.com.br/api/lp-motors/health
```

Esperado: `"blob": true`
