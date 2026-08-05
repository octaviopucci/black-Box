# CBX — App nativo (Capacitor)

Empacota o marketplace Next.js (export estático) em **Android** e **iOS** para publicar nas stores e usar **AdMob** (rewarded / interstitial).

```
Next.js (build:native) → out/ → Capacitor sync → Android Studio / Xcode → APK / IPA
```

## Pré-requisitos

### Android
- [Android Studio](https://developer.android.com/studio)
- JDK 21+
- Conta [Google Play Console](https://play.google.com/console) (taxa única)

### iOS
- Mac + [Xcode](https://developer.apple.com/xcode/)
- Conta [Apple Developer](https://developer.apple.com) (anual)

### AdMob
- Conta [AdMob](https://admob.google.com) vinculada ao AdSense
- Criar App + unidades **Rewarded** e **Interstitial**
- Trocar IDs de teste em `src/services/ads-service.ts` (`ADMOB_TEST_IDS`)

## Comandos

```bash
cd apps/cbx

# 1) Build web sem /cbx (obrigatório no app)
npm run build:native

# 2) Gerar plataformas (só na primeira vez)
npx cap add android
npx cap add ios          # somente no Mac

# 3) Sincronizar out/ → projetos nativos
npx cap sync

# Atalhos
npm run native:android   # build + sync android
npm run cap:android      # build + sync + abre Android Studio
npm run cap:ios          # build + sync + abre Xcode (Mac)
```

## Fluxo de publicação (Android)

1. `npm run cap:android`
2. No Android Studio: **Build → Generate Signed Bundle / APK**
3. Envie o `.aab` no Play Console
4. Preencha store listing (ícone, screenshots, política de privacidade)

## Fluxo de publicação (iOS)

1. `npm run cap:ios` (no Mac)
2. No Xcode: Signing & Capabilities (Team)
3. **Product → Archive → Distribute App**
4. App Store Connect

## AdMob no app

1. Instalar plugin (quando for ligar anúncios reais):

```bash
npm i @capacitor-community/admob
npx cap sync
```

2. Inicializar no boot nativo (ex.: `src/lib/native-boot.ts` chamado no `AppProviders`)
3. Implementar `adsService.loadRewarded` / `showRewarded` com o SDK
4. Manter o UI atual (`RewardedAdHost` + `useAdGate`) — só a camada de serviço muda

IDs de **teste** do Google já estão em `ADMOB_TEST_IDS`. Nunca publique com IDs de teste.

## Web vs Native

| | Web (`blckbox.vercel.app/cbx`) | App nativo |
|---|---|---|
| Build | `NEXT_BASE_PATH=/cbx` | sem basePath |
| Ads | mock / AdSense display | AdMob rewarded |
| Comando | `npm run build:web` (ou root `build:cbx`) | `npm run build:native` |

## App ID

`br.com.cbx.marketplace` — altere em `capacitor.config.ts` se precisar de outro pacote na Play/App Store.

## Observações

- Pastas `android/` e `ios/` são geradas localmente (`npx cap add …`) e devem ser commitadas quando estabilizadas, ou geradas no CI.
- Splash/ícones: use `npx capacitor-assets generate` com arte em `assets/` (logo oficial em `public/brand/logo.png`).
- Push, câmera e geolocalização entram depois via plugins Capacitor — a arquitetura do app já está pronta.
