# Mapeamento de plataformas

Como levar o Story Quiz (doc 25 etapas) para cada destino.

---

## XQuiz (padrão Stecca)

| Elemento doc | Elemento XQuiz |
|--------------|----------------|
| `# Etapa` | Nova Página no Flow |
| `[BARRA DE PROGRESSO]` | Progresso |
| Texto | Texto / Título |
| `[IMAGEM]` | Imagem |
| `[BOTÃO]` | Botão → conectar próxima página |
| `[QUIZ]` | Quiz / Novo Questionário |
| `[CARREGAMENTO]` | Carregamento |
| `[GRÁFICO]` | Gráfico / Relatório |
| Diagnóstico | Gráfico avançado + Variável |
| PV stack | Benefícios + Preço + Garantia + Depoimento |
| Checkout | Função Link ou Botão URL externa |

### Variáveis

Salvar respostas: `objetivo`, `renda`, `meta`, `compromisso`.

Usar `{variavel}` na PV para espelhar respostas.

Docs: https://docs.xquiz.com.br/llms.txt

### Botão delayado (VSL page — separado)

Se o funil incluir **página VSL** antes do quiz:

- Elemento Vturb/Vídeo
- Botão com `delay: true`, `delayMinutes`, `delaySeconds`
- Referência aula: 51:23 na SQ-VSL-1

Story Quiz em si **não usa delay** — é interativo desde etapa 1.

---

## Deskfunnel

Mesma lógica: passo = tela. Importar template clonável (método aula YouTube).

| Doc | Deskfunnel |
|-----|------------|
| Etapa | Adicionar passo |
| Quiz | Elemento quiz |
| Loading | Timer / animação |

---

## React — Black Box (`QuizV2Page`)

Para apps Vite existentes (`protocolo-pav`, `rian`, etc.).

### Mapeamento de tipos

| Story Quiz | quiz.ts type |
|------------|--------------|
| Hook, persona, manchete (texto) | `pitch` |
| Perguntas | `question` |
| Loading | `pitch` com body curto + auto-advance* |
| PV | `offer` + `offerCopy` |

\*Auto-advance: hoje `QuizV2Page` não tem loading nativo — simular com pitch
+ CTA "Analisando…" ou estender componente (só se pedido).

### Arquivos

```
apps/<slug>/src/data/quiz.ts       — funnelSteps + offerCopy
apps/<slug>/src/data/quizVisual.ts — imagens por step id
apps/<slug>/src/data/site.ts        — brand + plans + checkout
apps/<slug>/src/pages/QuizV2Page.tsx — UI (reutilizar)
```

### Export pack

Copiar adaptado para `exports/base-funnels/<nome>/` seguindo
`exports/base-funnels/COMO-ENVIAR.md`.

### ids

Usar ids de [funnel-anatomy.md § ids sugeridos](funnel-anatomy.md#ids-sugeridos-react).

Atualizar `OfferView` mirrorBits se ids de pergunta forem custom.

---

## Markdown (entrega default)

Entregar brief completo quando usuário não pedir código:

```markdown
# Story Quiz — [Produto]

## Intake
...

## Funil (25 etapas)
### Etapa 1 — hook
...

## Página de vendas
...

## Checklist visual
| Etapa | Asset sugerido |
...

## Checkouts
...
```

---

## Meta Ads + UTM

Tráfego típico Story Quiz:

- Destino: URL do quiz (não PV direta)
- Formato: Stories/Reels → quiz
- UTMs: preservar nos links checkout (Utmify)

Referência campanha SQ: `utm_source=FB`, `utm_term=Instagram_Stories`
