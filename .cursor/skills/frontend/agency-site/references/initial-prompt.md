# Prompt — /agency-premium

O agente deve **executar** — não devolver plano.

```
/agency-premium [MARCA] — [nicho], WhatsApp [n], slug [cliente-x]
```

Exemplo:

```
/agency-premium Clínica Sol — saúde, WhatsApp 5562999887766, slug clinica-sol
```

## O agente faz (automático)

1. `bash .cursor/skills/frontend/agency-site/scripts/scaffold-premium.sh <slug>`
2. Edita `projects/<slug>/src/site.config.ts`
3. `npm run build` até verde

## Standard (landing simples)

```
/agency-site landing [MARCA] — [nicho], WhatsApp [n], slug [cliente-x]
```
