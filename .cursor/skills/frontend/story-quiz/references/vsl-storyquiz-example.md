# VSL de referência — Story Quiz (Luiggi Stecca)

Página analisada: `https://aula-storyquiz.xquiz.click/` (SQ - VSL 1)

Esta VSL **ensina** o método Story Quiz; use como referência de estrutura,
não como copy a copiar para outros produtos.

---

## Metadados do funil XQuiz

| Campo | Valor |
|-------|-------|
| Nome | SQ - VSL 1 |
| Plataforma | XQuiz (Next.js) |
| Player | Vturb (`vid-6a90b720f9d1c1ef1dc8216f`) |
| Pixel | Meta `1672340661563988` |
| UTMs | Utmify ativo |

---

## Estrutura da página (VSL gate)

Ordem dos elementos:

1. **Logo/banner** — imagem "STORY QUIZ"
2. **Vídeo Vturb** — aula principal (conteúdo falado)
3. **Botão delayado** — "QUERO VENDER NA INTERNET"
   - Aparece após **51 min 23 s** de vídeo
   - Animação: pulse
   - Destino: checkout Hotmart
4. **Separador** — 80px
5. **Autoridade** — nome "Luiggi Stecca"
6. **Foto** — retrato
7. **Bio** — ver copy abaixo
8. **Rodapé** — ® Luiggi Stecca

---

## Copy extraída (literal)

**Bio:**

> Moro no interior de SP, marido da Kerolly (Sra. Stecca) e pai.
>
> Depois de escalar múltiplos milhões com funis de vendas diretos (sem
> aparecer) e ensinar mais de 2.000 alunos, decidi trazer um conteúdo que vai
> destravar seus resultados.
>
> Nessa aula eu falo tudo o que queria ter escutado quando comecei a criar funis.

**CTA:** QUERO VENDER NA INTERNET

**Checkout:** `https://pay.hotmart.com/B107136995W?off=dzlzpf3p&checkoutMode=10&offDiscount=AULA&bid=1787872853315`

---

## O que a VSL ensina (conceitos para mapear)

Quando o usuário passar **transcrição** desta aula, espere blocos sobre:

| Conceito | Provável passo Mode Caverna |
|----------|----------------------------|
| Funis de vendas diretos | hook / reframe-protocol |
| Low ticket / infoproduto | filter / offer |
| Quiz como substituto de VSL longa | reframe-protocol |
| Story = narrativa fatiada | how-it-works |
| Anúncios → quiz (não PV direta) | hook |
| Micro-compromissos | todos os pitch |
| Qualificação antes da oferta | question × 3 |
| Prova social (2.000 alunos) | social-proof |

---

## Diferença VSL page × Story Quiz completo

Esta URL é **só a isca de conteúdo** (aula gratuita/paga com delay).

O **Story Quiz de vendas** completo — como BASE em `protocolo-pav` — teria:

- 10+ telas pitch (narrativa interativa)
- 3 perguntas de qualificação
- Página de oferta com planos

Fluxo típico Luiggi Stecca / FVI:

```
Anúncio (Meta) → Story Quiz → Oferta → Checkout
                    ou
Anúncio → VSL page → CTA delayado → Checkout
```

No Black Box implementamos o primeiro path em React (`QuizV2Page`).

---

## Configuração técnica XQuiz (referência)

Para quem for replicar no XQuiz nativo:

- **Botão + delay:** `settings.delay: true`, `delayMinutes`, `delaySeconds`, `delayVideoId`
- **Tema:** background `#000000`, primary `#1a1a1a`, botão `#00ab6a`
- **Função link:** node separado com URL Hotmart/Kiwify

No Black Box, delay de vídeo = componente VSL separado; Story Quiz = stepper sem delay.

---

## UTM da campanha de referência

Origem: Facebook / Instagram Stories

```
utm_source=FB
utm_campaign=[SQ] [VSL1] [AD-IMG]|...
utm_medium=29-8-2026 [AD7 8 9] [IMAGENS]|...
utm_content=SQ - AD09|...
utm_term=Instagram_Stories
```

Preserve UTMs em links de checkout quando o usuário pedir paridade com campanha.
