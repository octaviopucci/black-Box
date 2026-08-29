# Schema — quiz.ts e quizVisual.ts

Contrato de dados consumido por `QuizV2Page.tsx`. Copie tipos de
`apps/protocolo-pav/src/data/quiz.ts` — não reinvente.

---

## Tipos

```typescript
export type QuizOption = {
  id: string
  label: string
}

export type PitchStep = {
  type: 'pitch'
  id: string
  why: string           // rastreabilidade VSL — obrigatório
  progress: number      // 0–100, monotônico
  kicker?: string
  title: string
  highlight?: string    // linha 2 do título (destaque visual)
  body: string[]        // parágrafos; pode ser []
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
  helper: string        // ex.: "Escolhe uma pra avançar"
  options: QuizOption[]
}

export type OfferStep = {
  type: 'offer'
  id: string
  why: string
  progress: number      // sempre 100
}

export type QuizStep = PitchStep | QuestionStep | OfferStep

export type Proof = {
  name: string
  meta: string          // "34 anos · resultado · tempo"
  quote: string
}
```

---

## funnelSteps

Array ordenado. Export:

```typescript
export const funnelSteps: QuizStep[] = [ /* ... */ ]

export function buildSteps(): QuizStep[] {
  return funnelSteps
}
```

---

## offerCopy

```typescript
export const offerCopy = {
  kicker: string
  title: string
  subtitle: string
  luckTitle: string       // "Olha. Vou falar reto."
  luckBody: string
  stackTitle: string
  stack: string[]         // o que recebe
  valueBridge: string     // ancoragem de preço
  mentorTitle: string
  mentorBody: string[]
  guaranteeTitle: string
  guaranteeBody: string
  faqTitle: string
  faqs: { q: string; a: string }[]
  cta: string
  secondaryCta: string
  plans: Plan[]           // de site.ts
  proofs: Proof[]
  cadastro: string        // URL externa se houver
  disclaimer: string
} as const
```

---

## quizIntro

Derivado do primeiro passo (hook):

```typescript
export const quizIntro = {
  kicker: funnelSteps[0].type === 'pitch' ? funnelSteps[0].kicker : '',
  title: funnelSteps[0].type === 'pitch' ? funnelSteps[0].title : '',
  highlight: funnelSteps[0].type === 'pitch' ? funnelSteps[0].highlight : '',
  body: funnelSteps[0].type === 'pitch' ? funnelSteps[0].body : [],
  points: funnelSteps[0].type === 'pitch' ? (funnelSteps[0].bullets ?? []) : [],
  cta: funnelSteps[0].type === 'pitch' ? funnelSteps[0].cta : '',
} as const
```

---

## quizVisual.ts

```typescript
const base = `${import.meta.env.BASE_URL}quiz-v2`

export const quizVisuals: Record<
  string,
  { src: string; alt: string; placement: 'hero' | 'side' | 'banner' }
> = {
  hook: {
    src: `${base}/hook.jpg`,
    alt: 'descrição literal da cena',
    placement: 'hero',
  },
  // ... um entry por pitch id + offer
}
```

**placement:**

| Valor | UI |
|-------|-----|
| `hero` | 16:10 acima do título |
| `side` | 4:5 lateral, max 280px |
| `banner` | 21:9 faixa horizontal |

Perguntas (`question`) não têm visual — só pitch e offer.

---

## plans (site.ts)

```typescript
export const plans = [
  {
    id: 'mensal',
    name: 'Mensal',
    price: 'R$ 17,70',
    cadence: '/mês',
    badge: 'Começar',
    checkout: 'https://pay.kiwify.com.br/...',
    highlight: false,
    perks: ['...'],
  },
  // ...
] as const
```

Copie checkouts **exatos** da VSL/oferta. Um plano com `highlight: true`.

---

## Template mínimo de passo pitch

```typescript
{
  type: 'pitch',
  id: 'hook',
  why: 'Hook: [de onde veio na VSL em 1 linha]',
  progress: 6,
  kicker: 'MARCA',
  title: 'Primeira linha do título,',
  highlight: 'segunda linha em destaque.',
  body: [
    'Parágrafo 1 — fatiado da VSL.',
    'Parágrafo 2 — consequência ou contexto.',
  ],
  bullets: [
    'Bullet escaneável 1',
    'Bullet 2',
    'Bullet 3',
  ],
  cta: 'QUERO CONTINUAR',
},
```

---

## Template mínimo de pergunta

```typescript
{
  type: 'question',
  id: 'objetivo',
  why: 'Qualificação: objetivo principal do lead.',
  progress: 74,
  title: 'O que você mais quer tirar disso?',
  helper: 'Escolhe uma pra avançar',
  options: [
    { id: 'resultado_a', label: 'Frase completa na voz do lead.' },
    { id: 'resultado_b', label: 'Outra variante de desejo.' },
    { id: 'resultado_c', label: 'Terceira variante.' },
  ],
},
```

---

## Checklist de validação TypeScript

- [ ] Todos os `id` de pitch existem em `quizVisuals` (exceto se sem imagem)
- [ ] `progress` strictly increasing
- [ ] Último passo é `type: 'offer'` com `progress: 100`
- [ ] `offerCopy.plans` não vazio
- [ ] `import { brand, plans } from './site'` resolve
