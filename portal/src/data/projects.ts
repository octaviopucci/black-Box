export type ProjectStatus = 'ativo' | 'demo' | 'manutencao'

export interface ClientProject {
  id: string
  name: string
  client: string
  description: string
  href: string
  status: ProjectStatus
  tags: string[]
}

export const projects: ClientProject[] = [
  {
    id: 'maciel-motors',
    name: 'Maciel Motors Gestor',
    client: 'Maciel Motors',
    description:
      'Sistema completo de gestão para revenda de veículos: estoque, financeiro, clientes, relatórios e backup. Login com entrada cinematográfica.',
    href: '/maciel-motors/',
    status: 'ativo',
    tags: ['React', 'Gestão', 'Automotivo'],
  },
  {
    id: 'maciel-motors-x',
    name: 'Maciel Motors Gestor X',
    client: 'Maciel Motors',
    description:
      'Mesmo sistema com login e entrada mais interativos (animações, presença de marca). Use para comparar lado a lado com a versão estável.',
    href: '/maciel-motors-x/',
    status: 'demo',
    tags: ['React', 'Interativo', 'Comparação'],
  },
  {
    id: 'porthal-imoveis',
    name: 'Porthal Imóveis',
    client: 'Porthal Imóveis',
    description:
      'Experiência digital premium para consultoria imobiliária em Capão Bonito/SP — hero cinematográfico, catálogo completo, motion GSAP/Lenis e conversão via WhatsApp.',
    href: '/porthal-imoveis/',
    status: 'demo',
    tags: ['React', 'Imobiliária', 'Awwwards'],
  },
  {
    id: 'sogov',
    name: 'gov.br Premium',
    client: 'Conceito · Governo Federal',
    description:
      'Reinvenção sofisticada do portal gov.br: busca intuitiva, perfis cidadão, serviços essenciais e jornada interativa em 3 passos.',
    href: '/sogov/',
    status: 'demo',
    tags: ['React', 'gov.br', 'Premium'],
  },
]
