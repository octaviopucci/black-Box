---
name: vibe-coding
description: >-
  Fluxo completo vibe-coding-toolkit adaptado pro Cursor: brainstorm → plano →
  ondas paralelas → revisão multi-agente → commit. Superpowers + Ponytail +
  Caveman embutidos. Use em qualquer pedido de feature, bug ou refactor — ou
  invoque com /vibe-coding. Funciona em Cloud Agent (iPhone incluído).
paths:
  - "**/*"
---

# Vibe Coding — fluxo automático

Baseado no [vibe-coding-toolkit](https://github.com/soumatheusgomes/vibe-coding-toolkit)
(playbook de onboarding). Portado pro Cursor: sem plugins do Claude Code, mesma
disciplina.

**Invoque:** `/vibe-coding` + o pedido — ou só descreva a tarefa; o `AGENTS.md`
já manda seguir este fluxo.

**Do iPhone:** use Cursor Cloud Agent (Safari ou app). O agente lê esta skill +
`AGENTS.md` sozinho. Guia completo: [references/mobile-iphone.md](references/mobile-iphone.md).

---

## Regra zero — rode ANTES de responder

Se o pedido envolve código, arquitetura ou decisão de produto:

1. **Não implemente** na primeira resposta (exceto pedidos triviais — ver abaixo).
2. **Não** escolha uma interpretação ambígua em silêncio.
3. Siga as fases abaixo na ordem.

**Trivial (pula brainstorm):** typo, renomear variável, ajuste de copy, mudança
de uma linha com escopo óbvio. Ainda assim: mudança cirúrgica, sem refactor
adjacente.

---

## Três pilares (embutidos — não precisa instalar plugin)

### Superpowers — processo

Ordem fixa: **brainstorm → plano → implementação → revisão → commit**.
Nunca pule uma fase sob pressão de tempo.

### Ponytail — o que construir

Escada antes de escrever código:

1. Isso precisa existir?
2. Já existe algo parecido no repo?
3. Stdlib / feature nativa resolve?
4. Dependência já instalada resolve?
5. Cabe numa linha?
6. Só então — mínimo de código novo.

Resposta típica: implementação curta + 1–3 linhas do que foi **pulado** e
**quando** adicionar de verdade.

### Caveman — como falar

Sem enchimento ("vou verificar...", "ótima pergunta!", "potencialmente...").
Números, paths, erros e negações intactos. Direto ao ponto.

---

## Fase 1 — Brainstorm (escopo)

Para pedidos abertos ou com mais de uma leitura razoável:

- O que é "pronto"?
- O que está **dentro** e **fora** do escopo?
- Restrições não ditas (padrões do repo, performance, o que não tocar)?
- Se ambíguo: apresente interpretações lado a lado — **não escolha sozinho**.

Prompt pronto: [references/prompts.md](references/prompts.md#brainstorm).

**Do iPhone:** responda as perguntas em bullets curtos; o agente continua sozinho.

---

## Fase 2 — Plano (verificável)

Cada passo precisa de **verificação executável**: comando, teste ou comportamento
observável — nunca "deveria funcionar".

Marque cada passo com:

- `Files:` — paths exatos que o passo toca
- `Depends-on:` — IDs anteriores ou `none`

Mostre o plano e espere **ok** (ou correções) antes de codar — no mobile, um
"ok" ou "pode" basta.

Prompt pronto: [references/prompts.md](references/prompts.md#plano).

---

## Fase 3 — Implementação em ondas

Agrupe tasks em **ondas** só quando **as duas** condições valem:

1. Sem dependência entre elas (direta ou transitiva).
2. Conjuntos `Files:` **disjuntos** (zero overlap).

**Implementadores (Task tool / subagentes):**

- Dispare tasks da mesma onda **juntas** (paralelo).
- Implementadores **não commitam** — só editam, testam o seu, reportam arquivos.
- Orquestrador (sessão principal) commita **uma task por vez**, HEAD fresco antes
  de cada commit.

Regra completa: [references/parallel-waves.md](references/parallel-waves.md).

Roteamento de especialistas: [references/specialists.md](references/specialists.md).

---

## Fase 4 — Revisão multi-agente

Antes de fechar cada onda, revise o diff com painel **independente** (paralelo):

- `code-reviewer` — bugs, testes, edge cases
- `security-reviewer` — auth, input, secrets (se aplicável)
- Especialista de stack (ex.: `typescript-reviewer`, `frontend-specialist`)

Cada achado: `arquivo:linha — severidade — alegação — cenário que quebra`.

Corrija **CRITICAL** e **HIGH** antes de seguir.

Prompt pronto: [references/prompts.md](references/prompts.md#revisao).

---

## Fase 5 — Commit

- Um commit por task, ordem da onda.
- Conventional commits (`feat:`, `fix:`, `test:`, etc.).
- Mensagem descreve **uma** unidade de trabalho.

---

## Memória entre sessões

Antes de fechar trabalho não trivial, pergunte: *uma sessão futura ficaria
surpresa de não saber isso?*

Se sim → atualize `MEMORY.md` (índice) + arquivo em `.cursor/memory/`.
Guia: [references/memory.md](references/memory.md).

---

## Modos rápidos (override)

Só se o usuário pedir explicitamente:

| Comando | Comportamento |
|---------|----------------|
| `/vibe-coding` | Fluxo completo (padrão) |
| `/vibe-coding rápido` | Plano curto + implementa (pula brainstorm se escopo claro) |
| `/vibe-coding direto` | Implementa sem plano (só typos / micro-fix) |

Sem prefixo → fluxo completo mesmo assim (via `AGENTS.md`).

---

## Checklist interno (agente)

Antes de dar por encerrado:

- [ ] Escopo fechado ou ambiguidade explicitada
- [ ] Plano com verificação por passo
- [ ] Ondas respeitam `Files:` + `Depends-on:`
- [ ] Revisão independente rodou
- [ ] Commits pequenos e rastreáveis
- [ ] Memória atualizada se aplicável
