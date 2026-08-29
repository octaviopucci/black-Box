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
    --accent: 38 45% 62%;
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

- Display: `next/font/google` — fonte expressiva (não Inter como hero)
- Body: sans legível
- H1: `clamp(2.5rem, 6vw, 4.5rem)`
- Evitar Inter/Roboto/Arial como face principal da marca

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
