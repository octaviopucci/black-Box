# Hardening zero custo — MesaFlow

> Pacote aplicado em 2026-09-18. Nenhum serviço pago novo (Postgres, Redis pago, pentest).

## O que entrou

| Item | Implementação |
|------|----------------|
| CSP + security headers | `src/lib/security-headers.ts`, `next.config.ts`, `vercel.json` |
| Cookies HttpOnly admin/platform | `mf_as`, `mf_ps` — `src/lib/staff-session-cookie-web.ts` |
| PII co-mesa | `phoneDisplay` removido de `publicParticipation()`; só em `/guest/me` |
| Senha forte | `src/lib/password-policy.ts` — 10+ chars, maiúsc/minúsc/número |
| Signup por convite (override) | `MESAFLOW_SIGNUP_INVITE_ONLY=1` + `MESAFLOW_SIGNUP_INVITE_CODE` |
| Cloudflare Turnstile | `src/lib/turnstile.ts` — opt-in; sem keys = skip |
| Backup/restore | `scripts/backup-store.mjs`, `scripts/restore-store.mjs` |
| Audit log | `src/lib/audit-log.ts` — login, kick, DSR, password, platform |
| Testes security | `test:security` expandido |
| Health público | `src/lib/public-health.ts` — diagnóstico só com secret |
| Demo QR | `demo-qr.ts` — tokens `mesa-N` bloqueados em prod |
| Runbook | `docs/INCIDENT-RUNBOOK.md` |

## Env vars opcionais

| Variável | Uso |
|----------|-----|
| `TURNSTILE_SITE_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Widget Turnstile |
| `TURNSTILE_SECRET_KEY` | Verify server-side |
| `MESAFLOW_SIGNUP_INVITE_CODE` | Código de convite (quando invite-only) |
| `MESAFLOW_SIGNUP_INVITE_ONLY=1` | Exigir convite no cadastro (default: signup aberto + aprovação) |
| `MESAFLOW_HEALTH_SECRET` | Health detalhado (`X-Mesaflow-Health-Secret`) |
| `MESAFLOW_ALLOW_DEMO_SEED=1` | Seed demo em prod (evitar) |
| `MESAFLOW_IDENTITY_SECRET` | Obrigatório em prod (fail-closed) |

## Verificação

```bash
cd projects/mesaflow
npm ci --include=dev
npm run test:security
npm run test:admin
npm run test:guest
npm run test:platform
npm run build
```

## Fora deste pacote (P1 pagos)

- Postgres/Neon transacional (ADR-001)
- Redis/Upstash dedicado
- Pentest externo

Ver `docs/PRODUCTION-READINESS.md` para matriz completa.
