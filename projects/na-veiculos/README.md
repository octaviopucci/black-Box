# NA Veículos

Site da loja **NA Veículos** (Capão Bonito/SP) no template do Clow Tattoo
(`projects/estudio-clow-tattoo`): Next.js 16 · Tailwind 4 · export estático.

## Seções

Navbar → Hero → Sobre → Como comprar → Estoque → Entregas → **Quero comprar** → Contato → Footer + FAB WhatsApp.

- **Estoque** (`#estoque`): filtros por marca, lightbox com detalhes e botão *Quero este carro*.
- **Quero comprar** (`#orcamento`): formulário com **seleção do carro** (estoque disponível), nome,
  WhatsApp, cidade, forma de pagamento, carro na troca e mensagem. Envio abre o WhatsApp da loja
  com a mensagem pronta (`src/lib/whatsapp.ts`).

## Conteúdo

- `src/data/site.ts` — dados da loja, nav, serviços, avisos.
- `src/data/vehicles.ts` — estoque (`availableVehicles`) e entregas (`soldVehicles`). Fotos em `public/vehicles/`.

## Dev

```bash
npm install
npm run dev
```

## Build (Black Box, subpath `/na-veiculos/`)

Na raiz do monorepo:

```bash
npm run build:na
```

Publica em `public/na-veiculos/` → https://blckbox.vercel.app/na-veiculos/

Standalone (raiz do domínio): `npm run build` dentro desta pasta, saída em `out/`.
