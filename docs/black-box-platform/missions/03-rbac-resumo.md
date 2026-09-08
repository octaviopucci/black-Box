# Missão 03 — RBAC + Authorization · Resumo Executivo

> **Status:** ✅ Completa  
> **PR:** [#148](https://github.com/octaviopucci/black-Box/pull/148)  
> **Depende de:** Missão 01 (Fundação) · Missão 02 (Auth + Organization)  
> **Código:** `platform/src/lib/authorization/`, `platform/src/modules/authorization/`

---

## 1. O que foi entregue

A Missão 03 implementa o **sistema central de autorização** da Black Box Platform. A partir dela, qualquer módulo futuro (Partners, Leads, Sales, etc.) pode proteger operações server-side sem conhecer detalhes internos do RBAC.

**Entregas principais:**

| Área | Entrega |
|------|---------|
| **Dados** | Models `Role`, `Permission`, `RolePermission`, `MembershipRole` |
| **Roles padrão** | `admin`, `gestor`, `parceiro` (por organização) |
| **Catálogo** | 20 permissions centralizadas em `PERMISSIONS.*` |
| **Contexto** | Resolução server-side: sessão → membership → roles → permissions |
| **Gates** | `hasPermission`, `requirePermission`, `hasRole`, etc. |
| **Bootstrap** | Seed idempotente de roles + permissions + ADMIN no usuário inicial |
| **API HTTP** | Endpoints de gestão de roles e atribuição em memberships |
| **Segurança** | Tenant isolation, anti-IDOR, anti privilege escalation |
| **Testes** | 36 testes passando (13 novos de autorização) |

---

## 2. Fluxo de autorização

```
REQUEST
   ↓
SESSION (cookie bb_session)
   ↓
USER
   ↓
ACTIVE MEMBERSHIP
   ↓
ORGANIZATION (tenant)
   ↓
ROLES (via MembershipRole)
   ↓
PERMISSIONS (via RolePermission)
   ↓
AUTHORIZATION GATE
   ↓
ALLOW / DENY
```

**Regra de ouro:** o frontend **nunca** define quem o usuário é, qual tenant está ativo ou quais permissions ele possui. Tudo é derivado da sessão e dos dados persistidos no banco.

---

## 3. Modelo de dados

```
Organization
 ├── Role (tenant-scoped)
 │     └── RolePermission → Permission (catálogo global)
 └── OrganizationMembership
       └── MembershipRole → Role
```

| Entidade | Escopo | Constraint principal |
|----------|--------|----------------------|
| `Permission` | Global | `key` única |
| `Role` | Por organização | `(organizationId, slug)` único |
| `RolePermission` | Role ↔ Permission | `(roleId, permissionId)` único |
| `MembershipRole` | Membership ↔ Role | `(membershipId, roleId)` único |

**Migration:** `platform/prisma/migrations/20260908015905_rbac/`

---

## 4. Roles padrão

Cada organização recebe três roles no bootstrap:

| Role | Slug | Escopo |
|------|------|--------|
| **ADMIN** | `admin` | Todas as permissions do catálogo atual |
| **GESTOR** | `gestor` | Permissions operacionais explícitas (sem RBAC admin) |
| **PARCEIRO** | `parceiro` | Apenas permissions comerciais |

**Importante:**

- Roles são **tenant-scoped** — não existem roles globais compartilhadas entre organizações.
- `ADMIN(X) ≠ ADMIN(global)` — admin de uma org não acessa outra org.
- Role **INACTIVE** não concede permissions.
- Membership ou organização **INACTIVE** → deny by default.

---

## 5. Catálogo de permissions

20 permissions registradas em `platform/src/lib/authorization/permissions.ts`:

### Organização e usuários
- `organization.read`, `organization.update`
- `user.read`, `user.update`

### Gestão de RBAC
- `authorization.role.read`
- `authorization.role.create`
- `authorization.role.update`
- `authorization.role.assign_permission`
- `authorization.membership.assign_role`
- `authorization.membership.remove_role`

### Comerciais (gates prontos para missões futuras)
- `partner.read`, `partner.create`
- `lead.read`, `lead.create`
- `opportunity.read`, `opportunity.create`
- `sale.read`, `sale.create`
- `commission.read`
- `project.read`

**Convenção:** usar sempre `PERMISSIONS.LEAD_CREATE` — nunca strings soltas no código.

---

## 6. Contrato público (para missões 04–15)

Qualquer módulo futuro importa da camada central:

```typescript
import {
  PERMISSIONS,
  requirePermission,
  hasPermission,
} from '@/lib/authorization'

// Em Route Handlers, Server Actions ou Server Components:
await requirePermission(PERMISSIONS.PARTNER_READ)  // 401 ou 403 se negado

const allowed = await hasPermission(PERMISSIONS.LEAD_CREATE, request)
```

### Helpers disponíveis

| Função | Uso |
|--------|-----|
| `getAuthorizationContext()` | Contexto completo (user, org, membership, roles, permissions) |
| `hasPermission(permission, request?)` | Verifica permission (retorna boolean) |
| `requirePermission(permission, request?)` | Exige permission (401/403) |
| `hasAnyPermission(permissions[])` | Qualquer uma das permissions |
| `hasAllPermissions(permissions[])` | Todas as permissions |
| `hasRole(slug, request?)` | Complementar — preferir permission |
| `requireRole(slug, request?)` | Complementar — preferir permission |

**Regra arquitetural:** `requirePermission(...)` é o mecanismo principal. Role é agrupador de permissions, não atalho de autorização.

---

## 7. API HTTP

Endpoints expostos para demonstrar e testar o contrato RBAC:

| Método | Rota | Permission exigida |
|--------|------|-------------------|
| GET | `/api/authorization/roles` | `authorization.role.read` |
| POST | `/api/authorization/roles` | `authorization.role.create` |
| PATCH | `/api/authorization/roles/:id` | `authorization.role.update` |
| POST | `/api/authorization/roles/:id/permissions` | `authorization.role.assign_permission` |
| DELETE | `/api/authorization/roles/:id/permissions/:permissionId` | `authorization.role.assign_permission` |
| POST | `/api/organizations/memberships/:membershipId/roles` | `authorization.membership.assign_role` |
| DELETE | `/api/organizations/memberships/:membershipId/roles/:roleId` | `authorization.membership.remove_role` |

---

## 8. Segurança

### Códigos HTTP

| Situação | Código | Comportamento |
|----------|--------|---------------|
| Sem sessão / sessão inválida | **401** | `UNAUTHORIZED` |
| Autenticado, sem permission | **403** | `FORBIDDEN` (mensagem genérica) |

Respostas **não expõem** roles internos, permissions ou estrutura RBAC.

### Proteções implementadas

| Ataque | Resultado |
|--------|-----------|
| IDOR — acessar role de outro tenant | 403 / 404 |
| Cross-tenant — atribuir role B em membership A | DENY |
| Self privilege escalation — PARCEIRO vira ADMIN | 403 |
| Payload `{ "role": "ADMIN" }` | Ignorado / negado |
| Payload `{ "organizationId": "..." }` | Ignorado — tenant vem da sessão |
| Permission injection no body | Ignorado — permissions vêm do banco |

### Atribuição de roles privilegiadas

Somente um membro com role **ADMIN** pode atribuir roles `admin` ou `gestor` a outro usuário.

---

## 9. Bootstrap

O comando existente da Missão 02 foi evoluído:

```bash
cd platform
npm run db:bootstrap
```

**O que faz (idempotente):**

1. Cria organização + usuário + membership (se não existirem)
2. Seed de permissions globais
3. Cria roles `admin`, `gestor`, `parceiro` na organização
4. Associa permissions a cada role
5. Atribui role `admin` ao usuário bootstrap

Executar múltiplas vezes **não duplica** dados.

---

## 10. Matriz de autorização (resumo)

| Contexto | Permission | Resultado |
|----------|------------|-----------|
| ADMIN | Qualquer do catálogo | ALLOW |
| GESTOR | Permission explicitamente concedida | ALLOW |
| GESTOR | Permission administrativa (RBAC) | DENY |
| PARCEIRO | Permission comercial permitida | ALLOW |
| PARCEIRO | Permission administrativa | DENY |
| Role INACTIVE | Qualquer | DENY |
| Membership INACTIVE | Qualquer | DENY |
| Org INACTIVE | Qualquer | DENY |
| Sem sessão | Qualquer | 401 |
| Outro tenant | Qualquer | DENY |

---

## 11. Estrutura de código

```
platform/
├── src/lib/authorization/
│   ├── permissions.ts    # PERMISSIONS.* + catálogo
│   ├── roles.ts          # ROLE_SLUGS + DEFAULT_ROLES
│   ├── context.ts        # getAuthorizationContext()
│   ├── gates.ts          # hasPermission, requirePermission, etc.
│   ├── types.ts
│   └── index.ts          # export público
├── src/modules/authorization/
│   ├── application/role-service.ts
│   └── infrastructure/rbac-seed.ts
├── src/app/api/authorization/
└── tests/authorization/
    ├── gates.test.ts
    ├── permissions.test.ts
    ├── tenant-isolation.test.ts
    └── privilege-escalation.test.ts
```

---

## 12. Como rodar e verificar

```bash
cd platform
npm run db:generate
npm run db:migrate:deploy
npm run db:bootstrap
npm run test          # 36 testes
npm run typecheck
npm run lint
npm run build
npm run dev           # http://localhost:3001
```

**Fluxo manual sugerido:**

1. Login com credenciais bootstrap
2. Sessão ativa → organização → membership com role `admin`
3. `GET /api/authorization/roles` → 200 (ADMIN tem `authorization.role.read`)
4. Criar usuário PARCEIRO e tentar atribuir ADMIN → 403

---

## 13. Testes

**36 testes passando** — inclui regressão das Missões 01 e 02.

| Suite | Cobertura |
|-------|-----------|
| `permissions.test.ts` | Catálogo único, constants alinhadas |
| `gates.test.ts` | ADMIN/GESTOR/PARCEIRO, inactive role, 401 |
| `tenant-isolation.test.ts` | Cross-tenant role list/assign |
| `privilege-escalation.test.ts` | PARCEIRO/GESTOR → ADMIN bloqueado |
| `bootstrap-rbac.test.ts` | Seed idempotente + ADMIN assignment |

---

## 14. O que NÃO foi implementado (escopo respeitado)

- Partner entity / módulo Partner
- Lead, CRM, Product, Offer, Sale, Commission
- Brief, Project, Dashboard, Notifications, AuditLog
- Painel administrativo completo
- SSO, MFA, password reset, signup público
- Redis / cache externo

Esses itens pertencem às Missões 04–15.

---

## 15. Próximo passo

**Missão 04 — Partners:** cadastro, ativação e produtos autorizados — consumirá `requirePermission(PERMISSIONS.PARTNER_*)` sem alterar o motor de autorização.

---

## Documentos relacionados

| Doc | Conteúdo |
|-----|----------|
| [03-rbac-authorization.md](./03-rbac-authorization.md) | Brief técnico da missão |
| [SUMMARY.md](../SUMMARY.md) | Resumo geral da plataforma |
| [platform/README.md](../../../platform/README.md) | Setup operacional |
| [MISSIONS.md](../MISSIONS.md) | Roadmap completo |
