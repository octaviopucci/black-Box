# Premium composition — layout e ritmo visual

Referência: [ARP Fibra](https://grupoarpfibra.com.br/). Complementa
[design-tokens.md](design-tokens.md) + `anti-ai-landing`.

Tier **Premium** = long-form landing com **identidade visual forte** e **1
momento scroll cinematográfico**.

---

## Hero — stack de camadas

Mínimo **5 camadas** empilhadas (`absolute inset-0` + conteúdo acima):

| # | Camada | Função |
|---|--------|--------|
| 1 | Gradiente radial de marca | Profundidade, cor base |
| 2 | Foto/texture blur (`next/image`, `priority`) | Humaniza, evita flat gradient |
| 3 | Overlays soft-light (2–4 radiais) | Luz nos cantos |
| 4 | Vignette vertical | Legibilidade headline |
| 5 | Grain SVG (`feTurbulence`, `mix-blend-mode: overlay`) | Tira cara de template |
| 6 | Grid decorativo (linhas 1px, baixa opacidade) | Editorial/tech |
| 7 | Visual principal + props flutuantes | Mascote, produto ou ilustração 3D |

**Layout hero:**
- `min-h-[100svh]`, `overflow-hidden`
- Headline à esquerda ou central; visual à direita/centro
- **CTA duplo:** comercial (sólido) + contato (outline)
- **Badges** horizontais abaixo: 3–4 benefícios curtos com ícone

**Tipografia hero** (globals.css):

```css
.text-hero {
  font-size: clamp(2.6rem, 7vw, 6.2rem);
  line-height: 0.98;
  letter-spacing: -0.035em;
}
.text-section {
  font-size: clamp(2rem, 4.6vw, 3.9rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
}
.text-eyebrow {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}
```

Display ≠ body: ex. **Sora** + **Inter** via `next/font`. Nunca Inter no hero.

---

## Ritmo de seções (alternância)

Evite três blocos brancos seguidos. Padrão recomendado:

```
[Hero escuro/colorido]
→ [Pinned lifestyle — escuro #08080a]
→ [Features — branco]
→ [Statement laranja/accent full-bleed + notch/wave no topo]
→ [About / prova local — branco, split 60/40]
→ [Pricing — fundo bege/claro]
→ [Benefícios grid — bege]
→ [Produto secundário — split]
→ [App / central — branco]
→ [FAQ — branco ou bege]
→ [Social proof — cards ou depoimentos]
→ [Footer CTA accent + footer escuro]
```

**Notch/wave:** divisor SVG ou clip-path no topo de seções accent — transição
suave entre blocos escuro ↔ laranja.

---

## Seção pinned (lifestyle)

O “momento wow” da landing. Composição:

```
┌─────────────────────────────────────┐
│  gradient top fade (#08080a)        │
│     [prop parallax]    [prop]       │
│         HEADLINE (crossfade)        │
│            [globo/mascote]          │
│     [prop]              [prop]      │
│  gradient bottom fade               │
└─────────────────────────────────────┘
         ↑ sticky 100svh enquanto scrolla
```

- Fundo: `#08080a` ou equivalente `--ink`
- Headlines: benefício emocional, `clamp` grande, text-shadow sutil
- Props: PNG/WebP 3D com `-rotate-6` / `rotate-3` alternados
- **1 visual central** (globo CSS, mascote, produto)

Detalhe motion: [premium-motion.md](premium-motion.md).

---

## Pricing cards

- 3 colunas desktop; stack mobile
- Card destaque: badge “Recomendado” / “Mais velocidade”
- Preço em `--accent`, tamanho extra
- Features: bullets com dot colorido
- CTA: primário preenchido no card destaque; outline nos demais
- Fundo de seção: tom claro quente (`--surface` / bege), não branco puro

Hover: `translateY(-4px)` + shadow — Tailwind `transition` ou Framer.

---

## Prova social e local

Premium ≠ stock genérico:

- Foto real do negócio/equipe (cantos arredondados)
- Número grande de impacto (“13 anos”, “500+ clientes”)
- Depoimentos com nome + contexto (“Mãe do Pedro, cliente”)
- Badges pills: investimento local, emprego, comunidade (se aplicável)

---

## Navbar

- `sticky top-0 z-50`
- Fundo escuro translúcido + `backdrop-blur` leve
- Âncoras para seções longas (Combos, Benefícios, FAQ…)
- CTA “Assine / Agende” sempre visível à direita
- Opacity/background reforça após scroll (GSAP ou CSS `scroll-state` se disponível)

---

## Footer

- Bloco CTA accent **antes** do footer (`py-20`, headline + 2 botões)
- Footer escuro: logo branca, colunas nav, contato com ícones
- WhatsApp FAB fixo: aparece após scroll (`opacity/translate` — Framer ok)
- Blur progressivo no rodapé (opcional): camadas `backdrop-filter` + mask gradient

---

## Mapa de seções — tier Premium

Construa **uma por vez** (ok do usuário entre elas):

| # | Seção | Obrigatória |
|---|--------|-------------|
| 1 | Navbar | sim |
| 2 | Hero layered | sim |
| 3 | Lifestyle pinned (scroll story) | sim |
| 4 | Por quê / features (grid 4) | sim |
| 5 | Statement accent full-bleed | sim |
| 6 | About / história | recomendado |
| 7 | Pricing | se comercial |
| 8 | Benefícios inclusos (grid) | recomendado |
| 9 | Produto secundário (split) | se aplicável |
| 10 | App / central / suporte | recomendado |
| 11 | FAQ | sim |
| 12 | Social proof | sim |
| 13 | Footer CTA + footer | sim |

Tier **Standard** mantém seções 1, 2 simplificado, 4 reduzido, 7, 11, 13.

---

## Assets mínimos (brief antes de codar)

Peça ou defina placeholder consciente:

1. Logo SVG/PNG (+ versão branca)
2. 1 mascote ou visual hero (3D render, ilustração, foto tratada)
3. 3–4 props lifestyle (PNG/WebP, fundo transparente)
4. 1 textura (grain opcional inline SVG; foto blur para hero)
5. Foto real para about (ou omitir seção)
6. Paleta: accent + ink + paper + surface

Sem mascote → substituir por **produto hero** forte (roteador, app mockup, etc.) —
nunca card genérico flutuando.

---

## Anti-patterns premium

- Hero = gradiente + headline + mockup laptop (template IA)
- Três pins seguidos
- Lottie decorativo em todo card
- Copy só técnica (“800 Mega”) sem benefício emocional
- Inter/Roboto em todo o site
- Seção pinned sem props ou sem crossfade (só texto parado)
