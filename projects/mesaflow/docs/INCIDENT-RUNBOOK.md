# MesaFlow — Runbook de incidentes

> Resposta rápida sem serviços pagos extras. Atualize contatos em `DEPLOY.md`.

## Severidade

| Nível | Exemplo | SLA interno |
|-------|---------|-------------|
| S1 | Pedidos não persistem (`health.shared: false`) | 1h |
| S2 | Login/OTP indisponível | 4h |
| S3 | UI degradada, demo offline | 24h |

## 1. Pedidos não salvam (S1)

1. `curl -s https://<host>/api/mesaflow/health | jq`
2. Se `shared: false` → verificar Blob/Redis no projeto Vercel (Storage → Blob → Connect).
3. Diagnóstico completo (ops): header `X-Mesaflow-Health-Secret: $MESAFLOW_HEALTH_SECRET`.
4. Redeploy após corrigir env vars.
5. Comunicar lojistas afetados; pausar vendas novas se LWW persistir.

## 2. Conta comprometida / vazamento token

1. Rotacionar `MESAFLOW_IDENTITY_SECRET`, `MESAFLOW_ADMIN_SESSION_SECRET`, `MESAFLOW_PLATFORM_SESSION_SECRET`.
2. Forçar logout: limpar cookies `mf_as` / `mf_ps` (usuários re-logam).
3. Regenerar QR das mesas suspeitas (Admin → Mesas → Renovar QR).
4. Revisar `auditEvents` no store (tipos `staff.login`, `guest.kicked`, `dsr.*`).

## 3. Abuso OTP / login

1. Confirmar rate limit ativo (429 + headers `X-RateLimit-*`).
2. Ativar Turnstile: `TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`.
3. Bloquear IP na Vercel Firewall (plano Pro) ou reduzir tráfego via WAF Cloudflare (se front).

## 4. LGPD / exclusão urgente

1. Guest: `POST /api/mesaflow/guest/dsr/delete` (sessão guest).
2. Lojista OWNER: `POST /api/mesaflow/admin/dsr/delete`.
3. Confirmar audit `dsr.guest_delete` / `dsr.merchant_delete`.

## 5. Restore pós-incidente

Ver `docs/BACKUP-RESTORE.md`. Sempre `--dry-run` antes de restore real.

## Contatos

- Engenharia: ver owner do repo Black Box
- Vercel status: https://www.vercel-status.com/
