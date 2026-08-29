# Mode Caverna — arquitetura do Story Quiz

Estrutura usada no funil BASE (`apps/protocolo-pav/src/data/quiz.ts`).
Nome interno do repo; alinhada ao método Story Quiz (narrativa fatiada +
micro-compromissos).

---

## Anatomia

```
┌─────────────────────────────────────────────────────────────┐
│  FASE 1 — NARRATIVA (pitch × 8–10)                          │
│  Hook → Dor → Reframe → Mecanismo → Filtro → Prova → Urgência │
│  Cada tela: título + corpo + CTA ("QUERO CONTINUAR")         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  FASE 2 — QUALIFICAÇÃO (question × 3)                       │
│  Objetivo → Bloqueio → Padrão/nível                         │
│  Tap único avança (sem botão separado)                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  FASE 3 — FECHAMENTO (pitch × 2 + offer × 1)                │
│  Transformação → Como funciona → Oferta completa            │
└─────────────────────────────────────────────────────────────┘
```

---

## Passos padrão (template)

Use estes ids; adapte copy à VSL.

| Ordem | id | Bloco VSL | progress % | Objetivo psicológico |
|-------|-----|-----------|------------|----------------------|
| 1 | `hook` | hook | 6 | Parar o scroll; promessa + CTA entrada |
| 2 | `broken-promise` | problema | 12 | Agitar promessa quebrada |
| 3 | `invisible-prison` | agitação | 20 | Reframe ciclo/prisão |
| 4 | `exit-price` | agitação | 28 | Preço da mudança + autoridade |
| 5 | `filter` | filtro | 36 | Quem fica / quem sai |
| 6 | `reframe-protocol` | mecanismo | 44 | Sistema vs motivação |
| 7 | `intensity` | mecanismo | 52 | Por que método intenso |
| 8 | `urgency` | urgência | 58 | Custo de adiar |
| 9 | `social-proof` | prova | 66 | Pertencimento |
| 10 | `objetivo` | — | 74 | **question** — qualificação |
| 11 | `bloqueio` | — | 80 | **question** |
| 12 | `padrao` | — | 85 | **question** |
| 13 | `transformation` | transformação | 90 | Micro-sim pós-perguntas |
| 14 | `how-it-works` | mecanismo | 95 | Reduzir medo; passos práticos |
| 15 | `offer` | oferta | 100 | **offer** — checkout |

Progress deve ser **monotônico crescente**. Espaçamento maior no início
(hook 6% → broken-promise 12%) cria sensação de avanço rápido.

---

## Tipos de passo

### `pitch`

Micro-narrativa. Um clique = um "sim" implícito.

Campos obrigatórios: `type`, `id`, `why`, `progress`, `title`, `body[]`, `cta`

Campos opcionais:

| Campo | Quando usar |
|-------|-------------|
| `kicker` | Só no hook (nome da marca) |
| `highlight` | Segunda linha do título em destaque (cor signal) |
| `bullets` | 3 itens max; listas escaneáveis |
| `emphasis` | Frase com borda lateral; pergunta retórica |
| `note` | Caixa de alerta (filtro, aviso) |

### `question`

Qualificação. 3–8 opções; labels completos (não só uma palavra).

Campos: `title`, `helper`, `options[{id, label}]`

Ids de pergunta padrão: `objetivo`, `bloqueio`, `padrao` — usados no
`OfferView` para espelhar respostas.

### `offer`

Shell vazio no array — conteúdo vem de `offerCopy`.

---

## Mapeamento VSL → passos

| Se a VSL fala sobre... | Vai para... |
|------------------------|-------------|
| Abertura emocional | `hook` |
| "Você já tentou e falhou" | `broken-promise` |
| Ciclo vicioso / prisão | `invisible-prison` |
| "Tem um preço pra sair" | `exit-price` |
| "Não é pra todo mundo" | `filter` (+ `note`) |
| Nome do método/protocolo | `reframe-protocol` |
| Intensidade / compromisso | `intensity` |
| "Enquanto você adia..." | `urgency` |
| Depoimentos / números | `social-proof` + `proofs[]` |
| Antes/depois | `transformation` |
| Passo a passo do produto | `how-it-works` (lista numerada) |
| Stack + preço + garantia | `offerCopy` |

Se a VSL for **curta** (< 10 min), combine blocos:

- `broken-promise` + `invisible-prison` → um passo
- Mínimo: 6 pitch + 3 question + 1 offer

Se a VSL for **longa** (> 30 min), não aumente passos — condense copy.

---

## Perguntas — como derivar da VSL

| Pergunta | Origem na VSL |
|----------|---------------|
| **Objetivo** | Resultado final prometido (3 variantes de desejo) |
| **Bloqueio** | Objeções mais citadas ("não sei por onde", "falta tempo") |
| **Padrão/nível** | Segmentos de avatar ("iniciante", "já vende", nicho) |

Cada opção = frase na **voz do lead**, não do expert.

---

## Oferta — espelhamento

`QuizV2Page` → `OfferView` lê `answers.objetivo`, `answers.bloqueio`,
`answers.padrao` e monta `mirrorBits`.

Ao criar ids de opção, use estes valores se quiser espelhamento grátis:

**objetivo:** `habitos` | `identidade` | `vida` (ou custom — atualize OfferView)

**bloqueio:** `perdido` | `distracao` | `comparacao`

**padrao:** ids específicos do nicho (ex.: `cigarro`, `alcool` no BASE)

Se customizar ids, atualize o mapeamento em `OfferView` ou documente no PR.

---

## Referência cruzada XQuiz

| Mode Caverna | Elemento XQuiz |
|--------------|----------------|
| pitch | Página + Título + Texto + Botão |
| question | Quiz / Novo Questionário |
| offer | Benefícios + Preço + Garantia + Depoimento |
| progress | Barra de Progresso |
| note | Nota |
| filter note | Nota com borda |

Story Quiz no XQuiz = Flow com páginas conectadas. No Black Box = array
`funnelSteps` + React stepper.
