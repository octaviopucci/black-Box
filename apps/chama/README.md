# chama

Clone funcional de marketing por chat (estilo Manychat).

## Rodar

```bash
npm run dev:chama
# ou
npm --prefix apps/chama run dev
```

Login demo: qualquer e-mail/senha (pré-preenchido `ana@chama.app`).

## Recursos

- Landing + autenticação
- Dashboard, Inbox ao vivo, Contatos
- Flow Builder visual (arrastar nós, salvar)
- Automações (keyword / comentário / story / welcome)
- **Instagram ao vivo** via Meta Graph API (OAuth + webhook + Private Reply)
- Broadcasts com envio simulado
- Analytics, Canais, Growth tools
- Simulador de gatilhos
- Persistência em `localStorage` + store servidor (Blob)

## Instagram real (Meta)

Secrets na Vercel:

- `CHAMA_META_APP_ID`
- `CHAMA_META_APP_SECRET`
- `CHAMA_META_VERIFY_TOKEN`
- `BLOB_READ_WRITE_TOKEN` (recomendado)

No App Meta:

1. Redirect OAuth: `https://blckbox.vercel.app/api/chama/oauth/callback`
2. Webhook: `https://blckbox.vercel.app/api/chama/webhook`
3. Conta Instagram Professional ligada a uma Página Facebook
4. Em **Canais** → **Conectar Instagram com Meta**
5. Em **Automações**, keywords (ex: `EU QUERO`) + Sync Instagram

Quando alguém comentar a keyword no post, o chama envia DM automática (Private Reply).
