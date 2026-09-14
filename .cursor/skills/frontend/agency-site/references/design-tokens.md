# Design tokens — Camada 3 (Next.js)

Arquivo: `projects/<slug>/src/app/globals.css`

## Integração shadcn + marca

shadcn já define `--background`, `--foreground`, `--primary`, etc. Adicione
tokens de marca **junto** (não substitua tudo):

```css
@layer base {
  :root {
    /* Marca (agency-site) */
    --ink: 24 10% 6%;
    --paper: 40 33% 96%;
    --surface: 30 40% 97%;   /* cards, bege — tier Premium */
    --accent: 38 45% 62%;
    --accent-deep: 22 75% 45%; /* hover CTA */
    --mute: 30 5% 42%;

    /* Opcional: alinhar shadcn primary à marca */
    --primary: var(--accent);
  }
}
```

Use com Tailwind arbitrary ou `@theme`:

```tsx
className="bg-[hsl(var(--paper))] text-[hsl(var(--ink))]"
```

Ou mapeie no `tailwind.config.ts` se preferir nomes semânticos (`text-ink`).

## Grid 8px

Base 8px — espaçamento 8, 16, 24, 32, 48, 64, 96, 128.

Seções: `py-16 md:py-24 lg:py-32`. Container: `max-w-6xl mx-auto px-6 md:px-8`.

## Tipografia

- Display: `next/font/google` — fonte expressiva (Sora, Satoshi, etc.)
- Body: sans legível (Inter, DM Sans, etc.) — **nunca** como hero display
- **Standard H1:** `clamp(2.5rem, 6vw, 4.5rem)`
- **Premium:** classes utilitárias em globals.css:

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
.text-glow {
  background: linear-gradient(100deg, hsl(var(--accent)), hsl(var(--accent-deep)));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

## Textura grain (Premium)

```css
.grain::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.25;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,..."); /* feTurbulence inline */
}
```

Ver hero layered: [premium-composition.md](premium-composition.md).

## Paletas proibidas (anti-IA)

- Purple→indigo hero gradient
- Dark + purple glow + pills everywhere
- Cream + terracotta clichê sem identidade

## Componentes

- Botão primário: 1 estilo; shadcn `Button` customizado com tokens da marca
- Cards: raros — anti-ai-landing
- Navbar: `sticky top-0 z-50` + backdrop-blur ou sólida

## Referência visual legado

Demos Vite antigas (`apps/clinica-harmonie/`) inspiram **direção**, não código —
novos projetos implementam a mesma disciplina em Next + globals.css.
