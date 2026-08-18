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
    id: 'lp-motors',
    name: 'LP Motors Gestor',
    client: 'LP Motors',
    description:
      'Novo sistema profissional de gestão de estoque e operação para lojas de veículos: dossiê 360°, custos, alertas, inteligência sem IA e sync multi-dispositivo.',
    href: '/lp-motors/',
    status: 'ativo',
    tags: ['React', 'Gestão', 'Automotivo'],
  },
  {
    id: 'lp-motors-x',
    name: 'LP Motors Gestor X',
    client: 'LP Motors',
    description:
      'Variante interativa do LP Motors Gestor para demos. Produto independente do Maciel Motors.',
    href: '/lp-motors-x/',
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
      'Site editorial chic para endocrinologia aplicada: hero brand-first, eixos de cuidado, jornada clínica, Protocolo Harmonie e agendamento — Capão Bonito, Itapeva e on-line.',
    href: '/dr-marcelo-prado/',
    status: 'demo',
    tags: ['React', 'Saúde', 'Premium'],
  },
  {
    id: 'clinica-harmonie',
    name: 'Clínica Harmonie',
    client: 'Harmonie · Itapeva',
    description:
      'Experiência “Ressonância”: narrativa harmônica com partitura de cuidados, Protocolo Harmonie, espaço vivo e conversão WhatsApp — saúde, beleza e bem-estar.',
    href: '/clinica-harmonie/',
    status: 'demo',
    tags: ['React', 'Saúde', 'Awwwards'],
  },
  {
    id: 'octavio-pucci',
    name: 'Octávio Pucci Tattoo',
    client: 'Octávio Pucci · Capão Bonito',
    description:
      'Experiência “Predestinado”: narrativa em tinta preta e cinza, linguagens (realismo, coberturas, fine line), arquivo de pele e orçamento WhatsApp — studio privado.',
    href: '/octavio-pucci/',
    status: 'demo',
    tags: ['React', 'Tattoo', 'Awwwards'],
  },
  {
    id: 'na-veiculos',
    name: 'NA Veículos',
    client: 'N.A Veículos · Capão Bonito',
    description:
      'Site da loja: estoque real do Instagram, disponíveis e entregas, preço transparente e WhatsApp — Capão Bonito/SP. Intro cinematográfica e corredor de estoque.',
    href: '/na-veiculos/',
    status: 'demo',
    tags: ['React', 'Automotivo', 'Awwwards'],
  },
  {
    id: 'clinica-matsubara',
    name: 'Clínica Matsubara',
    client: 'Matsubara · Capão Bonito',
    description:
      'Experiência “A Versão”: narrativa boutique com rios de cuidado (odontologia, estética, especialidades), espaço real e conversão WhatsApp — identidade burgundy e rose.',
    href: '/clinica-matsubara/',
    status: 'demo',
    tags: ['React', 'Saúde', 'Awwwards'],
  },
  {
    id: 'danielle-matsubara',
    name: 'Dra. Danielle Matsubara',
    client: 'Danielle Matsubara · Capão Bonito',
    description:
      'Experiência “A Escuta”: site pessoal da endodontista e fundadora — voz em primeira pessoa, walk físico da clínica e conversão WhatsApp.',
    href: '/danielle-matsubara/',
    status: 'demo',
    tags: ['React', 'Saúde', 'Awwwards'],
  },
  {
    id: 'lais-felicia',
    name: 'Studio Laís Felicia',
    client: 'Laís Felicia · Capão Bonito',
    description:
      'Landing dark de autoridade (estrutura Duda Nito / NODA): hero sobreposto, serviços, cursos, FAQ e WhatsApp. Fotos reais e identidade rose gold.'
    href: '/lais-felicia/',
    status: 'demo',
    tags: ['React', 'Beleza', 'Premium'],
  },
  {
    id: 'gl-locacoes',
    name: 'G&L Locações',
    client: 'G&L Locações de Brinquedos · Capão Bonito',
    description:
      'Experiência “Diversão Garantida”: pula-pula, piscina de bolinhas, escorregadores e toboágua com fotos reais do Instagram e reserva WhatsApp.',
    href: '/gl-locacoes/',
    status: 'demo',
    tags: ['React', 'Eventos', 'Locação'],
  },
  {
    id: 'cbx',
    name: 'CBX',
    client: 'CBX · Capão Bonito',
    description:
      'Marketplace local de Capão Bonito: comprar e vender com experiência premium — home rica, chat, anúncios, planos e lojas. 100% front-end mockado.',
    href: '/cbx/',
    status: 'demo',
    tags: ['Next.js', 'Marketplace', 'Premium'],
  },
  {
    id: 'protocolo-pav',
    name: 'Protocolo PAV — BASE',
    client: 'BASE · Sistema PAV',
    description:
      'Funil quiz v2 visual BASE (copy intacta) + planos Kiwify originais. Arena e protocolo no mesmo app.',
    href: '/protocolo-pav/quiz-v2',
    status: 'demo',
    tags: ['React', 'Quiz', 'BASE'],
  },
  {
    id: 'rian',
    name: 'BASE · Rian (afiliado)',
    client: 'BASE · Afiliado Rian',
    description:
      'Pré-venda afiliado Rian v2: quiz visual + cadastro + planos com checkout Kiwify próprio (afid wSk0NAct).',
    href: '/rian/quiz-v2',
    status: 'ativo',
    tags: ['React', 'Afiliado', 'BASE'],
  },
  {
    id: 'chama',
    name: 'chama',
    client: 'chama · de chamar',
    description:
      'Clone funcional do Manychat: flow builder, inbox, automações comentário→DM, broadcasts, analytics e simulador — tudo persistido no navegador.',
    href: '/chama/',
    status: 'demo',
    tags: ['React', 'Chat', 'Automação'],
  },
  {
    id: 'traco',
    name: 'traço',
    client: 'traço · desenhe com inteligência',
    description:
      'Clone melhorado do Procreate: pincéis, camadas, laço/seleção e IA integrada para alterar regiões, camadas ou o canvas por prompt.',
    href: '/traco/',
    status: 'demo',
    tags: ['React', 'Canvas', 'IA'],
  },
  {
    id: 'pix-gateway',
    name: 'PIX Gateway',
    client: 'Black Box · uso próprio',
    description:
      'API Pix multi-conta/chave, QR grátis na sua chave e confirmação automática via webhook. Painel em /pix e API em /api/pix.',
    href: '/pix/',
    status: 'ativo',
    tags: ['API', 'Pix', 'Gateway'],
  },
]
