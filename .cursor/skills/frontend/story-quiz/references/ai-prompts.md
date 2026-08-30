# Prompts IA — Story Quiz

Prompts para gerar funil novo a partir de estrutura espionada. Funcionam no
Cursor, ChatGPT, Claude, etc.

---

## Prompt 1 — Orientação

Enviar **antes** da transcrição do funil base.

```markdown
Você é especialista em Story Quiz — funis interativos de low ticket no estilo
Luiggi Stecca (FVI / Outbox Club).

Vou enviar a transcrição de um funil de vendas VALIDADO (estrutura apenas).
Sua tarefa NÃO é copiar — é aprender a LÓGICA:

- Sequência de telas e micro-compromissos
- Onde entram manchetes, persona, perguntas, loading, oferta
- Tom: conversa, renda extra, desejo imediato
- Elementos visuais entre colchetes [IMAGEM: …]

Depois vou pedir um funil NOVO para outro produto, mesma estrutura.

Confirme que entendeu e aguarde a transcrição.
```

---

## Prompt 2 — Análise do funil base

Após colar transcrição:

```markdown
Analise este funil e retorne:

1. Promessa principal
2. Tipo de produto (renda extra / skill / saúde / etc.)
3. Blocos identificados (hook, manchete, dor, persona, diagnóstico, PV)
4. Total de etapas
5. Onde estão as perguntas (engajamento vs qualificação vs renda)
6. Elementos visuais recorrentes

Não gere copy nova ainda — só análise estrutural.
```

---

## Prompt 3 — Ideias de produto

Se o usuário não definiu produto:

```markdown
Com base na estrutura analisada, sugira 5 ideias de produto LOW TICKET
(nicho: [NICHO DO USUÁRIO]) que:

- Permitem promessa de ganho/transformação em casa
- Têm mercado visual (festas, food, crafts, digital)
- São DIFERENTES do produto do funil espionado
- Geram desejo imediato

Para cada ideia: nome, promessa em 1 linha, por que funciona.
```

---

## Prompt 4 — Gerar 5 etapas

```markdown
Produto escolhido: [PRODUTO]
Promessa: [PROMESSA]
Persona: [NOME] — [profissão fictícia ou real]

Gere as ETAPAS [N] a [N+4] do Story Quiz seguindo EXATAMENTE a mesma
FUNÇÃO de cada etapa do funil base (etapas [X] a [X+4] dele), mas com
copy 100% original para [PRODUTO].

Formato obrigatório:
# Etapa N
[BARRA DE PROGRESSO]
[texto]
[IMAGEM: descrição literal para designer]
[BOTÃO: Continuar]
ou
[QUIZ: pergunta]
○ Opção 1
○ Opção 2
...

Inclua sugestão de progresso % (0–100).
Não pule etapas. Não resuma.
```

Repetir incrementando N até etapa 25 (PV).

---

## Prompt 5 — Página de vendas

```markdown
Gere a PÁGINA DE VENDAS (etapa 25) para:

Produto: [PRODUTO]
Preço: [PREÇO] (ancoragem: [PREÇO CHEIO])
Checkout: [URL]
Persona: [NOME]

Inclua:
- "Seu plano está pronto" + espelho genérico
- Gráfico renda possível + % chance (estilo diagnóstico)
- Stack 5–7 itens
- 2–3 bônus
- Garantia 30 dias ANTES do preço
- Bloco emocional ("você merece…")
- Ancoragem + escassez (vagas ou timer)
- 3 FAQs
- [BOTÃO: texto CTA → checkout]

Tom: persuasivo, direto, low ticket BR.
```

---

## Prompt 6 — Revisão compliance

```markdown
Revise este Story Quiz e liste:

1. Claims exagerados ou ilegais
2. Promessas sem qualificador ("até", "pode")
3. Copy copiada do funil base (similaridade)
4. Perguntas tipo formulário (email/nome cedo demais)
5. Persona fictícia sem nuance (apresentada como real)

Sugira correção linha a linha.
```

---

## Geração no Cursor (agente)

O agente **não precisa** de ChatGPT externo — seguir estes prompts como
instrução interna. Regras:

1. Análise estrutural → output markdown
2. Lotes de 5 etapas → pausar se pedido pelo usuário
3. PV separada no final
4. Revisão compliance antes de entregar

---

## Anti-padrão IA

Pedir `"crie um quiz para vender [produto]"` **sem** transcrição base =
output genérico inútil.

Sempre: **estrutura validada primeiro**, produto novo depois.
