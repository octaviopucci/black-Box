# Pucci Motors

Site da loja **Pucci Motors** — hero cinematic (NA Veículos) + estoque live via **LP Motors Gestor**.

## Gestor

Cadastre veículos em `/lp-motors/` (LP Motors). Só entram no site os com status **Pronto para venda** ou **Anunciado** (não aparecem em preparação/oficina).

### Demo (18 carros de luxo)

Na primeira visita ao catálogo, a API cria automaticamente a loja `pucci-motors` com 18 veículos (Porsche, BMW, Mercedes, Ferrari, Aston Martin, etc.). **15 aparecem no site**; 3 ficam em preparação/negociação para testar o filtro.

**Login gestor demo:**
- Loja: `pucci-motors`
- Usuário: `admin`
- Senha: `PucciMotors123`

Forçar re-seed: `POST /api/lp-motors/init/pucci-motors`

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
