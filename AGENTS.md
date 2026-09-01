# Black Box — instruções para agentes de IA

> Fonte única de verdade para Cursor, Copilot, Cloud Agents e ferramentas compatíveis
> com [AGENTS.md](https://agents.md/).

## Fluxo obrigatório (vibe-coding)

Para **qualquer** pedido de feature, bug, refactor ou decisão técnica:

1. Leia e siga `.cursor/skills/vibe-coding/SKILL.md` **automaticamente** — não espere
 o usuário digitar `/vibe-coding`.
2. Ordem: **brainstorm → plano → ondas paralelas → revisão → commit**.
3. Aplique os três pilares embutidos: processo (Superpowers), simplicidade
 (Ponytail), comunicação direta (Caveman).

**Exceções (modo direto):** typo, rename, ajuste de uma linha com escopo óbvio —
ou quando o usuário pedir `/vibe-coding direto` ou `/vibe-coding rápido`.

**`/agency-site premium`:** override — **executar scaffold imediato**, sem brainstorm.
Ver `.cursor/skills/frontend/agency-site/SKILL.md` regra zero.

**Do iPhone:** Cloud Agent segue este arquivo + skill; guia mobile em
`.cursor/skills/vibe-coding/references/mobile-iphone.md`.

## Diretrizes de comportamento

1. **Pense antes de codar** — suposições explícitas; múltiplas leituras lado a lado.
2. **Simplicidade primeiro** — mínimo que resolve; sem features especulativas.
3. **Mudanças cirúrgicas** — só o pedido; não refatore adjacente.
4. **Metas verificáveis** — cada passo com teste, comando ou comportamento observável.
5. **Orquestrador, não implementador** — sessão principal planeja e delega; Task tool
   para implementação e revisão em paralelo quando seguro.

## Stack

TypeScript · React + Vite · npm · Node 22 · Vercel (deploy unificado) · Fastify (APIs)

Monorepo: portal em `portal/`, apps cliente em `apps/`, APIs serverless em `api/`,
PIX em `apps/pix-gateway`.

## Comandos canônicos

Use estes — não invente outros:

| Ação | Comando |
|------|---------|
| **Install (app)** | `npm --prefix apps/<app> ci --include=dev` |
| **Install (portal)** | `npm --prefix portal ci --include=dev` |
| **Dev portal** | `npm run dev:portal` |
| **Dev app** | `npm run dev:<nome>` (ex.: `dev:chama`, `dev:traco`, `dev:rian`) |
| **Build tudo** | `npm run build` |
| **Build app** | `npm run build:<nome>` |
| **Test PIX** | `npm run test:pix` |
| **Preview estático** | `npm run preview` |
| **Deploy** | Vercel via CI (`.github/workflows/vercel-deploy.yml`) |

Lista completa de `dev:*` e `build:*`: `package.json` na raiz.

## Roteamento de especialistas

| Agente | Quando |
|--------|--------|
| `backend-specialist` | `api/**`, serverless, PIX gateway |
| `frontend-specialist` | `apps/**`, `portal/**`, UI |
| `test-engineer` | Testes e cobertura |
| `code-reviewer` | Revisão pós-diff (independente) |
| `security-reviewer` | Auth, input, secrets |
| `explore` | Mapear repo antes de planejar |

Detalhe: `.cursor/skills/vibe-coding/references/specialists.md`.

## Convenções

- Apps publicados sob path prefix (ex.: `/chama/`, `/traco/`) — respeite `VITE_BASE`.
- Maciel Motors e LP Motors são **produtos independentes**.
- Demos premium: padrão visual em `.cursor/skills/frontend/` (prompt-site, etc.).
- Commits: conventional commits, um por unidade lógica (vibe-coding Fase 5).
- Memória: `MEMORY.md` + `.cursor/memory/` — ver skill references/memory.md.

## Skills do repo

| Skill | Uso |
|-------|-----|
| `/vibe-coding` | Fluxo completo (processo: brainstorm → PR) |
| `/agency-site` | **Landing/site/SaaS** — Next.js em `projects/<slug>/` + 4 camadas + 21st.dev. Tier **Premium** = GSAP/Lenis + hero layered (ref. ARP Fibra) |
| `/prompt-site` | Marca profunda, research, produto digital premium |
| `/premium-site-brief` | Brief rápido antes de codar landing |
| `/story-quiz` | **Story Quiz** — metodologia Stecca: espionar → modelar → criar funil para qualquer produto |
| `anti-ai-landing` | Regras anti template IA (carregada por `/agency-site`) |
| Outras em `.cursor/skills/frontend/` | Scroll cinematic, Netlify preview, Instagram extract, etc. |

**Landing nova (padrão):** `/agency-site` → scaffold em `projects/<slug>/` (Next.js App Router + shadcn + motion). Tier **premium** adiciona GSAP + Lenis. Projeto sai do monorepo no handoff.

**Legado:** demos Vite em `apps/*` — só manutenção, não criar novos.

**Marca complexa:** `/agency-site` + `/prompt-site`.

Quando site + backend: vibe-coding orquestra; agency-site/prompt-site na camada visual.

## Memória

Consulte `MEMORY.md` no início de sessões longas. Atualize ao fechar trabalho
não trivial.
