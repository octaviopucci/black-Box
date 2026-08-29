# Vibe Coding pelo iPhone

Claude Code CLI **não roda no iPhone**. O caminho prático é **Cursor Cloud Agent**
— o mesmo fluxo desta skill, disparado do celular.

## Setup (uma vez)

1. Conta Cursor com Cloud Agents habilitado.
2. Repo **black-Box** conectado ao ambiente Cursor (já é o caso deste projeto).
3. `AGENTS.md` + skill `vibe-coding` no repo (carregam automaticamente).

## Como disparar do celular

### Opção A — Cursor no Safari (recomendado)

1. Abra [cursor.com/agents](https://cursor.com/agents) no iPhone.
2. Escolha o repo **black-Box** e o branch desejado.
3. Envie o pedido. Exemplos:

```
/vibe-coding adiciona export CSV no app chama
```

```
Corrige o bug do login LP Motors — usuário demo não entra
```

```
/vibe-coding rápido: botão voltar no quiz do rian
```

O agente segue brainstorm → plano → ondas → revisão → commit sozinho.
Você só responde perguntas de escopo e dá **ok** no plano.

### Opção B — Atalho iOS (1 toque)

Crie um **Atalho** que abre uma URL:

```
https://cursor.com/agents?repo=octaviopucci/black-Box&prompt=SEU_PEDIDO_URL_ENCODED
```

Substitua `SEU_PEDIDO_URL_ENCODED` pelo texto codificado (espaço → `%20`).

Ou use o atalho para colar no clipboard e abrir o Cursor.

### Opção C — GitHub Issues (hands-off)

1. Crie issue no GitHub com label que dispara Cloud Agent (se configurado).
2. Título = pedido curto; corpo = contexto + `/vibe-coding`.
3. Acompanhe pelo app GitHub ou pelo link do agent run no Cursor.

## O que funciona no iPhone

| Funciona | Não funciona no iPhone |
|----------|-------------------------|
| Cloud Agent com skill + AGENTS.md | `claude` CLI local |
| Brainstorm / plano / implementação | Plugins `/plugin install` do Claude Code |
| Subagentes via Task tool | Terminal interativo longo |
| PR + commits pushados | Dev server local pra você testar no celular* |

\*Para ver UI: peça preview/deploy (Vercel) ou screenshot no run do agente.

## Fluxo ideal no celular (2 minutos de você)

1. **Mande o pedido** (1 frase + app/path se souber).
2. **Responda brainstorm** em bullets (30 s).
3. **Digite "ok"** no plano.
4. **Saia** — o agente implementa, revisa e abre PR.
5. **Notificação** — volte só se o agente perguntar ou pra merge.

## Dicas

- Peça **PR draft** se quiser revisar no GitHub mobile antes de merge.
- Para UI: inclua "deploy preview" ou nome do app (`dev:chama`, `dev:traco`).
- Pedidos vagos são OK — é exatamente pra isso que existe a Fase 1.
- Use `/vibe-coding direto` só pra coisa microscopicamente óbvia.

## Troubleshooting

- **Agente codou sem perguntar:** reforce "seguir vibe-coding Fase 1" ou use
  `/vibe-coding` no início.
- **Run parou pedindo aprovação:** responda no thread do agente no Safari.
- **Quero só ideia, sem código:** diga "só brainstorm, não implementa ainda".
