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
      'Site premium e interativo para consultoria imobiliária de alto padrão em Capão Bonito/SP — hero cinematográfico, busca, destaques e simulador.',
    href: '/porthal-imoveis/',
    status: 'demo',
    tags: ['React', 'Imobiliária', 'Premium'],
  },
  {
    id: 'marcio-mariano',
    name: 'Márcio Mariano',
    client: 'Imobiliária Márcio Mariano',
    description:
      'Reconstrução premium da imobiliária tradicional de Capão Bonito — legado desde 1955, busca, catálogo, serviços e conversão via WhatsApp.',
    href: '/marcio-mariano/',
    status: 'demo',
    tags: ['React', 'Imobiliária', 'Premium'],
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
  {
    id: 'clinica-dna',
    name: 'Clínica DNA',
    client: 'Clínica DNA · Capão Bonito',
    description:
      'Experiência “Fio Vivo”: narrativa contínua com fio luminoso, manifesto tipográfico, corredor horizontal de especialidades e limiar WhatsApp.',
    href: '/clinica-dna/',
    status: 'demo',
    tags: ['React', 'Saúde', 'Awwwards'],
  },
  {
    id: 'dr-marcelo-prado',
    name: 'Dr. Marcelo Prado',
    client: 'Endocrinologia Aplicada · Itapeva',
    description:
      'Experiência imersiva chic para endocrinologia aplicada: narrativa editorial, corredor cinematográfico, Protocolo Harmonie e limiar de agendamento — Capão Bonito, Itapeva e on-line.',
    href: '/dr-marcelo-prado/',
    status: 'demo',
    tags: ['React', 'Saúde', 'Premium'],
  },
]
