# Extração de conhecimento da VSL

Operação de **inteligência de copy** antes de escrever qualquer passo do quiz.
O agente investiga; não improvisa.

---

## Fontes aceitas (prioridade)

1. **Transcrição** — `.txt`, `.srt`, `.vtt` colado pelo usuário
2. **Roteiro** — Google Doc, Notion, markdown
3. **URL de página** — HTML estático (XQuiz, Elementor, custom)
4. **Vídeo** — transcrever com Whisper/ffmpeg antes de mapear

Se só houver URL com player (Vturb, YouTube, Wistia), extraia metadados visíveis
e peça transcrição para o conteúdo falado.

---

## Blocos clássicos de VSL

Mapeie cada trecho para um destes blocos. Nem toda VSL tem todos; marque ausentes.

| Bloco | O que capturar | Sinais na fala |
|-------|----------------|----------------|
| **hook** | Promessa + curiosidade | primeiros 30–90s, "se você..." |
| **identificação** | "Eu sei como é" | história pessoal, empatia |
| **problema** | Dor principal | frustração, promessa quebrada |
| **agitação** | Consequência de não agir | custo de adiar, vergonha |
| **reframe** | Nova lente | "não é X, é Y" |
| **mecanismo** | Como funciona a solução | protocolo, sistema, método |
| **prova** | Resultados, números, cases | depoimentos, "2.000 alunos" |
| **autoridade** | Quem fala | bio, track record |
| **filtro** | Pra quem NÃO é | "se você quer X, fecha" |
| **urgência** | Por que agora | janela, oportunidade |
| **oferta** | O que recebe + preço | stack, bônus, garantia |
| **fechamento** | CTA final | "decisão é sua" |
| **objeções** | FAQ implícito | "e se eu...", "mas..." |

---

## Extração de URL XQuiz / Story Quiz

Para páginas como `*.xquiz.click`:

```bash
curl -sL "URL" | python3 -c "
import sys, re, json
html = sys.stdin.read()
m = re.search(r'\"initialState\":(\{.*?\}),\"startChainNodeId\"', html)
if m:
    state = json.loads(m.group(1))
    funnel = state.get('funnel', {})
    for node in funnel.get('nodes', []):
        print(node.get('type'), node.get('data', {}).get('name', ''))
"
```

Capture de cada elemento:

| Elemento XQuiz | Campo útil |
|----------------|------------|
| `vturb` / `video` | player id, delay do CTA |
| `button` | texto CTA, `delayMinutes`, `delaySeconds`, `targetNodeId` |
| `text` | copy HTML (strip tags) |
| `image` | alt, providerId |
| `link` function | URL checkout |
| `quiz` / `questionario` | perguntas e opções |

**Exemplo real — SQ VSL 1 (Luiggi Stecca):**

- CTA: "QUERO VENDER NA INTERNET"
- Delay botão: 51 min 23 s (atrelado ao vídeo)
- Checkout: Hotmart `B107136995W`
- Bio: interior SP, Kerolly, 2.000 alunos, milhões em funis
- Pixel: Meta `1672340661563988`

Ver [vsl-storyquiz-example.md](vsl-storyquiz-example.md).

---

## Extração de vídeo (sem transcrição)

```bash
# Baixar áudio (ajuste URL do stream se necessário)
ffmpeg -i "video.mp4" -vn -acodec mp3 vsl-audio.mp3

# Transcrever (Whisper local ou API)
whisper vsl-audio.mp3 --language Portuguese --output_format txt
```

Segmente a transcrição por timestamps a cada ~2–4 minutos para alinhar com
passos do quiz.

---

## Saída da extração (obrigatória)

Antes de gerar `quiz.ts`, produza:

### 1. Resumo executivo (5 linhas)

Produto, promessa, mecanismo, prova principal, oferta.

### 2. Tabela bloco → passo

```markdown
| # | Bloco VSL | Trecho-chave (≤15 palavras) | Tipo passo | id |
|---|-----------|----------------------------|------------|-----|
| 1 | hook | "funis de vendas diretos sem aparecer" | pitch | hook |
| 2 | autoridade | "2.000 alunos, múltiplos milhões" | pitch | social-proof |
```

### 3. Perguntas de qualificação (rascunho)

Derivadas das objeções e segmentos mencionados na VSL:

- Objetivo do lead
- Maior bloqueio
- Situação/nível atual

### 4. Oferta estruturada

- Stack (bullets do que recebe)
- Planos/preços (copiar exato da VSL — não inventar)
- Garantia
- FAQ (máx 3–5)

### 5. Provas

Só depoimentos/números **literais** da VSL. Se não houver, deixe `proofs: []` e
avise o usuário.

---

## Regras de fidelidade

- Números intactos ("2.000 alunos", "R$ 97,70")
- Nomes próprios intactos
- Claims médicos/financeiros: copiar disclaimer da VSL se existir
- Não adicionar bônus que a VSL não menciona
- Tom: espelhar registro (informal "tá" vs formal "está")
