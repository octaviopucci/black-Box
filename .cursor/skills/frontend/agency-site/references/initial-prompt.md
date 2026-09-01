# Prompt Premium — copiar e colar

O agente deve **executar** — não devolver este texto como plano.

```
/agency-site premium landing [MARCA] — [nicho], WhatsApp [n], slug [cliente-x]
```

## O que o agente faz (automático)

1. `bash .cursor/skills/frontend/agency-site/scripts/scaffold-premium.sh cliente-x`
2. Edita `projects/cliente-x/src/site.config.ts`
3. `npm run build` até verde
4. Responde com comandos dev + assets opcionais

## Prompt Standard (sem kit)

Ver seção Standard em [SKILL.md](../SKILL.md).

```
/agency-site landing [MARCA] — [nicho], WhatsApp [n], slug [cliente-x]
```
