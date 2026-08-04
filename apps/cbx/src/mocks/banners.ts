import type { Banner, Promotion } from '@/types'

export const banners: Banner[] = [
  {
    id: 'banner-1',
    title: 'O Marketplace de Capão Bonito',
    subtitle: 'Compre e venda com quem você conhece. Milhares de anúncios na sua cidade.',
    image: 'https://picsum.photos/seed/banner-cbx-hero/1200/500',
    cta: 'Explorar anúncios',
    href: '/busca',
    tone: 'primary',
  },
  {
    id: 'banner-2',
    title: 'Semana do Eletrônico',
    subtitle: 'Até 30% off em celulares, notebooks e acessórios das lojas parceiras.',
    image: 'https://picsum.photos/seed/banner-eletronicos/1200/500',
    cta: 'Ver ofertas',
    href: '/categoria/eletronicos',
    tone: 'secondary',
  },
  {
    id: 'banner-3',
    title: 'Venda sem complicação',
    subtitle: 'Anuncie grátis e alcance compradores em Centro, Jardim Europa, Vila Nova e toda a região.',
    image: 'https://picsum.photos/seed/banner-vender/1200/500',
    cta: 'Anunciar agora',
    href: '/anunciar',
    tone: 'accent',
  },
  {
    id: 'banner-4',
    title: 'Lojas verificadas CBX',
    subtitle: 'Compre com segurança nas lojas parceiras com selo de verificação.',
    image: 'https://picsum.photos/seed/banner-lojas/1200/500',
    cta: 'Conhecer lojas',
    href: '/lojas',
    tone: 'dark',
  },
]

export const promotions: Promotion[] = [
  {
    id: 'promo-1',
    title: 'Black Friday Capão Bonito',
    description: 'Descontos imperdíveis em eletrônicos, móveis e moda. Ofertas válidas apenas para a região de Capão Bonito.',
    discount: 'Até 40% OFF',
    image: 'https://picsum.photos/seed/promo-black-friday/800/400',
    productIds: ['prod-1', 'prod-5', 'prod-12', 'prod-18'],
    endsAt: '2026-11-30T23:59:59.000Z',
  },
  {
    id: 'promo-2',
    title: 'Feira de Troca de Games',
    description: 'Troque seus jogos usados por crédito na GameZone Capão. Consoles e acessórios com preços especiais.',
    discount: 'Troca + 15% OFF',
    image: 'https://picsum.photos/seed/promo-games/800/400',
    productIds: ['prod-8', 'prod-9', 'prod-10'],
    endsAt: '2026-09-15T23:59:59.000Z',
  },
  {
    id: 'promo-3',
    title: 'Liquidação Casa & Estilo',
    description: 'Móveis e decoração com até 50% de desconto. Entrega gratuita para Capão Bonito e Apiaí.',
    discount: 'Até 50% OFF',
    image: 'https://picsum.photos/seed/promo-casa-estilo/800/400',
    productIds: ['prod-11', 'prod-12', 'prod-13'],
    endsAt: '2026-08-31T23:59:59.000Z',
  },
]
