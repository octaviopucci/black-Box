# 4 erros que matam o resultado

Do central-material — o agente deve **evitar ativamente** estes padrões.

## A — Pular a skill de design

**Sintoma:** Tailwind default, Inter, purple gradient, cards everywhere.

**Fix:** Sempre carregar Camada 3 — tokens CSS + `anti-ai-landing` antes do JSX.

## B — Prompt vago

**Sintoma:** "Faz uma landing bonita" → output genérico.

**Fix:** Nicho, marca, CTA, seções, slug `projects/<slug>/` — ou brainstorm (vibe-coding Fase 1).

## C — Não iterar

**Sintoma:** Primeiro output tratado como final.

**Fix:** Seção por seção; usuário aprova ou pede refinamento de espaçamento, contraste,
motion. Mínimo 1 rodada de polish no hero.

## D — Esquecer performance

**Sintoma:** Imagens enormes sem lazy, 6 font weights, animação pesada.

**Fix:** Antes de PR:

- `next/image` + dimensões; `next/font` com subset mínimo
- `cd projects/<slug> && npm run build` verde
- Lighthouse se pedido (meta 90+ performance)

## E — Premium sem GSAP/Lenis (Erro Premium)

**Sintoma:** Pedido “nível ARP” mas só Framer `whileInView` + hero gradiente flat.

**Fix:** Tier Premium exige [premium-motion.md](premium-motion.md):
Lenis provider, 1 pin+scrub, hero layered, btn-shine. Framer só micro-UI.

## F — Pin stacking (Erro Premium)

**Sintoma:** Duas ou mais seções pinned seguidas; scroll trava, UX ruim.

**Fix:** Máximo **1** seção pinned por landing. Demais seções: reveal simples.

## G — Motion sem reduced-motion (Erro Premium)

**Sintoma:** Pin/scrub ativo com `prefers-reduced-motion: reduce`.

**Fix:** Fallback estático — última headline visível, scroll nativo, sem Lenis.

---

## Honestidade

O hook "uma linha, 2 minutos" só funciona **com as 4 camadas**. Sem design tokens +
motion + referência de componentes, o resultado continua com cara de IA — rápido, mas ruim.
