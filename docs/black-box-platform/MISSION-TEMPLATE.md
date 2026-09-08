# Missão NN — [Título]

> Copie este arquivo para `docs/black-box-platform/missions/NN-slug.md` antes de executar.
> Preencha todas as seções. Campos vazios = missão não está pronta para implementação.

---

## CONTEXT

Por que esta missão existe no roadmap. Qual camada do produto ela cobre. O que já existe das missões anteriores que esta missão assume como dado.

---

## MISSION OBJECTIVE

Uma frase verificável do que fica pronto ao concluir esta missão.

---

## DEPENDS ON

| Missão | Entrega assumida |
|--------|------------------|
| NN | … |

**Paralelo com:** *(se aplicável — ex.: Missão 07 após 04)*

---

## FILES

Paths exatos que esta missão cria ou modifica. O orquestrador vibe-coding usa isso para ondas paralelas.

```
platform/
  modules/…
  migrations/…
  …
```

---

## SCOPE

Lista fechada do que **entra** nesta missão.

- [ ] …
- [ ] …

---

## OUT OF SCOPE

Explicitamente **fora** desta missão (evita scope creep).

- …
- …

---

## DATA MODEL

Entidades, campos essenciais, relacionamentos, migrations necessárias.

| Entidade | Campos-chave | Relacionamentos |
|----------|--------------|-----------------|
| … | … | … |

---

## BUSINESS RULES

Regras de domínio que o código deve enforced — não só documentar.

1. …
2. …

---

## PERMISSIONS

Permissões RBAC novas ou consumidas (`module.action`).

| Permissão | Quem | Descrição |
|-----------|------|-----------|
| `….view` | … | … |
| `….create` | … | … |

Escopo multi-tenant e parceiro: como o backend determina o que o usuário vê.

---

## API / BACKEND

Endpoints, operações não-CRUD, transações, idempotência.

| Método | Rota | Descrição |
|--------|------|-----------|
| … | … | … |

Serviços e regras em `/modules/<domínio>/`.

---

## FRONTEND

Telas, fluxos, navegação, mobile-first. Papéis que veem cada tela.

- …

---

## VALIDATIONS

Input validation server-side. Campos obrigatórios, formatos, limites.

- …

---

## ERROR HANDLING

Códigos HTTP, mensagens, estados inválidos, rollback transacional quando aplicável.

- …

---

## TESTS

| Tipo | O que testar |
|------|--------------|
| Unitário | … |
| Integração | … |
| Autorização | IDOR, cross-tenant, escopo parceiro |
| E2E | *(se aplicável nesta missão)* |

Comandos de verificação:

```bash
# preencher com comandos reais após Missão 01
```

---

## ACCEPTANCE CRITERIA

Checklist observável — comportamento, não intenção.

- [ ] …
- [ ] …

---

## DO NOT

Anti-patterns proibidos nesta missão.

- Não implementar …
- Não mover autorização para o frontend
- Não confiar em `?partner_id=` do cliente
- Não …

---

## FINAL VERIFICATION

Passos manuais ou automatizados para fechar a missão antes do commit.

1. …
2. …
3. Todos os testes passam
4. Revisão independente (code-reviewer) sem achados CRITICAL/HIGH
