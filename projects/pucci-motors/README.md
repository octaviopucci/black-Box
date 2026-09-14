# Pucci Motors

Site da loja **Pucci Motors** — hero cinematic (NA Veículos) + estoque live via **LP Motors Gestor**.

## Gestor

Cadastre veículos em `/lp-motors/` (LP Motors). Só entram no site os com status **Pronto para venda** ou **Anunciado** (não aparecem em preparação/oficina).

## Variáveis

| Env | Uso |
|-----|-----|
| `NEXT_PUBLIC_LP_ORG_SLUG` | Slug da org no Blob LP Motors (default: `pucci-motors`) |
| `NEXT_BASE_PATH` | Subpath no deploy (ex.: `/pucci-motors`) |

## Dev

```bash
npm run dev:pucci-motors
```

## Build

```bash
npm run build:pucci-motors
```
