# Schema React — Story Quiz em quiz.ts

Opcional — só quando exportar para `QuizV2Page` no Black Box.
Para entrega default (markdown/XQuiz), use [funnel-anatomy.md](funnel-anatomy.md).

---

## Tipos (compatível QuizV2Page)

```typescript
export type QuizOption = { id: string; label: string }

export type PitchStep = {
  type: 'pitch'
  id: string
  why: string
  progress: number
  kicker?: string
  title: string
  highlight?: string
  body: string[]
  note?: { title: string; body: string[] }
  bullets?: string[]
  emphasis?: string
  cta: string
}

export type QuestionStep = {
  type: 'question'
  id: string
  why: string
  progress: number
  title: string
  helper: string
  options: QuizOption[]
}

export type OfferStep = {
  type: 'offer'
  id: string
  why: string
  progress: number
}
```

Referência canônica: `apps/protocolo-pav/src/data/quiz.ts`

---

## Story Quiz → tipos

| Bloco Story Quiz | type | Notas |
|------------------|------|-------|
| Hook, manchete, persona, reframe | `pitch` | `note` para caixas destaque |
| Perguntas | `question` | 3–8 opções |
| Loading/diagnóstico | `pitch` | body simula loading; CTA "Continuar" |
| PV | `offer` | conteúdo em `offerCopy` |

---

## offerCopy (PV)

```typescript
export const offerCopy = {
  kicker: 'Seu plano está pronto',
  title: '...',
  subtitle: '...',
  luckTitle: '...',
  luckBody: '...',
  stackTitle: 'O que você recebe',
  stack: string[],
  valueBridge: '...',
  mentorTitle: '...',
  mentorBody: string[],
  guaranteeTitle: '...',
  guaranteeBody: '...',
  faqTitle: '...',
  faqs: { q: string; a: string }[],
  cta: 'QUERO COMEÇAR AGORA',
  secondaryCta: '...',
  plans: Plan[],
  proofs: Proof[],
  cadastro: string,
  disclaimer: string,
}
```

Espelhamento respostas: editar `OfferView` em `QuizV2Page.tsx` para novos ids.

---

## quizVisual.ts

Um entry por pitch id + offer:

```typescript
export const quizVisuals: Record<string, {
  src: string
  alt: string
  placement: 'hero' | 'side' | 'banner'
}> = { ... }
```

Story Quiz: `hero` para manchetes e persona; `banner` para proof visual.

---

## Variante Mode Caverna

`apps/protocolo-pav` usa variante **superação** (sem fake news) — 15 passos.
Não confundir com Story Quiz Stecca (25 passos). Ver [copy-rules.md § Diferença](copy-rules.md#diferença-vs-mode-caverna-base).

Use Mode Caverna quando o produto for protocolo/comportamento, não renda extra.
