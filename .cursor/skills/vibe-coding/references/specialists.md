# Roteamento de especialistas

Use a Task tool com o `subagent_type` ou descrição que melhor encaixa.

| Especialista | Quando usar |
|--------------|-------------|
| `orchestrator` | Multi-domínio, várias ondas, coordenação |
| `backend-specialist` | `api/**`, Fastify, serverless Vercel, PIX gateway |
| `frontend-specialist` | `apps/**/src/**`, `portal/**`, UI React + Vite |
| `test-engineer` | Testes, TDD, cobertura de edge cases |
| `code-reviewer` | Revisão pós-implementação (nunca quem implementou) |
| `security-reviewer` | Auth, input, secrets, OWASP — antes de merge sensível |
| `database-architect` | Schema, migrations, queries pesadas |
| `explore` | Mapear codebase grande antes de planejar |
| `generalPurpose` | Tarefa ampla sem especialista óbvio |

**Black Box — atalhos de path:**

- Portal: `portal/`
- Apps cliente: `apps/<nome>/`
- APIs Vercel: `api/`
- Deploy: `vercel.json`, `.github/workflows/`
- Builds: `npm run dev:*` / `npm run build:*` na raiz
