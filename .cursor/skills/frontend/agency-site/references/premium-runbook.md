# Premium runbook — execução obrigatória

Use este arquivo quando o usuário invocar `/agency-site premium`.
**Não brainstorm. Não esperar ok. Executar na primeira resposta.**

---

## Gatilho

Qualquer uma destas frases → tier Premium + runbook:

- `/agency-site premium`
- `premium landing`
- referência ARP Fibra / scroll pinned / GSAP

---

## Passo 1 — Extrair contexto (silencioso)

| Campo | De onde | Fallback se faltar |
|-------|---------|-------------------|
| `slug` | `slug foo` no pedido | kebab-case da marca (`arp-fibra`) |
| `name` | nome da marca | slug humanizado |
| `niche` | texto do pedido | `serviços` |
| `whatsapp` | número no pedido | `5500000000000` + TODO no config |
| `ctaPrimary` | pedido | `Ver planos` |
| `ctaSecondary` | pedido | `Falar no WhatsApp` |

**Só perguntar** se não houver nem marca nem slug inferível.

---

## Passo 2 — Scaffold (terminal)

```bash
bash .cursor/skills/frontend/agency-site/scripts/scaffold-premium.sh <slug>
```

Se `projects/<slug>/` já existir → pular create-next-app; só sincronizar kit
faltante e `npm install`.

---

## Passo 3 — Customizar `src/site.config.ts`

Editar **só este arquivo** primeiro (copy, cores, links, pricing, FAQ).
Não reescrever componentes inteiros — o kit já funciona.

---

## Passo 4 — Build obrigatório

```bash
cd projects/<slug> && npm run build
```

Corrigir erros até verde antes de responder ao usuário.

---

## Passo 5 — Dev smoke (se possível)

```bash
cd projects/<slug> && npm run dev
```

Confirmar: hero carrega, pin scroll funciona, reduced-motion ok.

---

## Passo 6 — Resposta ao usuário

Entregar:

1. Path `projects/<slug>/`
2. Comandos dev/build
3. O que customizar em `site.config.ts`
4. Assets opcionais (`public/hero.webp`, props PNG)
5. Screenshot ou “abra localhost:3000” se dev rodou

**Não** listar 13 perguntas. **Não** pedir ok para próxima seção.

---

## Iteração (turnos seguintes)

Usuário pede refinamento → editar seção específica + build.
Erro comum: ver [errors.md](errors.md) E/F/G.

---

## Arquivos do kit (não reinventar)

```
references/premium-kit/
├── site.config.ts          → src/site.config.ts
├── globals.premium.css     → append em src/app/globals.css
├── README.md               → projects/<slug>/README.md
└── src/
    ├── app/layout.tsx
    ├── app/page.tsx
    ├── lib/prefers-reduced-motion.ts
    └── components/
        ├── providers/smooth-scroll.tsx
        └── sections/*.tsx
```
