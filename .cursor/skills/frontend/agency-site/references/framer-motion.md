# Framer Motion — Camada 2 (Next.js)

```bash
cd projects/<slug> && npm install framer-motion
```

## Regra App Router

Todo componente com `motion.*` precisa `'use client'`.

Componha: `page.tsx` (server) importa `<Hero />` (client).

## Hero entrance

```tsx
'use client'

import { motion } from 'framer-motion'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export function Hero() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.h1 variants={rise}>...</motion.h1>
      <motion.p variants={rise}>...</motion.p>
    </motion.div>
  )
}
```

## Scroll reveal

```tsx
<motion.section
  initial={{ opacity: 0, y: 32 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-80px' }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
```

## CTA hover

```tsx
<motion.a
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
>
```

## Reduced motion

```tsx
import { useReducedMotion } from 'framer-motion'

const reduce = useReducedMotion()
if (reduce) return <StaticHero />
```

## Budget

2–4 motions por landing. Scroll pesado → skill `scroll-cinematic` (GSAP, client only).
