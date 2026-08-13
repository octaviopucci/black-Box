# Como mandar quiz v2 + Rian v2 para o repo do BASE

Este pacote está em `exports/base-funnels/` no black-Box.
O app em produção (`usebase.vercel.app`) é **outro repositório** (Next.js).
Este agente só tem acesso ao `black-Box` até você enviar o link do repo BASE.

## O que vai

1. **Quiz v2 (BASE principal)** — mesma copy, visual novo, planos atuais
2. **Quiz v2 Rian** — mesmo visual/copy, checkouts com `afid=wSk0NAct`
3. **Cadastro** — usar o cadastro **original** do BASE (`/cadastro`), não o clone local
4. **Planos/preços válidos (atuais)** — os antigos (Tijolo/Fundação/Inabalável) não valem mais

### Preços atuais

| Plano      | Preço     |
|------------|-----------|
| Mensal     | R$ 17,70  |
| Trimestral | R$ 37,70  |
| Anual      | R$ 97,70  |

### Checkouts BASE (principal)

- Mensal: https://pay.kiwify.com.br/ss3fR01
- Trimestral: https://pay.kiwify.com.br/F6PxeHX
- Anual: https://pay.kiwify.com.br/8IUShvx

### Checkouts Rian

- Mensal: https://pay.kiwify.com.br/5dDatgC?afid=wSk0NAct
- Trimestral: https://pay.kiwify.com.br/GCbUGh5?afid=wSk0NAct
- Anual: https://pay.kiwify.com.br/KljXpUY?afid=wSk0NAct

## Caminho rápido (você manda o repo)

1. Responda aqui com o link do GitHub do BASE (ex.: `https://github.com/octaviopucci/NOME`)
2. Ou adicione esse repo no Environment do Cloud Agent
3. Eu adapto as páginas pro Next.js do usebase, aponto cadastro pra `/cadastro`, atualizo `/planos` e faço o PR

## Caminho manual (sem me dar o repo)

1. Clone o repo do BASE na sua máquina
2. Copie:
   - `exports/base-funnels/assets/*` → `public/quiz-v2/` (ou equivalente)
   - `exports/base-funnels/quiz-v2/*` → componente/rota do funil principal
   - `exports/base-funnels/rian-v2/*` → rota afiliado (ex. `/rian` ou subdomínio)
3. Troque `react-router` `Link`/`useNavigate` pelos equivalentes do Next (`next/link`, `useRouter`)
4. Substitua os planos antigos pelos preços/checkouts acima
5. Em “Prefiro criar conta antes” / pós-cadastro, use a rota **original** `/cadastro` (e `/planos` com os planos novos)
6. Remova Tijolo / Fundação / Inabalável de qualquer config de planos

## Onde o código já roda hoje (black-Box)

- BASE v2: `/protocolo-pav/quiz-v2`
- Rian v2: `/rian/quiz-v2`
- Cadastro (ambos): `https://usebase.vercel.app/cadastro`
