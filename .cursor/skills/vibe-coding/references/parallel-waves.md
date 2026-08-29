# Ondas paralelas (Cursor)

Adaptado de
[parallel-subagent-driven-development](https://github.com/soumatheusgomes/vibe-coding-toolkit/blob/main/templates/rules/parallel-subagent-driven-development.md).

## Quando paralelizar

Duas tasks na **mesma onda** só se:

1. Nenhuma depende da outra (direta ou transitivamente).
2. `Files:` totalmente disjuntos.

Na dúvida: `Depends-on: everything already listed` (degrada pra serial — seguro).

## Loop por onda

1. Dispare implementadores da onda **num único lote** (Task tool em paralelo).
2. Implementadores **não commitam** — reportam arquivos alterados.
3. Orquestrador commita **uma task por vez**, ordem fixa, HEAD capturado na hora.
4. Revisores da onda rodam **juntos**, cada um no range da sua task.
5. Só então próxima onda.

## Escape hatch

Duas tasks precisam dos mesmos arquivos → **não** force paralelo. Una numa task
só ou use worktree/branch isolada (último recurso).

## Exemplo (Black Box)

| ID | Descrição | Files | Depends-on | Especialista |
|----|-----------|-------|------------|--------------|
| T01 | API route nova | `api/chama.ts` | none | backend-specialist |
| T02 | Testes da route | `apps/chama/**/*.test.ts` | none | test-engineer |
| T03 | Botão na UI | `apps/chama/src/**/*.tsx` | T01 | frontend-specialist |

Onda 1: T01 + T02 (paralelo). Onda 2: T03.
