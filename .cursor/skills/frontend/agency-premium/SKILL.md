---
name: agency-premium
description: >-
  Site premium pronto na hora — invoque /agency-premium. Roda scaffold-premium.sh,
  entrega landing completa em projects/<slug>/ (GSAP/Lenis, hero layered, pin scroll).
  iPhone: Cloud Agent + uma frase. Override vibe-coding — executa, não pergunta.
paths:
  - "projects/**/*.{tsx,jsx,css,ts,js,html}"
  - ".cursor/skills/frontend/agency-site/**/*"
---

# /agency-premium

Landing **completa** estilo [ARP Fibra](https://grupoarpfibra.com.br/) — uma frase, site pronto.

Kit + script vivem em `.cursor/skills/frontend/agency-site/` (não reinventar).

---

## Regra zero (override vibe-coding)

Ao ver **`/agency-premium`**:

1. **Executar** — não brainstorm, não questionário, não “ok entre seções”
2. Rodar scaffold → editar config → build verde → responder

**Só perguntar** se faltar marca **e** slug ao mesmo tempo.

---

## Comando do agente

```bash
bash .cursor/skills/frontend/agency-site/scripts/scaffold-premium.sh <slug>
```

Depois:

1. Editar `projects/<slug>/src/site.config.ts` (copy, WhatsApp, planos)
2. `cd projects/<slug> && npm run build` até verde

Runbook: [../agency-site/references/premium-runbook.md](../agency-site/references/premium-runbook.md)

---

## Prompt do usuário

```
/agency-premium [MARCA] — [nicho], WhatsApp [n], slug [cliente-x]
```

Exemplo:

```
/agency-premium Clínica Sol — saúde, WhatsApp 5562999887766, slug clinica-sol
```

---

## O que já vem no kit (13 seções)

Hero layered · scroll pinned · features · pricing · FAQ · footer · GSAP · Lenis

Customização principal: **`src/site.config.ts`**

Detalhes: [../agency-site/references/premium-kit/](../agency-site/references/premium-kit/)

---

## iPhone — como usar (humano)

1. Abra **Cursor** → **Agents** (ou [cursor.com/agents](https://cursor.com/agents))
2. Repo **black-Box**
3. Cole:

   `/agency-premium NomeDaMarca — o que faz, WhatsApp 55..., slug nome-da-marca`

4. Espere o agente terminar (PR ou pasta `projects/nome-da-marca/`)
5. Para mudar texto: nova mensagem — *“troca headline do hero para …”*

Você **não** instala nada no celular. O robô monta o site na nuvem.

---

## Checklist antes de responder

- [ ] `projects/<slug>/` existe
- [ ] `npm run build` verde
- [ ] `site.config.ts` com dados do pedido
- [ ] Usuário sabe: `cd projects/<slug> && npm run dev` (no PC)

---

## Relacionado

| Skill | Quando |
|-------|--------|
| `/agency-site` | Landing simples (Standard, sem kit premium) |
| `/prompt-site` | Marca complexa antes de codar |
| `scroll-cinematic` | Vídeo no scroll, corridor horizontal |
