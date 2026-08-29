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

- `loading="lazy"` + width/height em imagens
- Subset de fontes (2 pesos display + 2 body max)
- `npm run build:<app>` verde
- Lighthouse se pedido (meta 90+ performance)

---

## Honestidade

O hook "uma linha, 2 minutos" só funciona **com as 4 camadas**. Sem design tokens +
motion + referência de componentes, o resultado continua com cara de IA — rápido, mas ruim.
