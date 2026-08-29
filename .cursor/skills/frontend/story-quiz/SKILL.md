---
name: story-quiz
description: >-
  Constrói Story Quiz persuasivo para qualquer produto usando a metodologia
  Luiggi Stecca (espionar → modelar → criar). Persona fictícia, manchetes,
  perguntas narrativas, diagnóstico fake, plano personalizado e oferta low
  ticket. Use com /story-quiz + produto/nicho. NÃO converte VSL — aplica o
  método ensinado na aula Story Quiz.
paths:
  - "apps/**/src/data/quiz.ts"
  - "apps/**/src/data/quizVisual.ts"
  - "apps/**/src/pages/Quiz*.tsx"
  - "exports/base-funnels/**"
---

# Story Quiz — construtor de funis (metodologia Stecca)

Cria um **Story Quiz completo** para **qualquer produto** que o usuário pedir,
aplicando o método ensinado por Luiggi Stecca na aula Story Quiz (FVI / Outbox).

**Invoque:** `/story-quiz` + produto, nicho, promessa e checkout.

**Não é:** converter uma VSL em quiz. **É:** construir um funil do zero com a
lógica da aula (espionagem → modelagem → criação).

**Referência da aula:** [references/methodology.md](references/methodology.md)  
**Anatomia do funil (~25 etapas):** [references/funnel-anatomy.md](references/funnel-anatomy.md)

---

## Regra zero

1. **Produto do usuário** — nunca copiar funil de concorrente; só a *estrutura*.
2. **Persona fictícia** — especialista/personagem criado (estilo Marta Ross).
3. **História, não formulário** — perguntas avançam narrativa; dados pessoais no fim.
4. **Validação antes de copy** — espionar funil escalado (7+ dias) ou usar template interno.
5. **Gerar em lotes** — 5 etapas por vez; revisar antes de continuar.

---

## Fluxo automático

### Passo 0 — Intake

Peça só o que faltar:

| Campo | Obrigatório | Exemplo |
|-------|-------------|---------|
| **Produto** | sim | curso docinhos gourmet, app BASE |
| **Promessa** | sim | faturar R$ 1.000/semana em casa |
| **Público** | sim | mulheres 25–45, renda extra |
| **Preço/checkout** | sim | R$ 29,90 · link Kiwify/Hotmart |
| **Persona** | opcional | nome + história (agente cria se vazio) |
| **Plataforma saída** | opcional | doc markdown · XQuiz spec · React `quiz.ts` |
| **Nicho espionagem** | opcional | palavra-chave Ad Library |

### Passo 1 — Espionagem (validação estrutural)

Siga [methodology.md § Passo 1](references/methodology.md#passo-1-espionagem).

- Biblioteca de Anúncios Meta → termos `lead.digital`, `xquiz`, `xpage`
- Filtrar anúncios ativos **≥ 7 dias**
- Escolher 1 funil do nicho (ou adjacente) como **molde de estrutura**
- Transcrever em texto: `# etapa` + `[elementos visuais]`

Se o usuário não quiser espionar, use [funnel-anatomy.md](references/funnel-anatomy.md)
como molde padrão (~25 etapas validadas).

### Passo 2 — Modelagem (IA + produto novo)

Siga [methodology.md § Passo 2](references/methodology.md#passo-2-modelagem) e
[ai-prompts.md](references/ai-prompts.md).

1. Colar transcrição do funil espionado
2. Prompt de orientação (estrutura, não copy)
3. Pedir **produto diferente** do espionado — mesma sequência, outro nicho
4. Gerar **5 etapas por vez** até completar quiz + página de vendas
5. Organizar doc final: `# Etapa N`, `[IMAGEM: …]`, `[BOTÃO]`, `[QUIZ]`

### Passo 3 — Copy Story Quiz

Siga [copy-rules.md](references/copy-rules.md).

Elementos obrigatórios:

- Manchete fake news (prova social simulada)
- Persona: "Prazer, meu nome é…" + backstory emocional
- Perguntas de dor (múltipla escolha, tom conversa)
- Tela de análise/carregamento (diagnóstico fake)
- Plano personalizado + oferta com ancoragem

### Passo 4 — Entrega

Conforme plataforma escolhida:

| Saída | Arquivo / formato |
|-------|-------------------|
| **Brief completo** | Markdown com 25 etapas + elementos visuais |
| **React (Black Box)** | `quiz.ts` + `quizVisual.ts` — [quiz-schema.md](references/quiz-schema.md) |
| **XQuiz spec** | JSON/blocos por etapa — [platform-mapping.md](references/platform-mapping.md) |

Default: **brief markdown completo** + oferta. Só gera código se o usuário pedir
ou o intake incluir app destino (`apps/<slug>/`).

### Passo 5 — Verificação

- [ ] 20–25 etapas (quiz + PV)
- [ ] Barra de progresso implícita (progress % crescente)
- [ ] Persona fictícia nomeada (disclaimer interno: personagem de marketing)
- [ ] Zero copy do funil espionado (só estrutura)
- [ ] Perguntas de engajamento antes de renda/dados
- [ ] Oferta: stack + garantia + ancoragem + escassez
- [ ] Promessa legal (ex.: "até R$ X", não "R$ 50 vira R$ 1000")

---

## Anatomia resumida (25 etapas)

Ver detalhe em [funnel-anatomy.md](references/funnel-anatomy.md).

```
HOOK + promessa + bullets
→ MANCHETE fake news
→ PERGUNTAS dor (3–5)
→ PERSONA + história
→ PERGUNTAS experiência (2–3)
→ PROVA visual (fotos produto)
→ PERGUNTAS desejo/compromisso (3–4)
→ MANCHETE persona viral
→ PERGUNTAS renda/meta
→ LOADING análise + gráfico fake
→ ÚLTIMAS perguntas + compromisso
→ LOADING "montando plano"
→ PÁGINA DE VENDAS personalizada
```

---

## Integração vibe-coding

| Fase | Ação |
|------|------|
| Brainstorm | Confirmar produto, promessa, preço, plataforma de saída |
| Plano | Listar 25 etapas com ids antes de escrever copy |
| Implementação | Brief primeiro; código só se app destino definido |
| Revisão | Claims legais, personagem fictícia, checkouts corretos |

---

## Modos

| Comando | Comportamento |
|---------|---------------|
| `/story-quiz` | Fluxo completo para produto informado |
| `/story-quiz esqueleto` | Só 25 etapas vazias com ids e elementos |
| `/story-quiz react` | Gera `quiz.ts` direto no app indicado |

---

## Anti-padrões

- Copiar copy do funil espionado
- Quiz tipo formulário (budget, CNPJ, email no início)
- Persona "eu, guru" sem personagem — método usa **personagem fictícia**
- Gerar 25 etapas de uma vez (qualidade cai)
- Promessas ilegais ou sem qualificador ("até", "pode")
- Confundir VSL page (vídeo longo) com Story Quiz (funil interativo)
