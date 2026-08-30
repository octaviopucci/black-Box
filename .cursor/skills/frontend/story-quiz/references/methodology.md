# Metodologia Story Quiz — Luiggi Stecca

Extraída da aula Story Quiz (VSL SQ-1) + aula prática Deskfunnel/Outbox Club.
**Uso:** construir funis novos para qualquer produto — não replicar conteúdo da aula.

---

## Visão geral: 3 passos

```
PASSO 1 — ESPIONAGEM     → achar funil validado (7+ dias no ar)
PASSO 2 — MODELAGEM      → transcrever estrutura → IA → produto NOVO
PASSO 3 — CRIAÇÃO        → montar na ferramenta (XQuiz / Deskfunnel / React)
```

Luiggi resume: *espionar, modelar, criar*.

---

## Passo 1 — Espionagem

### Onde

- [Biblioteca de Anúncios Meta](https://www.facebook.com/ads/library/)
- Termos de busca (plataformas de quiz): `lead.digital`, `xquiz`, `xpage`

### Critério de ouro

Anúncio **ativo há ≥ 7 dias** = funil com sinal de escala/validação.

### Como escolher

1. Filtrar por data (mais antigo = mais validado)
2. Clicar no anúncio → abrir landing/quiz
3. Escolher nicho com afinidade ou oportunidade clara
4. Confirmar promessa + tipo de produto (low ticket, renda extra, etc.)

### Transcrição do funil espionado

Copiar **todo o texto** para um doc. Regras de formatação:

| Símbolo | Significado |
|---------|-------------|
| `# Etapa N` | Nova tela/passo |
| `[IMAGEM: descrição]` | Elemento visual |
| `[BOTÃO: texto]` | CTA |
| `[BARRA DE PROGRESSO]` | Indicador |
| `[QUIZ: pergunta]` | Pergunta com opções |
| `[CARREGAMENTO: descrição]` | Tela fake loading |
| `[GRÁFICO: descrição]` | Diagnóstico visual |

**Não** se preocupar com formatação bonita — organização > estética do doc.

Exemplo:

```markdown
# Etapa 1
[BARRA DE PROGRESSO]
Descubra o passo a passo para lucrar R$ 1.000 por semana vendendo...
[IMAGEM: copinhos gourmet + print faturamento]
- Bullet 1
- Bullet 2
[BOTÃO: Continuar]

# Etapa 2
[BARRA DE PROGRESSO]
[IMAGEM: manchete fake news — "300 mulheres faturam R$ 1.000/semana..."]
[BOTÃO: Continuar]
```

Funil de referência da aula: **~25 etapas** (quiz + página de vendas).

---

## Passo 2 — Modelagem

### Por que modelar estrutura, não copy

> "Por mais que eu mude uma palavrinha, eu tô basicamente copiando."

A IA (ou o agente) deve:

1. **Analisar** a estrutura do funil transcrito
2. **Identificar** blocos: engajamento, diagnóstico, autoridade, prova, oferta
3. **Gerar funil novo** para o produto do usuário — **mesma sequência**, copy original

### Prompt de orientação (antes do funil transcrito)

Ver [ai-prompts.md](ai-prompts.md#prompt-1-orientação).

### Alimentar a IA

1. Enviar prompt de orientação
2. Colar transcrição completa do funil espionado
3. Pedir análise: promessa, tipo, blocos identificados

### Definir produto novo

Se o usuário não definiu, sugerir 3–5 ideias de produto low ticket no nicho.
Critério Luiggi: *"mostra pro cliente que é possível conseguir o resultado prometido"*.

Exemplo da aula: espionou salada de frutas → escolheu docinhos gourmet (mercado
de festas, aniversários, casamentos).

### Gerar em lotes de 5

**Nunca** pedir 25 etapas de uma vez — qualidade degrada.

```
"Gere as etapas 1–5 seguindo a estrutura do funil base, produto: [X]"
→ revisar
"Mande mais 5 etapas"
→ repetir até PV final
```

### Organizar output

Doc final com mesma convenção `#` e `[]`. Incluir sugestões de imagem por etapa.

---

## Passo 3 — Criação

### Ferramentas (ecossistema Stecca)

| Ferramenta | Uso |
|------------|-----|
| **XQuiz** | Plataforma principal (Story Quiz nativo) |
| **Deskfunnel** | Alternativa; templates importáveis |
| **React (Black Box)** | `QuizV2Page` + `quiz.ts` para apps Vite |

Ver [platform-mapping.md](platform-mapping.md).

### Montagem

Para cada etapa do doc:

- Texto → elemento Texto/Título
- `[IMAGEM]` → upload ou stock (Canva)
- `[BOTÃO]` → botão → próxima etapa
- `[QUIZ]` → pergunta + opções
- `[CARREGAMENTO]` → barra animada → auto-avanço

---

## Princípios Story Quiz (da aula)

### 1. Story, não survey

Perguntas fazem parte de uma história que o lead quer terminar.
Errado: "Qual seu faturamento?" na etapa 1.
Certo: engajamento → dor → persona → qualificação → renda.

### 2. Personagem fictícia

Criar especialista/persona (ex.: Marta Ross, confeiteira):

- Foto stock/Canva (sem risco autoral)
- Backstory emocional (desemprego → descoberta → resultado)
- "Novela cria personagem; margarina cria família fictícia"

**Disclosure:** personagem de marketing — não apresentar como pessoa real se fictícia.

### 3. Manchetes fake news

Simular matéria jornalística para validação social:

> "Mulheres faturam até R$ 5.784/mês com encomendas de copinhos gourmet"

Visual: layout de notícia + foto + botão continuar.

### 4. Diagnóstico fake

Telas de "Analisando seu perfil…" com:

- Barra 0→100%
- Gráfico (motivação alta, renda baixa, conhecimento médio)
- "Montando plano personalizado…"

Objetivo: investimento emocional antes da oferta.

### 5. Ordem das perguntas (conversão)

Inspirado em Stecca + Ryan Levesque (mencionado na palestra):

1. **Engajamento** — fácil, desejo ("Quer vender mais?")
2. **Dor** — situação atual
3. **Persona** — história (não pergunta)
4. **Experiência** — tentativas anteriores
5. **Compromisso** — "Se eu montar um plano, você se compromete?"
6. **Renda/meta** — qualificação (perto do fim)
7. **Dados pessoais** — email/nome só no fim (se captura)

Taxa de completude pode **dobrar** vs formulário com nome/telefone no início.

### 6. Promessa legal

Diferenciar:

- ✅ "Comece com menos de R$ 50 para faturar **até** R$ 1.000"
- ❌ "Invista R$ 50 e fature R$ 1.000"

### 7. Low ticket + quiz

Modelo FVI: quiz qualifica → PV curta → checkout R$ 19–97.
Quiz substitui VSL longa no tráfego frio (Meta Stories/Reels).

---

## Quando pular espionagem

Use [funnel-anatomy.md](funnel-anatomy.md) como molde se:

- Usuário pediu rapidez
- Já tem swipe file interno (`exports/base-funnels/`)
- Nicho regulado (adaptar manchetes/compliance)

Ainda assim: **copy 100% original** para o produto pedido.
