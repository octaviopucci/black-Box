---
name: story-quiz
description: >-
  Cria funis Story Quiz a partir de VSL (transcrição, roteiro ou URL). Extrai
  blocos da VSL, mapeia para estrutura Mode Caverna (pitch → perguntas → oferta)
  e gera quiz.ts + quizVisual.ts + offerCopy. Use com /story-quiz quando o
  usuário pedir quiz narrativo, funil de vendas interativo ou converter VSL em
  quiz. Referência: Luiggi Stecca / XQuiz + implementação BASE em protocolo-pav.
paths:
  - "apps/**/src/data/quiz.ts"
  - "apps/**/src/data/quizVisual.ts"
  - "apps/**/src/pages/Quiz*.tsx"
  - "exports/base-funnels/**"
---

# Story Quiz — VSL → funil interativo

Converte uma **VSL** (Video Sales Letter) em um **Story Quiz**: sequência de
telas narrativas com micro-compromissos (pitch), perguntas de qualificação e
oferta personalizada.

**Invoque:** `/story-quiz` + link da VSL, transcrição ou roteiro.

**Referências no repo:**

- Implementação canônica: `apps/protocolo-pav/src/data/quiz.ts` (Mode Caverna)
- UI: `apps/protocolo-pav/src/pages/QuizV2Page.tsx`
- Export pack: `exports/base-funnels/quiz-v2/`
- VSL de referência (Luiggi Stecca): [references/vsl-storyquiz-example.md](references/vsl-storyquiz-example.md)

---

## Regra zero — rode ANTES de escrever copy

1. **Extraia** a VSL — não invente argumentos que não estão no material.
2. **Mapeie** cada bloco da VSL para um passo do funil (ver [mode-caverna.md](references/mode-caverna.md)).
3. **Gere** os arquivos de dados — não reimplemente a UI se `QuizV2Page` já existe no app.
4. **Valide** que cada passo tem `why` explicando de onde veio na VSL.

Se a VSL for só vídeo (sem transcrição), peça transcrição ou use Whisper no
áudio antes de seguir.

---

## Fluxo automático

### Passo 0 — Intake (só o que faltar)

| Campo | Obrigatório | Exemplo |
|-------|-------------|---------|
| **VSL** | sim | URL, `.txt`, roteiro colado |
| **Produto/marca** | sim | BASE, Outbox Club |
| **Público** | sim | quem assiste a VSL |
| **App destino** | sim | `apps/protocolo-pav` ou novo em `apps/<slug>/` |
| **Checkouts/planos** | sim p/ oferta | links Kiwify/Hotmart + preços |
| **Tom** | opcional | Caveman (padrão), formal, técnico |
| **Perguntas** | opcional | 3–4 (padrão Mode Caverna) |

### Passo 1 — Extração da VSL

Siga [vsl-extraction.md](references/vsl-extraction.md).

**Saída obrigatória** — tabela de blocos antes de escrever o quiz:

```markdown
| Bloco VSL | Timestamp/trecho | Passo quiz | id sugerido |
|-----------|------------------|------------|-------------|
| Hook | "Se você tá cansado..." | pitch | hook |
| Problema | ... | pitch | broken-promise |
```

Se o material for página XQuiz/Vturb (como `aula-storyquiz.xquiz.click`), extraia
do HTML/JSON: título, copy visível, CTA, delay do botão, checkout.

### Passo 2 — Arquitetura Mode Caverna

Siga [mode-caverna.md](references/mode-caverna.md).

Sequência padrão (12–16 passos):

```
pitch×8–10 → question×3 → pitch×2 → offer×1
```

Cada `pitch` = um micro-sim ("EU TOPO", "QUERO CONTINUAR"). Cada clique avança
a narrativa da VSL sem exigir que o lead assista 40 min de vídeo.

### Passo 3 — Copy

Siga [copy-rules.md](references/copy-rules.md).

- Voz humana, primeira pessoa quando a VSL usa
- Frases curtas. Sem travessões (—)
- CTAs em MAIÚSCULAS, verbo de ação
- Não copiar a VSL inteira num passo — fatiar em telas de 3–6 linhas

### Passo 4 — Gerar arquivos

Siga [quiz-schema.md](references/quiz-schema.md).

| Arquivo | Conteúdo |
|---------|----------|
| `src/data/quiz.ts` | `funnelSteps`, `proofs`, `offerCopy`, `quizIntro` |
| `src/data/quizVisual.ts` | `quizVisuals` por step id |
| `src/data/site.ts` | `brand`, `plans` (se não existir) |

**Não altere** `QuizV2Page.tsx` salvo pedido explícito — ela consome os dados.

### Passo 5 — Visuais

Para cada `pitch` com id, defina em `quizVisual.ts`:

- `src`: path em `public/quiz-v2/<id>.jpg`
- `alt`: descrição literal da cena (para gerar/buscar imagem depois)
- `placement`: `hero` | `side` | `banner`

Alterne `hero` nos passos emocionais fortes; `banner` nos de transição.

### Passo 6 — Verificação

```bash
npm --prefix apps/<app> ci --include=dev
npm run build:<app>   # ou dev:<app> e abrir /quiz-v2
```

Checklist:

- [ ] Progress bar sobe de 6% a 100% sem saltos estranhos
- [ ] 3 perguntas com opções distintas e labels legíveis no mobile
- [ ] `OfferView` espelha respostas (`mirrorBits` em QuizV2Page)
- [ ] Checkouts abrem em nova aba
- [ ] Nenhum passo com body vazio sem `note` ou `bullets`

---

## VSL page vs Story Quiz

Dois produtos distintos, mesma origem:

| Peça | Função | Onde vive |
|------|--------|-----------|
| **VSL page** | Vídeo longo + CTA delayado | landing `/` ou `/vsl` |
| **Story Quiz** | Narrativa fatiada + quiz + oferta | `/quiz-v2` |

A VSL de Luiggi Stecca (`SQ - VSL 1`) é só a **página de aquecimento**: logo,
Vturb, botão após 51:23, bio, checkout Hotmart. O Story Quiz completo é o funil
interativo (como BASE em `protocolo-pav`).

Ao receber só a VSL page, pergunte se o usuário quer:

1. Clonar a VSL page (vídeo + delay), ou
2. Gerar o Story Quiz completo a partir do **conteúdo falado** no vídeo

Para (2), a transcrição do vídeo é obrigatória.

---

## Integração com vibe-coding

| Fase | Ação |
|------|------|
| Brainstorm | Confirmar app destino, checkouts, se VSL page entra no escopo |
| Plano | Listar passos Mode Caverna + ids antes de codar |
| Implementação | Só `quiz.ts`, `quizVisual.ts`, assets — UI existente |
| Revisão | `code-reviewer` no diff de copy (tom, claims, checkouts) |

Roteamento: `frontend-specialist` para UI nova; orquestrador para copy/dados.

---

## Modos

| Comando | Comportamento |
|---------|---------------|
| `/story-quiz` | Fluxo completo (extração → arquivos) |
| `/story-quiz esqueleto` | Só tabela de blocos + ids, sem copy final |
| `/story-quiz a partir de BASE` | Copia estrutura de `protocolo-pav`, troca copy |

---

## Anti-padrões

- Quiz genérico de nicho sem extrair a VSL
- 15+ passos (abandono sobe; máx ~16)
- Perguntas abertas (só múltipla escolha)
- Oferta antes das perguntas
- Copy de IA ("potencialmente", "transforme sua jornada")
- Inventar depoimentos ou números que não estão na VSL
