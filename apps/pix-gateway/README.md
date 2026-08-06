# PIX Gateway (próprio) — modo grátis

Gateway PIX **multi-conta / multi-chave** para uso próprio.

## Modo padrão: `native` (R$ 0)

| O quê | Custo |
|-------|--------|
| Gerar QR / copia-e-cola | **Grátis** |
| Dinheiro cair na **sua** chave Pix | **Grátis** (taxa do seu banco; na maioria PF/PJ digital = R$ 0 para receber) |
| Asaas / outro PSP | **Não usado** |

A API gera o BR Code Bacen com a **sua chave** + valor + `txid`. Quem paga envia Pix direto para você — sem intermediário cobrando ~R$ 2.

### Confirmação automática (ainda grátis)

Quando o Pix chega, o banco precisa **avisar** o gateway (webhook no formato Bacen):

```json
{
  "pix": [
    {
      "txid": "mesmoTxidDoQR",
      "valor": "25.00",
      "horario": "2026-08-06T20:00:00Z",
      "endToEndId": "E..."
    }
  ]
}
```

URL: `POST /v1/webhooks/native/:accountId?token=SEU_TOKEN`

Bancos com API Pix/webhook (ex.: **Inter Empresas**) conseguem apontar o webhook de Pix recebido para essa URL. Sem esse aviso do banco, o QR funciona e o dinheiro cai, mas o status na API não vira `paid` sozinho.

> Resumo: **receber é grátis**. **Saber automaticamente que pagou** depende do webhook do seu banco (também sem taxa de PSP).

## Subir

```bash
cd apps/pix-gateway
cp .env.example .env
npm install
npm run dev
# ou no monorepo: npm run dev:pix
```

## Uso rápido

### 1) Conta grátis

```bash
curl -s -X POST http://localhost:8787/v1/accounts \
  -H "X-Api-Key: SUA_CHAVE_GATEWAY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Conta Nubank",
    "provider": "native",
    "merchantName": "SEU NOME",
    "merchantCity": "SAO PAULO",
    "webhookToken": "um-segredo-forte"
  }'
```

### 2) Suas chaves Pix (várias)

```bash
curl -s -X POST http://localhost:8787/v1/accounts/acc_xxx/keys \
  -H "X-Api-Key: SUA_CHAVE_GATEWAY" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "EVP principal",
    "keyType": "evp",
    "keyValue": "uuid-da-sua-chave"
  }'
```

Repita para CPF, e-mail, telefone, outras contas.

### 3) Cobrança (QR real, taxa 0)

```bash
curl -s -X POST http://localhost:8787/v1/charges \
  -H "X-Api-Key: SUA_CHAVE_GATEWAY" \
  -H "Idempotency-Key: pedido-1" \
  -H "Content-Type: application/json" \
  -d '{
    "amountCents": 15000,
    "description": "Servico",
    "routing": "round_robin"
  }'
```

Use `copyPaste` / `qrCodeBase64`. Status inicia `pending` e vira `paid` quando o webhook chegar com o mesmo `txid`.

### 4) Webhook (automático)

Aponte o webhook de Pix recebido do banco para a `webhookUrl` da conta, ou teste:

```bash
curl -s -X POST "http://localhost:8787/v1/webhooks/native/acc_xxx?token=um-segredo-forte" \
  -H "Content-Type: application/json" \
  -d '{"pix":[{"txid":"TXID_DA_COBRANCA","valor":"150.00","horario":"2026-08-06T20:00:00Z"}]}'
```

## Roteamento entre contas/chaves

| `routing` | Comportamento |
|-----------|----------------|
| `round_robin` | Alterna contas (padrão) |
| `least_used_today` | Conta com menos cobranças no dia |
| `explicit` | Exige `accountId` |

Também: `"pixKeyId": "key_xxx"` ou `"accountId": "acc_xxx"`.

## Asaas (opcional, pago)

Se um dia quiser PSP com webhook pronto: `"provider": "asaas"` + `apiKey` (~R$ 0,99–1,99 por Pix pago). Não é necessário para o modo grátis.

## Testes

```bash
npm test
```

## Limite

Uso **próprio** com **suas** chaves. Operar Pix para terceiros como gateway comercial exige autorização de PSP no Bacen.
