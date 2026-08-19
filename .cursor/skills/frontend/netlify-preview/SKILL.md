---
name: netlify-preview
description: >-
  Deploy preview temporário na Netlify ao finalizar um site em apps/* — sem merge
  nem PR. Gera URL com slug do especialista/marca, build de produção e senha
  padrão Site. Use quando o usuário pedir preview, deploy Netlify, visualizar
  site ou subir temporário.
paths:
  - "apps/**"
---

# Netlify Preview

Ao **finalizar** um site em `apps/<projeto>/`, suba um preview temporário na
Netlify para visualização imediata — **sem merge, sem PR obrigatório**.

Invoke with **`/netlify-preview`** (ou ao concluir `/prompt-site`).

## Regra de ouro

> Terminou o código → build → deploy → entregue URL + senha ao usuário.

Não espere merge. Não bloqueie preview por falta de PR.

## Senha padrão

| Modo | Senha | Usuário (se pedir login) |
| --- | --- | --- |
| **Com `NETLIFY_AUTH_TOKEN`** | `Site` | `site` |
| **Anônimo (sem token)** | `My-Drop-Site` | — (limitação da Netlify Drop) |

Para usar **sempre** a senha `Site`, configure `NETLIFY_AUTH_TOKEN` no ambiente
(Personal access token em Netlify → Applications).

## Slug do domínio (prioridade)

O script tenta um subdomínio legível `{slug}.netlify.app`:

1. Argumento `--slug` explícito
2. Nome da pasta `apps/<slug>/`
3. Campo `name` em `src/data/site.ts` (slugificado)
4. Campo `handle` / Instagram em `site.ts`

Exemplos: `marcenaria-noe`, `dr-marcelo-prado`, `clinica-mussi-estetica`.

Máximo 37 caracteres, minúsculas, hífens.

## Workflow do agente

### 1. Identificar o app

```bash
# a partir da raiz do app
cd apps/marcenaria-noe
```

### 2. Garantir arquivos Netlify (criar se faltarem)

**`netlify.toml`**

```toml
[build]
  command = "npm ci && VITE_BASE=/ npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**`public/_redirects`**

```
/* /index.html 200
```

**`public/_headers`** (senha `Site` — gerado pelo script)

```
/*
  Basic-Auth: site:Site
```

### 3. Executar deploy

```bash
bash .cursor/skills/frontend/netlify-preview/references/deploy.sh apps/marcenaria-noe
```

Opções:

```bash
bash .cursor/skills/frontend/netlify-preview/references/deploy.sh apps/meu-app --slug dra-silva
bash .cursor/skills/frontend/netlify-preview/references/deploy.sh apps/meu-app --message "Hero v2"
```

### 4. Entregar ao usuário

Formato fixo:

```
Preview Netlify
URL:      https://{slug}.netlify.app
Senha:    Site
Usuário:  site   (só se pedir login HTTP Basic)
Expira:   ~60 min se deploy anônimo (claim ou reconecte Git para permanente)
```

Se anônimo, informe também a senha da Netlify Drop (`My-Drop-Site`) **antes** do
Basic-Auth, se aplicável.

## Quando rodar

- Site novo em `apps/*` concluído (componentes + build ok)
- Usuário pede “sobe na Netlify”, “quero ver o site”, “deploy preview”
- Final de `/prompt-site` + `/anti-ai-landing` — **último passo automático**

## Checklist pré-deploy

- [ ] `npm run build` passa localmente
- [ ] `VITE_BASE=/` no build (raiz do domínio Netlify)
- [ ] Imagens/assets em `public/` commitados ou presentes
- [ ] `netlify.toml` + `_redirects` existem
- [ ] Script executado e URL retornada

## Limitações

- Deploy **anônimo** expira em ~60 min e usa subdomínio aleatório se não houver token
- Com **`NETLIFY_AUTH_TOKEN`**: site nomeado `{slug}.netlify.app` + senha `Site` via `_headers`
- Preview **não substitui** deploy Git conectado para produção permanente

## Arquivos

- Script: [references/deploy.sh](references/deploy.sh)
- Template headers: [references/_headers](references/_headers)
