# PIX Gateway (próprio)

Gateway PIX **multi-conta / multi-chave** para uso próprio, no estilo de um PSP — com **confirmação automática** via webhook Asaas + reconciliação periódica.

> Pix real é liquidado pelo Bacen através do Asaas (PSP). Sua API é a camada própria que orquestra várias contas, padroniza o contrato e atualiza status sozinha.

## Por que Asaas?

É o caminho **mais fácil** com confirmação automática:

- API key simples
- Cobrança PIX + QR / copia-e-cola
- Webhook quando o pagamento cai (`PAYMENT_RECEIVED` / `PAYMENT_CONFIRMED`)

Sem PSP, não existe como saber automaticamente que o Pix foi pago.

## Stack

- Node 22 + TypeScript + Fastify
- SQLite (`node:sqlite`)
- Provider: **Asaas** (sandbox ou produção)
- Auth: `X-Api-Key` / `Bearer`

## Subir

```bash
cd apps/pix-gateway
cp .env.example .env
# edite PIX_GATEWAY_API_KEY
npm install
npm run dev
```

API em `http://localhost:8787`.

Do monorepo:

```bash
npm run dev:pix
```

## Fluxo automático

```
1. Cadastre N contas Asaas (API keys diferentes)
2. (Opcional) Cadastre chaves PIX como rótulos/organização
3. Crie cobrança → gateway escolhe a conta → Asaas gera QR
4. Cliente paga
5. Asaas chama seu webhook → status vira paid
6. Se o webhook falhar, a reconciliação (30s) consulta o Asaas e atualiza
```

## 1) Criar conta (Asaas)

```bash
curl -s -X POST http://localhost:8787/v1/accounts \
  -H "X-Api-Key: SUA_CHAVE_GATEWAY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Conta Pessoal 1",
    "apiKey": "$aact_hmlg_...",
    "apiUrl": "https://api-sandbox.asaas.com",
    "webhookToken": "um-segredo-forte"
  }'
```

A resposta traz `webhookUrl`, por exemplo:

`https://SEU_DOMINIO/v1/webhooks/asaas/acc_xxx`

No painel Asaas → **Integrações → Webhooks**, cadastre essa URL e o mesmo `webhookToken`.  
Eventos: `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED` (e opcionalmente estorno).

Repita para cada conta. Cada uma tem sua API key e sua webhook URL.

### Produção Asaas

Use `"apiUrl": "https://api.asaas.com"` e a API key de produção.

## 2) (Opcional) Registrar chaves PIX

Serve para organizar / forçar conta por chave. A liquidação continua no Asaas da conta.

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

## 3) Criar cobrança

```bash
curl -s -X POST http://localhost:8787/v1/charges \
  -H "X-Api-Key: SUA_CHAVE_GATEWAY" \
  -H "Idempotency-Key: pedido-1001" \
  -H "Content-Type: application/json" \
  -d '{
    "amountCents": 15000,
    "description": "Serviço X",
    "routing": "round_robin",
    "customerName": "Cliente",
    "customerCpfCnpj": "24971563792"
  }'
```

Resposta inclui `copyPaste`, `qrCodeBase64` e `status: "pending"`.

### Roteamento

| `routing` | Comportamento |
|-----------|----------------|
| `explicit` | Exige `accountId` |
| `round_robin` | Alterna contas ativas (padrão) |
| `least_used_today` | Usa a conta com menos cobranças no dia |

Também pode forçar: `"accountId": "acc_xxx"` ou `"pixKeyId": "key_xxx"`.

### Customer

O Asaas exige cliente. Opções:

1. Enviar `customerCpfCnpj` (e opcionalmente nome/email) em cada cobrança  
2. Ou cadastrar `defaultCustomerId` na conta:

```json
{
  "name": "Conta 1",
  "apiKey": "...",
  "defaultCustomerId": "cus_000005..."
}
```

## 4) Consultar status (já automático via webhook)

```bash
curl -s http://localhost:8787/v1/charges/chg_xxx \
  -H "X-Api-Key: SUA_CHAVE_GATEWAY"
```

Fallback explícito (o reconciler já faz isso sozinho):

```bash
curl -s -X POST http://localhost:8787/v1/charges/chg_xxx/sync \
  -H "X-Api-Key: SUA_CHAVE_GATEWAY"
```

## Endpoints

| Método | Rota | Auth |
|--------|------|------|
| GET | `/health` | pública |
| POST | `/v1/accounts` | API key |
| GET | `/v1/accounts` | API key |
| POST | `/v1/accounts/:id/keys` | API key |
| GET | `/v1/accounts/:id/keys` | API key |
| GET | `/v1/keys` | API key |
| POST | `/v1/charges` | API key |
| GET | `/v1/charges` | API key |
| GET | `/v1/charges/:id` | API key |
| POST | `/v1/charges/:id/sync` | API key |
| POST | `/v1/webhooks/asaas` | token Asaas |
| POST | `/v1/webhooks/asaas/:accountId` | token Asaas |

## Segurança

- Não committe `.env` nem API keys Asaas
- Use `webhookToken` por conta
- Exponha a API só na sua rede/VPS com HTTPS
- Troque `PIX_GATEWAY_API_KEY` por um segredo longo
- Webhooks precisam de URL pública (túnel `cloudflared`/`ngrok` em dev)

## Testes

```bash
cd apps/pix-gateway && npm test
```

## Limite importante

Isto é para **uso próprio** com contas Asaas suas. Operar Pix para terceiros como se fosse um gateway comercial exige autorização de PSP no Bacen.
