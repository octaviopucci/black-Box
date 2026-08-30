# Anatomia do Story Quiz (~25 etapas)

Molde estrutural validado (funil renda extra Luiggi Stecca). Adapte copy ao
produto do usuário — **nunca** copie texto deste template.

Cada etapa = 1 tela com barra de progresso + botão "Continuar" (exceto quiz).

---

## Mapa completo

| # | Bloco | Tipo | Objetivo |
|---|-------|------|----------|
| 1 | Hook + promessa | pitch | Promessa principal + bullets benefício |
| 2 | Manchete fake news #1 | visual+text | Validação social simulada |
| 3–5 | Perguntas dor #1–3 | question | Identificação com problema |
| 6 | Apresentação persona | story | "Prazer, meu nome é…" + foto |
| 7 | Backstory persona | story | Desemprego → descoberta → resultado |
| 8 | Reframe emocional | pitch | "Não é sobre X, é sobre liberdade…" |
| 9 | Pergunta experiência | question | Já fez curso/tentou antes? |
| 10 | Segredo/mecanismo | pitch | "Meu segredo é…" + fotos produto |
| 11 | Prova visual | visual | Copinhos/produto bonito, encomendas |
| 12 | Pergunta desejo | question | Clientes fiéis / vendas garantidas? |
| 13 | Pergunta bloqueio | question | O que te impede hoje? |
| 14 | Pergunta crença | question | Acredita que consegue transformar? |
| 15 | Manchete fake news #2 | visual | Persona viraliza / transforma vidas |
| 16 | Pergunta renda atual | question | Faixa de renda mensal |
| 17 | Pergunta meta | question | Quanto gostaria de ganhar? |
| 18 | Loading análise | loading | "Analisando…" 0→100% |
| 19 | Diagnóstico gráfico | result | Motivação, renda, conhecimento |
| 20 | Plano exclusivo | pitch | "Montar plano para você…" |
| 21 | Perguntas finais 1–2 | question | Ingredientes / custo inicial |
| 22 | Pergunta compromisso | question | "Se eu montar plano, você se compromete?" |
| 23 | Loading plano | loading | Montando plano personalizado… |
| 24 | Transição PV | bridge | Handoff para página de vendas |
| 25 | Página de vendas | offer | Oferta completa |

Total quiz interativo: ~23 telas + PV = **~25 etapas**.

---

## Detalhe por bloco

### Etapa 1 — Hook

```
[BARRA DE PROGRESSO]
Título: Descubra o passo a passo para [PROMESSA]
[IMAGEM: produto + print resultado]
Bullets:
- Não precisa experiência
- Comece com menos de R$ X para faturar até R$ Y
- Sem equipamento profissional
[BOTÃO: Continuar]
```

Progress sugerido: 4–8%

### Etapa 2 — Manchete #1

```
[IMAGEM: layout jornal — "N mulheres faturam R$ X/mês com [produto]"]
[BOTÃO: Continuar]
```

Tom: notícia, não anúncio.

### Etapas 3–5 — Perguntas dor

Perguntas sobre **situação atual** com opções empáticas:

```
Quando você tenta [ação], o resultado fica como espera?
○ Não, desanda / fica feio
○ Às vezes acerto, nem sempre
○ Nunca fiz, quero aprender
○ Já domino
```

Sem emojis obrigatórios (XQuiz suporta; React BASE não).

Progress: +3–4% por pergunta.

### Etapas 6–7 — Persona

```
# Etapa 6
[IMAGEM: retrato persona — stock/Canva]
Prazer, meu nome é [NOME].
# Etapa 7
Há [tempo] eu estava [dor]. Assim como você...
[História 3–4 parágrafos]
Na primeira semana [resultado pequeno].
Hoje [resultado grande].
Agora vou te mostrar como você pode fazer o mesmo.
```

### Etapa 8 — Reframe emocional

```
Não é só sobre [produto].
É sobre liberdade, família, [valor emocional do nicho].
```

### Etapas 9–14 — Qualificação narrativa

Mix de perguntas:

- Já fez curso/treinamento?
- Gostaria de clientes fiéis?
- O que te impede hoje?
- Acredita que consegue?

Labels na **voz do lead**, não do expert.

### Etapa 15 — Manchete #2 (persona)

```
[IMAGEM: "Ex-[profissão] viraliza e transforma vidas com [produto]"]
[NOME] criou método que...
```

### Etapas 16–17 — Renda

Perguntas de meta — **perto do fim**, não no início:

```
Qual sua faixa de renda mensal?
Quanto gostaria de ganhar com [produto]?
```

### Etapas 18–19 — Diagnóstico fake

```
# Loading
Analisando suas respostas...
[CARREGAMENTO: 0% → 100%, ~3–5s]

# Resultado
Análise do seu perfil
[GRÁFICO: Motivação: Alta | Renda: Baixa | Conhecimento: Médio]
Vamos montar um plano exclusivo para você.
```

Variáveis XQuiz: salvar respostas para espelhar na PV.

### Etapas 20–22 — Fechamento quiz

```
Responda as últimas perguntas:
- Tem [recurso] em casa?
- Custa menos de R$ X para começar?
- Se eu montar plano comprovado para faturar [meta], você se compromete?
  ○ Sim, estou pronta
  ○ Quero saber mais primeiro
```

### Etapa 23 — Loading plano

```
Montando seu plano personalizado...
Analisando rotina · Calculando meta · Ajustando estratégia
[CARREGAMENTO]
```

### Etapa 25 — Página de vendas

Ver [copy-rules.md § Página de vendas](copy-rules.md#página-de-vendas).

Elementos:

1. "Seu plano está pronto" + espelho das respostas
2. Gráfico chance/renda possível (% fake)
3. Stack (o que recebe)
4. Bônus
5. Depoimentos (placeholder se não houver reais)
6. Garantia **antecipada** (antes do preço)
7. Presente emocional ("toda mulher merece…")
8. Preço ancorado (De R$ X por R$ Y)
9. Escassez (vagas/tempo)
10. FAQ curto
11. Botão checkout

---

## Progress bar (monotônico)

Distribuição sugerida para 25 etapas:

```
Etapa 1–5:   4% → 20%
Etapa 6–10:  24% → 40%
Etapa 11–15: 44% → 60%
Etapa 16–20: 64% → 80%
Etapa 21–25: 84% → 100%
```

---

## Variantes por nicho

| Nicho | Ajuste |
|-------|--------|
| Saúde/fitness | Trocar manchetes por depoimento; cuidado com claims ANVISA |
| B2B/SaaS | Persona = founder; menos fake news, mais case study |
| Infoproduto guru | Persona pode ser o expert real (sem fictícia) |
| App/assinatura | Perguntas sobre hábito, não renda |

Mode Caverna (BASE/addiction) em `protocolo-pav` é variante **sem** fake news
nem persona — use só se o nicho exigir tom de superação, não renda extra.

---

## ids sugeridos (React)

Se exportar para `quiz.ts`:

```
hook, headline-1, pain-1, pain-2, pain-3,
persona-intro, persona-story, reframe,
exp-question, mechanism, proof-visual,
desire-q, block-q, belief-q,
headline-2, income-q, goal-q,
analysis-loading, diagnosis,
plan-intro, final-1, final-2, commitment-q,
plan-loading, offer
```
