# Domínio — lpgestor.com.br

O app LP Motors Gestor pode ser acessado em:

| URL | Uso |
|-----|-----|
| **https://lpgestor.com.br/** | Produção (domínio do cliente) |
| **https://lpgestor.com.br/cadastro** | Cadastro de loja |
| **https://lpgestor.com.br/login** | Login |
| https://blckbox.vercel.app/lp-motors/ | Demo / monorepo Black Box |

A API continua em **`/api/lp-motors/*`** no mesmo domínio (sync, FIPE, login).

---

## 1. Vercel — adicionar domínio

1. Abra o projeto **black-box-wv6v** no [Vercel Dashboard](https://vercel.com).
2. **Settings → Domains → Add**
3. Adicione:
   - `lpgestor.com.br`
   - `www.lpgestor.com.br` (opcional — redireciona para o apex)
4. A Vercel mostra os registros DNS necessários.

---

## 2. Registro.br — DNS

No painel do domínio **lpgestor.com.br** → **DNS**:

### Opção A — Apex (recomendado)

| Tipo | Nome | Valor |
|------|------|--------|
| **A** | `@` (vazio) | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

### Opção B — Só CNAME (se o registrador permitir ALIAS/ANAME no apex)

Use o que a Vercel indicar na tela de Domains (pode variar).

---

## 3. SSL

A Vercel emite **HTTPS automático** (Let's Encrypt) assim que o DNS propagar (minutos a 48h).

---

## 4. Validar

```bash
curl -sI https://lpgestor.com.br/ | head -5
curl -s https://lpgestor.com.br/api/lp-motors/health
```

Esperado: HTTP 200 e `"blob": true` na health.

---

## 5. Redeploy

Após merge do build `lpgestor/` na `main`, faça **Redeploy** em Production na Vercel se o domínio já estiver apontado.

---

## Build técnico (monorepo)

- `npm run build:lp-motors-domain` — gera `dist-domain` com `VITE_BASE=/`
- Publicado em `public/lpgestor/` no deploy
- `vercel.json` roteia host `lpgestor.com.br` → pasta `lpgestor`
