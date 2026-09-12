# Vibe Coding pelo iPhone

Claude Code CLI **não roda no iPhone**. O caminho prático é **Cursor Cloud Agent**
— o mesmo fluxo desta skill, disparado do celular.

## Setup (uma vez)

1. Conta Cursor com Cloud Agents habilitado.
2. Repo **black-Box** conectado ao ambiente Cursor (já é o caso deste projeto).
3. `AGENTS.md` + skills no repo (carregam automaticamente).

## Como disparar do celular

### Opção A — Cursor no Safari (recomendado)

1. Abra [cursor.com/agents](https://cursor.com/agents) no iPhone.
2. Escolha o repo **black-Box** e o branch desejado.
3. Envie o pedido. Exemplos:

```
/vibe-coding adiciona export CSV no app chama
```

```
/agency-premium Clínica Sol — saúde, WhatsApp 5562999887766, slug clinica-sol
```

```
/vibe-coding rápido: botão voltar no quiz do rian
```

### `/agency-premium` no iPhone (site completo)

**Modo mais fácil** — uma frase, landing pronta:

1. Cursor → **Agents** → repo **black-Box**
2. Cole:

```
/agency-premium [NOME DA MARCA] — [o que faz], WhatsApp [número], slug [nome-curto]
```

3. Espere (minutos). O agente cria `projects/nome-curto/` e abre PR.
4. Refinar: *“headline do hero: …”* ou *“cor laranja mais forte”*

**Não precisa** digitar ok entre seções. **Não** roda nada no celular — tudo na nuvem.

### Opção B — Atalho iOS (1 toque)

Crie um **Atalho** que abre uma URL:

```
https://cursor.com/agents?repo=octaviopucci/black-Box&prompt=SEU_PEDIDO_URL_ENCODED
```

Substitua `SEU_PEDIDO_URL_ENCODED` pelo texto codificado (espaço → `%20`).

### Opção C — GitHub Issues (hands-off)

1. Crie issue no GitHub com label que dispara Cloud Agent (se configurado).
2. Título = pedido curto; corpo = contexto + `/vibe-coding` ou `/agency-premium`.
3. Acompanhe pelo app GitHub ou pelo link do agent run no Cursor.

## O que funciona no iPhone

| Funciona | Não funciona no iPhone |
|----------|-------------------------|
| Cloud Agent com skill + AGENTS.md | `claude` CLI local |
| `/agency-premium` → site em `projects/` | `npm run dev` local |
| Brainstorm / plano / implementação | Plugins `/plugin install` do Claude Code |
| Subagentes via Task tool | Terminal interativo longo |
| PR + commits pushados | Preview no browser sem deploy/screenshot* |

\*Peça *“grava tela scrollando”* ou deploy Vercel no thread do agente.

## Fluxo ideal no celular

**Site novo (`/agency-premium`):**

1. Uma frase com marca + WhatsApp + slug
2. Espere o agente
3. Pronto — ajustes em mensagens seguintes

**Feature/bug (`/vibe-coding`):**

1. Mande o pedido (1 frase + app/path se souber).
2. Responda brainstorm em bullets (30 s).
3. Digite **ok** no plano.
4. Saia — o agente implementa e abre PR.

## Dicas

- Peça **PR draft** se quiser revisar no GitHub mobile antes de merge.
- Para UI de apps Vite: inclua "deploy preview" ou `dev:chama`.
- Use `/vibe-coding direto` só pra coisa microscopicamente óbvia.

## Troubleshooting

- **Agente só planejou, não criou pasta:** diga *“segue /agency-premium regra zero, roda scaffold-premium.sh agora”*
- **Run parou pedindo aprovação:** responda no thread do agente no Safari.
- **Quero só ideia, sem código:** diga "só brainstorm, não implementa ainda".
