# Memória entre sessões

## Estrutura

- **`MEMORY.md`** (raiz) — índice curto (~130 linhas max). Uma linha por memória.
- **`.cursor/memory/*.md`** — detalhe por tópico com frontmatter:

```yaml
---
type: architecture | business-rule | feedback | reference
title: Título curto
---
```

## Critério de salvar

> Uma sessão futura ficaria surpresa e grata de saber isso antes de trabalhar?

Se não → não salva.

## Exemplos Black Box

- Maciel e LP Motors são produtos **independentes** (paths/dados separados).
- Login demo Maciel: `admin` / `MacielMotors123`.
- Deploy unificado Vercel; builds via `npm run build` + `assemble-dist`.
- PIX gateway: `apps/pix-gateway`, API `/api/pix`.

## Migração

Memória grande demais pro índice → mova detalhe pra `.cursor/memory/`, deixe
só ponteiro no `MEMORY.md`.
