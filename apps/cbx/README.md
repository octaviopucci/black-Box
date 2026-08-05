# CBX — O Marketplace de Capão Bonito

Marketplace local Capão Bonito — front-end visual + shell nativo (Capacitor).

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 · Framer Motion · Zustand · Radix
- **Capacitor 8** → Android / iOS
- Ads: mock rewarded (web) → AdMob (nativo)

## Desenvolvimento web

```bash
npm run dev:cbx   # na raiz do monorepo
# ou
cd apps/cbx && npm run dev
```

## Build web (Black Box / Vercel)

```bash
NEXT_BASE_PATH=/cbx npm run build
# out/ → /cbx/ em blckbox.vercel.app
```

## App nativo

Guia completo: **[NATIVE.md](./NATIVE.md)**

```bash
cd apps/cbx
npm run build:native
npx cap add android    # primeira vez
npx cap sync
npm run cap:android    # abre Android Studio
```

## Arquitetura

```
src/
  app/           # rotas
  components/    # UI + ads (RewardedAdHost)
  services/      # mock + adsService (AdMob-ready)
  repositories/
  stores/        # Zustand (app + ads)
  types/
android/ | ios/  # gerados pelo Capacitor
```
