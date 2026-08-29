# Design tokens — Camada 3

Regras que separam site de agência de "Tailwind genérico de IA".

## Grid e espaçamento

- Base **8px**. Use múltiplos: 8, 16, 24, 32, 48, 64, 96, 128.
- Seções: padding vertical `py-16 md:py-24 lg:py-32` (128px desktop).
- Container: `max-w-6xl` ou `max-w-7xl`, `px-6 md:px-8`.
- Gap entre elementos irmãos: 16 ou 24 — consistente na página inteira.

## Tipografia

| Papel | Regra |
|-------|--------|
| Display / marca | Fonte expressiva via Google Fonts ou local — **nunca** Inter/Roboto/Arial como hero |
| Body | Sans legível, peso 400–500 |
| Eyebrow | 11px, uppercase, tracking largo (`0.2em+`) |
| H1 hero | `clamp(2.5rem, 6vw, 4.5rem)`, leading tight `0.9–1.05` |
| H2 seção | `clamp(1.75rem, 3vw, 2.75rem)` |
| Body | 16–18px, leading `1.6–1.75` |
| Mute | cor `--mute`, tamanho 14–15px |

## Cores (tokens CSS)

Sempre 4 tokens mínimos em `:root`:

```css
:root {
  --ink: #12110f;      /* texto principal */
  --paper: #f7f4ef;    /* fundo */
  --accent: #c4a574;   /* CTA, links, destaque */
  --mute: #6e6860;     /* secundário */
}
```

Nomeie tokens pela **marca**, não por cor crua (`--gold` ok se for ouro da marca).

### Paletas proibidas (cara de IA)

- Purple → indigo gradient hero
- Dark + purple glow + pill buttons everywhere
- Cream `#F4F1EA` + terracotta + serif genérico (clichê 2024–2025)
- Cinza `#64748b` + azul `#3b82f6` sem identidade

Derive accent do nicho/marca real (extraia de Instagram/site se tiver).

## Componentes

| Padrão | Regra |
|--------|--------|
| Botão primário | 1 estilo na página; padding generoso; hover com motion sutil |
| Cards | Raros — só quando são o container da interação |
| Navbar | Fixa, blur/backdrop ou sólida — transparente só se hero full-bleed pedir |
| CTA | 1 primário no hero; secundário ghost/outline se necessário |

## Atmosfera

- Grain sutil, gradiente radial ou foto full-bleed — não fundo flat `#fff`.
- `::selection` com accent da marca.
- Referência: `apps/clinica-harmonie/src/index.css`, `apps/porthal-imoveis/`.

## Regra de ouro

> Se remover o logo e a página parecer template de qualquer SaaS, refaça a direção visual.
