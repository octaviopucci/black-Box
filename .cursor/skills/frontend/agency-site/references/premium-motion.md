# Premium motion — GSAP + Lenis (Camada 2+)

Referência de produção: [ARP Fibra](https://grupoarpfibra.com.br/) — Next.js +
**GSAP ScrollTrigger** + **Lenis**, não Framer Motion no scroll principal.

Use quando o pedido for **premium**, **cinematic**, **scroll storytelling** ou
nível “site de agência top”.

---

## Stack premium

```bash
cd projects/<slug>
npm install gsap lenis
npm install -D @types/gsap   # se o TS reclamar
```

| Ferramenta | Papel |
|------------|-------|
| **Framer Motion** | UI leve: hover CTA, menu mobile, micro-stagger no hero load |
| **GSAP + ScrollTrigger** | Pin, scrub, parallax, crossfade de headlines, reveals |
| **Lenis** | Smooth scroll sincronizado com ScrollTrigger |

Framer Motion **não substitui** GSAP para pin/scrub. Ver
[framer-motion.md](framer-motion.md) — divisão de responsabilidades.

Skill complementar: `scroll-cinematic` (vídeo scrub, corridor horizontal).

---

## Provider Lenis + GSAP (obrigatório)

`src/components/providers/smooth-scroll.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('load', refresh)
      lenis.destroy()
    }
  }, [])

  return children
}
```

Envolva o `<body>` no `layout.tsx` (client wrapper ou layout aninhado).

---

## Padrão A — Seção pinned + scrub (lifestyle)

**1 viewport fixo**, conteúdo anima com o scroll. Máximo **1 seção pinned**
por landing (não encadeie pins).

Estrutura:

```tsx
<section ref={sectionRef} className="relative h-[300vh]"> {/* altura = duração */}
  <div className="fv-stage sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
    {/* camadas: bg, props parallax, headline stack, visual central */}
  </div>
</section>
```

Timeline (extraído do padrão ARP):

```tsx
useLayoutEffect(() => {
  if (prefersReducedMotion()) return

  const section = sectionRef.current
  if (!section) return

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        pin: '.fv-stage',
        invalidateOnRefresh: true,
      },
    })

    // Crossfade headlines empilhadas (grid col-start-1 row-start-1)
    tl.to(headlineA.current, { autoAlpha: 0, duration: 0.22, ease: 'none' }, 0)
    tl.fromTo(headlineB.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22 }, 0.35)
    // ... headline C

    // Parallax por data-attribute
    section.querySelectorAll('[data-parallax]').forEach((el) => {
      const depth = Number((el as HTMLElement).dataset.parallax)
      tl.to(
        el,
        {
          y: () => -(section.clientHeight * depth) / 100,
          duration: 1,
          ease: 'none',
        },
        0,
      )
    })
  }, section)

  return () => ctx.revert()
}, [])
```

**Valores `data-parallax`:** 8–48 (quanto maior, mais deslocamento). Props de
fundo ~14–18; elemento central ~48.

**Copy:** 3 headlines de **benefício emocional** (“Home office sem quedas”),
não spec técnica.

---

## Padrão B — Parallax leve (hero props)

CSS puro para flutuação idle — **sem scroll**:

```css
@keyframes heroFloatA {
  0%, 100% { transform: translate(0) rotate(-4deg); }
  50% { transform: translateY(-18px) rotate(2deg); }
}
.hero-float-a { animation: heroFloatA 7s ease-in-out infinite; }
.hero-float-b { animation: heroFloatB 9.5s ease-in-out -2.5s infinite; }
```

Desincronize durações e delays para evitar movimento robótico.

---

## Padrão C — Scroll reveal

Classe inicial + GSAP ou IntersectionObserver:

```css
.reveal-init {
  opacity: 0;
  transform: translateY(24px);
}
```

```tsx
gsap.from('.reveal-init', {
  opacity: 0,
  y: 24,
  duration: 0.6,
  ease: 'power3.out',
  stagger: 0.1,
  scrollTrigger: {
    trigger: container,
    start: 'top 75%',
    once: true,
  },
})
```

Alternativa leve: Framer `whileInView` — ok em tier Standard; premium prefere
GSAP para consistência com pin/scrub.

---

## Padrão D — CTA shine

Sweep de luz no botão primário (CSS, zero JS):

```css
.btn-shine { position: relative; overflow: hidden; }
.btn-shine::after {
  content: '';
  position: absolute;
  inset-block: 0;
  inline-size: 35%;
  background: linear-gradient(115deg, transparent, rgba(255,255,255,0.65), transparent);
  animation: btn-shine-sweep 3.4s ease-in-out infinite;
  transform: skewX(-20deg);
}
@keyframes btn-shine-sweep {
  0% { transform: translateX(0) skewX(-20deg); }
  22%, 100% { transform: translateX(557%) skewX(-20deg); }
}
```

---

## Padrão E — Globo / visual central sem WebGL

Truque CSS leve (ARP Fibra):

```css
@keyframes globeSpin {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```

```tsx
<div className="relative overflow-hidden rounded-full h-[46vh] w-[46vh]">
  <div
    className="absolute inset-y-0 left-0"
    style={{
      width: '1280px',
      backgroundImage: "url('/globe-textura.jpg')",
      backgroundSize: '640px 100%',
      backgroundRepeat: 'repeat-x',
      animation: 'globeSpin 30s linear infinite',
    }}
  />
  {/* box-shadow inset simula volume 3D */}
</div>
```

Prefira **1 asset 3D/mascote** + props PNG/WebP a biblioteca 3D pesada.

---

## Timing e easing (referência)

| Uso | Duração | Easing |
|-----|---------|--------|
| Hover CTA | 150–250ms | ease-in-out |
| Reveal scroll | 400–600ms | power3.out |
| Pin/scrub | amarrado ao scroll | `ease: 'none'` |
| Float idle CSS | 7–10s loop | ease-in-out |
| btn-shine | 3.4s loop | ease-in-out |

---

## Reduced motion

```tsx
export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
```

Se `true`:
- Sem Lenis (scroll nativo)
- Sem pin/scrub — mostrar última headline + layout estático
- Manter hover mínimo (cor/opacidade, sem scale)

---

## Budget premium

| Elemento | Quantidade |
|----------|------------|
| Seção pinned + scrub | **1** |
| Scroll reveals (grupos) | 4–8 |
| Parallax layers (pinned) | 4–6 props |
| CSS float idle (hero) | 1–2 |
| Framer hover/micro | 2–3 |
| btn-shine | 1–2 CTAs principais |

**Não empilhar:** pin + vídeo scrub + corridor horizontal na mesma landing.

---

## Checklist antes de merge

- [ ] `ScrollTrigger.refresh()` após fonts/images
- [ ] Pin testado mobile (encurtar `end` ou desativar pin < md)
- [ ] `prefers-reduced-motion` testado
- [ ] Lenis destruído no cleanup
- [ ] Nenhum jank visível (DevTools Performance, scroll lento)
- [ ] CTA alcançável durante e após seção pinned
