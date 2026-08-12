# Deploy — LP Motors Gestor

## Credenciais iniciais

- **Login:** `admin` / `LPMotors123`
- **Gerente:** `gerente` / `gerente123`

## Netlify (app isolado)

```bash
cd apps/lp-motors-gestor
npm ci
npm run build
```

Publique a pasta `dist`.

## Monorepo Vercel

```bash
npm run build:lp-motors
npm run build:lp-motors-x
```

Rotas:

- `/lp-motors/`
- `/lp-motors-x/`
- `/api/lp-motors/*` — sync multi-dispositivo + FIPE

Não altera o Maciel Motors (`/maciel-motors/`), que continua sendo publicado em paralelo.

---

## Sync multi-dispositivo (obrigatório em produção)

Sem Blob, a API grava só em `/tmp` da instância serverless.
Isso **não** funciona entre PC e celular: o health fica `"blob": false` e o app mostra **“Só neste aparelho”**.

### Checklist Vercel Blob

1. Abra o projeto no [Vercel Dashboard](https://vercel.com) (ex.: `blckbox`).
2. **Storage → Create Database → Blob** (plano Hobby tem faixa gratuita).
3. Conecte o Blob Store ao projeto (**Show Connections** → Production + Preview).
4. Em **Settings → Environment Variables**, o suficiente hoje é:
   - `BLOB_STORE_ID` (modo OIDC moderno da Vercel) **ou**
   - `BLOB_READ_WRITE_TOKEN` (token clássico, opcional)
5. **Redeploy** a Production (Deployments → ⋯ → Redeploy).
6. Valide:
   ```bash
   curl -s https://blckbox.vercel.app/api/lp-motors/health
   ```
   Esperado: `"blob": true` (e `"blobAuth": "oidc"` ou `"token"`).
7. No app (**Configurações → Sincronização**), toque **Sincronizar**.
   O indicador deve mudar de **Só neste aparelho** para **Sincronizado**.

#### Se quiser o token clássico mesmo assim

No Blob → aba **Settings** / **Tokens** (ou `.env.local`), copie `BLOB_READ_WRITE_TOKEN` e cole em Environment Variables. Com o app atual, **não é obrigatório** se `BLOB_STORE_ID` já existir.

### Opcional — placa automática

- `LP_MOTORS_PLATE_API_URL` — endpoint externo de consulta por placa (não há API pública estável gratuita).

### Status no app

| Status na UI            | Significado                                      |
|-------------------------|--------------------------------------------------|
| Só neste aparelho       | API ok, Blob ausente — dados locais              |
| Sincronizado            | Blob ativo — PC e celular compartilham a base    |
| Offline                 | `/api/lp-motors` inacessível                     |
| Erro de sync            | Auth/conflito/falha no push                      |
