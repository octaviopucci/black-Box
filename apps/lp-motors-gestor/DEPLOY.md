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

Sem `BLOB_READ_WRITE_TOKEN`, a API grava só em `/tmp` da instância serverless.
Isso **não** funciona entre PC e celular: o health fica `"blob": false` e o app mostra **“Só neste aparelho”**.

### Checklist Vercel Blob

1. Abra o projeto no [Vercel Dashboard](https://vercel.com) (ex.: `blckbox`).
2. **Storage → Create Database → Blob** (plano Hobby tem faixa gratuita).
3. Conecte o Blob Store ao projeto de **Production**.
4. Em **Settings → Environment Variables**, confirme:
   - Nome: `BLOB_READ_WRITE_TOKEN`
   - Escopos: Production (e Preview se quiser testar em preview).
5. **Redeploy** a Production (Deployments → ⋯ → Redeploy). Variável nova não entra no deployment antigo.
6. Valide:
   ```bash
   curl -s https://blckbox.vercel.app/api/lp-motors/health
   ```
   Esperado: `"blob": true`.
7. No app (**Configurações → Sincronização**), toque **Sincronizar agora**.
   O indicador deve mudar de **Só neste aparelho** para **Sincronizado**.

### Placa → FIPE (caminho barato recomendado)

Não há API pública gratuita de **placa → carro**. A **FIPE** (preço) já é gratuita no app.

**Receita barata:** API Placas (WDAPI2, ~R$ 0,03/consulta) + FIPE Parallelum (grátis).

1. Cadastre / compre créditos em [apiplacas.com.br/contratar.php](https://apiplacas.com.br/contratar.php).
2. Copie o **token** no painel do usuário.
3. No Vercel → **Settings → Environment Variables** (Production):
   - `LP_MOTORS_PLATE_API_TOKEN` = seu token  
   - (opcional) `LP_MOTORS_PLATE_API_URL` = `https://wdapi2.com.br/consulta/{plate}/{token}`  
     Se omitir a URL e só colocar o token, o app já usa esse endpoint WDAPI.
4. **Redeploy** a Production.
5. Valide:
   ```bash
   curl -s https://blckbox.vercel.app/api/lp-motors/health
   ```
   Esperado: `"plateProvider": "wdapi"` e `"plateApi": true`.
6. No app → **FIPE** → digite a placa → marca/modelo vêm da WDAPI e o valor FIPE é resolvido de graça.

#### Alternativa premium (mais cara)

- `LP_MOTORS_PLACAFIP_TOKEN` — [PlacaFIPE](https://placafipe.com.br) (~R$ 0,60+/consulta), FIPE já vem no pacote.
- Se os dois tokens existirem, PlacaFIPE tem prioridade.

### Status no app

| Status na UI            | Significado                                      |
|-------------------------|--------------------------------------------------|
| Só neste aparelho       | API ok, Blob ausente — dados locais              |
| Sincronizado            | Blob ativo — PC e celular compartilham a base    |
| Offline                 | `/api/lp-motors` inacessível                     |
| Erro de sync            | Auth/conflito/falha no push                      |
