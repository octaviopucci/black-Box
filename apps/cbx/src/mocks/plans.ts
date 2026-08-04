import type { Plan } from '@/types'

export const plans: Plan[] = [
  {
    id: 'gratuito',
    name: 'Gratuito',
    price: 0,
    period: 'mês',
    description: 'Ideal para quem está começando a vender em Capão Bonito. Publique até 5 anúncios e alcance compradores da região.',
    features: [
      'Até 5 anúncios ativos',
      'Chat com compradores',
      'Perfil básico de vendedor',
      'Aparece nas buscas locais',
      'Suporte por e-mail',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 29.9,
    period: 'mês',
    description: 'Para vendedores frequentes que querem mais visibilidade no marketplace de Capão Bonito.',
    features: [
      'Até 30 anúncios ativos',
      'Destaque em 3 anúncios por mês',
      'Selo de vendedor verificado',
      'Estatísticas de visualizações',
      'Suporte prioritário via WhatsApp',
      'Renovação automática de anúncios',
    ],
    highlighted: true,
    badge: 'Mais popular',
  },
  {
    id: 'empresarial',
    name: 'Empresarial',
    price: 79.9,
    period: 'mês',
    description: 'Solução completa para lojas e empresas da região com vitrine profissional e anúncios patrocinados.',
    features: [
      'Anúncios ilimitados',
      'Loja virtual personalizada',
      '5 anúncios patrocinados por mês',
      'Banner na página inicial',
      'Relatórios avançados de vendas',
      'Gerente de conta dedicado',
      'Integração com WhatsApp Business',
    ],
    badge: 'Para empresas',
  },
]
