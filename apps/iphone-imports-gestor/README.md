# iPhone Imports — Gestor

Painel de gestão: estoque por unidade, catálogo, categorias, CRM, multi-loja.

## Desenvolvimento

```bash
# Na raiz do monorepo
npm run dev:iphone-imports-gestor   # gestor em :5173
npm run dev:iphone-imports          # loja
```

O gestor usa a API em `/api/iphone-imports` (mesmo padrão LP Motors).

## Funcionalidades

- **Estoque**: cada aparelho é uma unidade (IMEI, série, cor, GB, bateria, loja)
- **Catálogo**: produtos publicados aparecem no site quando há estoque disponível
- **Multi-loja**: adicione filiais em Configurações; estoque separado por loja
- **CRM**: clientes + histórico de interações
- **Sincronização**: alterações vão para a API e refletem no site em tempo real

## Testes da lógica de estoque

```bash
npm run test:iphone-imports-api
```

13 testes automatizados comprovam: entrada → aparece no site, saída → some, zerou → esgotado.

## Deploy

```bash
npm run build:iphone-imports-gestor
```

Publica em `/iphone-imports-gestor/` no portal Black Box.
