# MesaFlow — Handoff para novo chat

> **Fonte original (produto/negócio):** [ChatGPT — Sistema de Pedidos QR](https://chatgpt.com/share/6aaa139b-ac9c-83e9-98a2-17706fbbfe4d)  
> **Implementação técnica:** monorepo `black-Box` → `projects/mesaflow/` + deploy via `projects/iphone-imports/`  
> **Atualizado em:** 2026-09-16

Use este arquivo como contexto inicial em um novo chat. Cole no prompt:

```
Leia projects/mesaflow/HANDOFF.md e continue de onde paramos.
```

---

## 1. O que é o MesaFlow

**Não é um cardápio digital.** É um **garçom digital + pedidos em tempo real + painel operacional**, focado em:

- Padarias, lanchonetes, restaurantes, bares, cafeterias
- Operação por **mesa/comanda** via **QR Code**
- **Rodízio** como diferencial competitivo
- Produtos com destino operacional (cozinha, balcão, bar, etc.)
- Separação **Vitrine** vs **Cozinha** (produtos expostos vs preparados sob demanda)

### Fluxo principal

```
Cliente → QR na mesa → Web App → Cardápio → Carrinho → Pedido
       → Cozinha/Balcão (KDS) → Status em tempo real → Cliente acompanha
```

### Três experiências

| Experiência | Quem usa | Função |
|-------------|----------|--------|
| **Cliente** | Comensal (sem login) | Cardápio, pedidos, comanda, rodízio, pedir conta |
| **Admin** (`/admin`) | Dono/gerente do **restaurante** | Dashboard, pedidos, mesas, produtos, QR, configurações |
| **Platform admin** (`/platform`) | Dono da **plataforma NA MESA** (Octavio) | Lojistas clientes, planos, métricas SaaS, ativar/suspender contas |
| **KDS** | Cozinha/balcão | Fila de produção por setor |

---

## 2. Modelo comercial (decisões do ChatGPT)

### Posicionamento

- Vender **operação + ticket + menos garçom**, não “PDF com QR”
- Concorrentes (Goomer, Grumi, etc.) focam em totem/cardápio; MesaFlow foca em **mesa + rodízio + kit físico**
- QR Code **não é o produto** — é porta de entrada; o produto é o sistema + implantação

### Planos (estrutura acordada)

| Plano | Preço base | O que inclui (resumo) |
|-------|------------|------------------------|
| **Essencial** | **R$ 997/ano** | Cliente cadastra; até ~10 mesas no kit base; self-service |
| **Premium** | **R$ 1.997/ano** | Implantação assistida; múltiplos estabelecimentos; suporte |
| **Custom** | **a partir de R$ 2.997** | Personalização, integrações, operações complexas (mesa + rodízio + self-service) |

### Upsells recorrentes

- **Mesa adicional:** +R$ 70/ano (Essencial) ou +R$ 50/ano (Premium)
- **Estabelecimento adicional (Premium):** +R$ 500/ano
- Packs de mesas (ex.: +25 mesas por R$ 1.250/ano)

### Kit Mesa (produto físico)

Cada mesa recebe um **Kit MesaFlow** completo. Meta de custo: **R$ 15–20** (teto R$ 25).

| Componente | Detalhe |
|------------|---------|
| **5 QR adesivos** | 2 mesa + 1 cardápio + 2 reserva (identificados, não soltos) |
| **Display A6** | Acrílico transparente tipo T (~R$ 8); arte em adesivo/papel |
| **Cardápio A4** | “Guia da Mesa” (não lista produtos); laminação |
| **Caixa** | Kraft + adesivo MesaFlow (sem caixa custom cara no início) |
| **Cartão de ativação** | QR para painel admin |
| **Manual rápido** | 4 passos: colar QR → display → cardápio → ativar mesa |

**Níveis visuais:** Essencial (MesaFlow domina) → Premium (restaurante ganha espaço) → Custom (identidade do cliente domina).

**Próximo passo físico:** comprar 3–5 modelos de display (A6 T, A6 L) e testar na mesa real antes de comprar em lote.

### Identidade visual

- Cores: fundo escuro + laranja/amarelo (símbolo mesa/Wi-Fi)
- Tagline: **“Seu pedido, sem espera”**
- Logos geradas no ChatGPT (ícone, horizontal, vertical, favicon) — conferir `projects/mesaflow/public/brand/`

---

## 3. Estado técnico atual (implementado no repo)

### Onde vive o código

```
projects/mesaflow/          ← app Next.js (fonte)
projects/iphone-imports/    ← host de deploy unificado (Vercel)
  out/mesaflow/             ← site estático exportado
  api/mesaflow.js           ← serverless handler (esbuild)
  vercel.json               ← rewrites /mesaflow/*
```

### Stack

- Next.js App Router (export estático em produção)
- Store JSON: arquivo local (dev) + Vercel Blob (prod)
- SSE `/api/events` para tempo real
- Multi-tenant por `establishmentId`
- Auth admin: Bearer token; roles `OWNER` / `MANAGER`
- Senhas: bcrypt (migração de SHA-256 legado)

### URLs de produção

| O quê | URL |
|-------|-----|
| Host principal | https://bedois.vercel.app (alias de loja-iphoneimports) |
| Landing | https://bedois.vercel.app/mesaflow/ |
| Cliente demo (Mesa 08) | https://bedois.vercel.app/mesaflow/m/ponto-do-sabor/mesa-8 |
| Admin | https://bedois.vercel.app/mesaflow/admin |
| KDS Cozinha | https://bedois.vercel.app/mesaflow/kds/sec_cozinha |
| API health | https://bedois.vercel.app/api/mesaflow/health |

**Login lojista demo:** `owner@pontodosabor.com` / `demo123`  
**Login platform owner:** `octavio@namesa.io` / `namesa-platform-dev` (ou env `MESAFLOW_PLATFORM_OWNER_*`)  
**Tenant demo:** slug `ponto-do-sabor`

| Área | URL prod | Quem acessa |
|------|----------|-------------|
| Painel do restaurante | `/mesaflow/admin` | Lojista (OWNER/MANAGER) |
| Operação NA MESA | `/mesaflow/platform` | Platform owner apenas |

> ⚠️ `ponto-do-sabor.vercel.app` é projeto Vercel **separado** (landing HTML antiga). MesaFlow **não** está lá.

### Funcionalidades já implementadas

- [x] Landing + cadastro de estabelecimento
- [x] Cardápio cliente (carrinho, variantes, adicionais, toast)
- [x] Pedidos + status + timeline
- [x] KDS por setor
- [x] Rodízio (rodadas)
- [x] Admin: dashboard, pedidos (Kanban), mesas, QR codes
- [x] Admin: **produtos** (CRUD, vitrine/cozinha/ambos)
- [x] Admin: **configurações** do estabelecimento
- [x] Mesas: criar/editar/excluir + QR único por mesa + regenerar QR
- [x] Persistência Vercel Blob (`mesaflow/store.json`)
- [x] UI: scrollbars custom, nav mobile, refinamento visual
- [x] Fotos de produto corrigidas (heurísticas + seed)
- [x] Testes admin CRUD (`npm run test:admin`)

### Pull Requests relevantes

| PR | Branch | Status |
|----|--------|--------|
| [#191](https://github.com/octaviopucci/black-Box/pull/191) | `cursor/mesaflow-admin-upgrades-bbb9` | **Merged** — upgrades admin + UX |
| [#192](https://github.com/octaviopucci/black-Box/pull/192) | `cursor/mesaflow-404-deploy-bbb9` | **Aberto** — fix API 500 (Blob compartilhado) |

---

## 4. Problemas conhecidos (bloqueadores)

### 🔴 API retorna 500 em produção (prioridade máxima)

**Sintoma:** páginas estáticas OK (200), mas `/api/mesaflow/*` retorna `{"error":"Internal error"}`.

**Causa:** persistência com `access: "private"` no Blob falhou no store compartilhado do projeto. W-Tube e iPhone Imports usam `access: "public"` com `list()` + `put()`.

**Fix pronto no PR #192:** alinhar MesaFlow ao mesmo padrão (`list` + `fetch` + `put` público em `mesaflow/store.json`).

**Validar após merge + redeploy:**
```bash
curl https://bedois.vercel.app/api/mesaflow/health
# esperado: {"ok":true,"blob":true,"establishments":1,...}
```

### 🟡 Limite de Blob stores na Vercel

Usuário recebeu: *"Cannot create another store when usage threshold limit is reached"*.

**Solução:** **não criar store novo**. Reutilizar `BLOB_STORE_ID` já conectado ao projeto `loja-iphoneimports`.

### 🟡 Rewrites Vercel + cleanUrls

Rotas dinâmicas (`/mesaflow/m/:slug/:table`) exigem destinos **sem** `.html` no `vercel.json` quando `cleanUrls: true`. Corrigido no PR #40faac1. Script de verificação: `projects/iphone-imports/scripts/verify-mesaflow-deploy.mjs`.

---

## 5. O que ainda falta (backlog)

### Produto / software

- [ ] Merge PR #192 e validar produção end-to-end
- [ ] Pagamentos / assinatura dos planos (R$ 997/1997/2997)
- [ ] Onboarding guiado pós-cadastro (wizard de implantação)
- [ ] Limites por plano (mesas, estabelecimentos) no backend
- [ ] Módulo comandas mais completo (separado de mesa)
- [ ] Relatórios / analytics no admin
- [ ] Notificações sonoras configuráveis no KDS
- [ ] Impressão de comanda (opcional)
- [ ] App PWA / instalação no celular do cliente
- [ ] Multi-idioma (baixa prioridade)

### Kit Mesa / comercial

- [ ] Finalizar artes dos 3 planos (cardápio A4 + display A6) — rascunhos gerados no ChatGPT
- [ ] Cotar acrílico A6 em lote (meta R$ 5–8/un)
- [ ] Definir fornecedor de impressão/laminação
- [ ] Prototipar 1 kit completo e testar scan na mesa real
- [ ] Página de vendas / pricing no site
- [ ] Fluxo de “ativação” do kit (QR do cartão → painel)

### Pesquisa de mercado (do ChatGPT)

Concorrentes mapeados: Goomer, Consumer, Anota AI, Yooga, Sischef, Toast, etc.  
Diferencial MesaFlow: **mesa + rodízio + kit físico + operação**, não só cardápio.

---

## 6. Comandos úteis

```bash
# Dev local (porta 3010)
npm run dev:mesaflow

# Testes admin
npm --prefix projects/mesaflow ci --include=dev
npm --prefix projects/mesaflow run test:admin

# Simular build de produção
node projects/iphone-imports/scripts/build-mesaflow.mjs
node projects/iphone-imports/scripts/verify-mesaflow-deploy.mjs

# Health em produção
curl https://bedois.vercel.app/api/mesaflow/health
curl https://bedois.vercel.app/api/w-tube/health        # blob referência
```

### Arquivos-chave

| Arquivo | Função |
|---------|--------|
| `projects/mesaflow/src/lib/store.ts` | Store, auth, CRUD, Blob |
| `projects/mesaflow/src/lib/types.ts` | Tipos de dados |
| `projects/iphone-imports/api/_mesaflow/handler.ts` | API serverless prod |
| `projects/iphone-imports/vercel.json` | Rewrites MesaFlow |
| `projects/iphone-imports/scripts/build-mesaflow.mjs` | Build deploy |
| `projects/mesaflow/DEPLOY.md` | Instruções deploy |
| `projects/iphone-imports/DEPLOY.md` | Blob + host Vercel |

---

## 7. Prompt mestre original (resumo)

O ChatGPT gerou um prompt extenso para Lovable/Cursor com requisitos de:

1. Cliente mobile-first sem login
2. Cardápio com categorias, variantes, adicionais, vitrine vs cozinha
3. Destino operacional por produto (COZINHA, BALCÃO, BAR…)
4. Pedidos com status: NOVO → ACEITO → EM_PREPARO → PRONTO → ENTREGUE
5. Mesas + comandas + QR individual
6. Rodízio com rodadas, limites, upsell
7. Admin dashboard + Kanban
8. KDS por setor
9. Multi-tenant SaaS

O export completo da conversa (61 mensagens) está disponível via parser; título: **"Sistema de Pedidos QR"**.

---

## 8. Próxima ação recomendada

1. **Merge PR #192** → redeploy → confirmar `blob: true` no health
2. Testar manualmente: cardápio mesa 8, login admin, criar produto, criar mesa, QR
3. Decidir se segue com **kit físico** (artes + fornecedor acrílico) ou **página de vendas**

### Prompt sugerido para o novo chat

```
Contexto: projects/mesaflow/HANDOFF.md

Prioridade: mergear/validar PR #192 (API MesaFlow em produção).
Depois: [escolher uma das opções abaixo]

A) Finalizar página de pricing com os 3 planos (997/1997/2997)
B) Implementar limites de mesa por plano no backend
C) Produzir templates PDF do Kit Mesa (A4 + A6) para impressão
D) Outro: ___
```

---

## 9. Histórico desta sessão Cursor

| Data | O que foi feito |
|------|-----------------|
| 2026-09-14 | Upgrades admin: produtos, mesas, settings, UX, Blob privado, segurança |
| 2026-09-14 | Fix 404 rotas dinâmicas (cleanUrls) |
| 2026-09-15 | Blob store limit → reutilizar BLOB_STORE_ID |
| 2026-09-15 | Diagnóstico 404/500 → API quebrada por Blob private |
| 2026-09-16 | PR #192 com fix Blob público compartilhado |

---

*Gerado automaticamente a partir do ChatGPT share + sessão Cursor.*
