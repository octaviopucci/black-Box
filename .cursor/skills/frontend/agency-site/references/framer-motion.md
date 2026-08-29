# Framer Motion — Camada 2

Stack: `framer-motion` ^12 (já padrão nos apps Black Box).

## Instalar (se faltar)

```bash
npm --prefix apps/<app> install framer-motion
```

## Padrões copy-paste

### Hero entrance

```tsx
import { motion } from 'framer-motion';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

<motion.div variants={stagger} initial="hidden" animate="show">
  <motion.h1 variants={rise}>...</motion.h1>
  <motion.p variants={rise}>...</motion.p>
</motion.div>
```

### Scroll reveal (seções)

```tsx
<motion.section
  initial={{ opacity: 0, y: 32 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-80px' }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
```

### CTA hover

```tsx
<motion.a
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
>
```

## Reduced motion

```tsx
import { useReducedMotion } from 'framer-motion';

const reduce = useReducedMotion();
// se reduce: sem animate, só render estático
```

Ou CSS global:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## O que NÃO fazer

- Bounce em tudo
- Parallax em 6 elementos
- Animação que atrasa leitura do headline
- Motion sem fallback reduced-motion

## Budget

Máximo **2–4** motions por página:

1. Hero entrance
2. Section reveals (reutilize o mesmo padrão)
3. CTA hover (opcional)
4. Um detalhe extra (ex.: logo sutil) — opcional

Para scroll cinematográfico pesado → skill `scroll-cinematic` (GSAP).
