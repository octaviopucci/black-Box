# Module boundaries — Black Box Platform

Each directory under `src/modules/<domain>/` is a **domain boundary**.

## Layers (when beneficial)

```
modules/<domain>/
  domain/          # entities, value objects, domain rules
  application/     # use cases, orchestration
  infrastructure/  # persistence, external adapters
  presentation/    # HTTP handlers, UI adapters (if domain-specific)
```

Not every module needs all four layers on day one. Add layers when they reduce complexity.

## Rules

1. **No cross-module internals** — `sales` must not import from `modules/products/infrastructure/*`.
2. **Public contracts** — cross-module calls go through explicit exports (future: `modules/products/public.ts`).
3. **Shared kernel** — use `src/lib/*` and `src/config/*` for cross-cutting concerns only (logging, errors, db client, env).
4. **API routes** — live in `src/app/api/*` and delegate to module application layer (starting Mission 02+).

## Module map (future missions)

| Module | Mission |
|--------|---------|
| `foundation` | 01 (this mission) |
| `auth`, `organization` | 02 |
| `rbac` | 03 |
| `partners` | 04 |
| `leads`, `crm` | 05–06 |
| `products` | 07 |
| `sales`, `commissions` | 08–09 |
| `forms` | 10 |
| `projects` | 11 |
| `dashboards` | 12 |
| `notifications` | 13 |
| `audit` | 14 |

Do not implement business logic in empty module folders until the corresponding mission starts.
