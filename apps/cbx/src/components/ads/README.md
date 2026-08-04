# Ads / monetização (futuro AdMob + AdSense)

Camada visual atual: **rewarded video mock** no plano gratuito.

## Placements

| ID | Quando |
|---|---|
| `app_open` | Ao abrir o app (shell principal) |
| `publish` | Antes de criar anúncio |
| `whatsapp` | Antes de abrir WhatsApp do vendedor |
| `chat` | Antes de liberar lista/conversas |
| `seller_phone` | Reservado — telefone do vendedor |

## Integração futura

1. Trocar `adsService.loadRewarded()` por SDK **AdMob Rewarded** (app nativo/PWA) ou unidade de vídeo/display conforme política.
2. **AdSense** costuma ser para web display; para vídeos recompensados em app o caminho usual é **AdMob**.
3. Manter `useAdGate()` e `RewardedAdHost` — só o player interno muda.
4. Não chamar SDK a partir das páginas; sempre via `services/ads-service.ts`.

Demo: em **Configurações**, alterne o plano entre gratuito / premium / empresarial.
