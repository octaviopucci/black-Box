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
      'Sistema completo de gestão para revenda de veículos: estoque, financeiro, clientes, relatórios e backup.',
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
]
