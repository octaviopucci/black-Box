export type Solution = {
  number: string
  title: string
  /** Linguagem que o cliente entende na hora */
  benefit: string
  description: string
  examples: string[]
}

export const solutions: Solution[] = [
  {
    number: '01',
    title: 'Inteligência artificial que trabalha por você',
    benefit: 'Sua equipe ganha tempo. A operação ganha velocidade.',
    description:
      'Criamos assistentes e automações inteligentes que respondem, organizam e executam tarefas repetitivas — para sua equipe focar no que realmente importa.',
    examples: ['Atendimento automático', 'Qualificação de leads', 'Análise de dados', 'Copilotos internos'],
  },
  {
    number: '02',
    title: 'Sistemas e plataformas sob medida',
    benefit: 'Tudo no lugar certo. Sem planilha perdida.',
    description:
      'Painéis, portais e ferramentas internas feitos para a rotina real da sua empresa — não um template genérico.',
    examples: ['Painéis de gestão', 'Portais do cliente', 'Ferramentas internas', 'Plataformas SaaS'],
  },
  {
    number: '03',
    title: 'Automação do dia a dia',
    benefit: 'Menos clique manual. Mais resultado.',
    description:
      'Conectamos WhatsApp, CRM, e-mail e outras ferramentas para que informações fluam sozinhas entre os times.',
    examples: ['WhatsApp automático', 'CRM conectado', 'E-mails inteligentes', 'Processos sem retrabalho'],
  },
  {
    number: '04',
    title: 'Sites e páginas que convertem',
    benefit: 'Visitante entra. Oportunidade sai.',
    description:
      'Experiências digitais pensadas para explicar sua oferta com clareza e transformar interesse em contato comercial.',
    examples: ['Landing pages', 'Sites institucionais', 'Funis de venda', 'Páginas de captura'],
  },
  {
    number: '05',
    title: 'Recuperação de clientes e leads',
    benefit: 'Dinheiro escondido na sua base.',
    description:
      'Sistemas que encontram quem parou de responder, reativam o contato e devolvem oportunidades para o comercial.',
    examples: ['Reativação automática', 'Follow-up no WhatsApp', 'Campanhas segmentadas', 'Base que volta a vender'],
  },
  {
    number: '06',
    title: 'Integração entre ferramentas',
    benefit: 'Uma operação. Várias ferramentas conversando.',
    description:
      'Fazemos sistemas diferentes trabalharem juntos — para você parar de copiar dados de um lugar para outro.',
    examples: ['CRM + WhatsApp', 'Planilhas + sistema', 'Pagamentos + operação', 'Ferramentas conectadas'],
  },
]

export const specialties = [
  'VENDER MAIS',
  'AUTOMATIZAR TAREFAS',
  'RECUPERAR CLIENTES',
  'SITES QUE CONVERTEM',
  'PAINÉIS DE GESTÃO',
  'IA PARA SUA OPERAÇÃO',
  'SOFTWARE SOB MEDIDA',
] as const

export const clientOutcomes = [
  {
    stat: 40,
    suffix: '%',
    label: 'Menos tempo em tarefas repetitivas',
    detail: 'Automação libera sua equipe para vender e atender.',
  },
  {
    stat: 3,
    suffix: 'x',
    label: 'Mais velocidade no comercial',
    detail: 'Leads qualificados chegam na hora certa para quem fecha.',
  },
  {
    stat: 24,
    suffix: 'h',
    label: 'Operação rodando',
    detail: 'Sistemas que trabalham enquanto você dorme.',
  },
] as const

export const forWho = [
  {
    title: 'Empresas que querem vender mais',
    text: 'Sites, funis e sistemas comerciais que transformam visita em conversa — sem depender só de anúncio.',
  },
  {
    title: 'Times sobrecarregados',
    text: 'Automação e IA para parar de fazer manualmente o que um sistema pode fazer melhor.',
  },
  {
    title: 'Negócios com base de clientes parada',
    text: 'Recuperação inteligente de leads e clientes que pararam de responder.',
  },
  {
    title: 'Quem precisa de algo único',
    text: 'Ferramenta interna, painel ou plataforma que não existe pronta no mercado.',
  },
] as const

export const processSteps = [
  {
    number: '01',
    title: 'Conversamos',
    description: 'Entendemos seu desafio, sua operação e o resultado que você quer alcançar.',
  },
  {
    number: '02',
    title: 'Planejamos',
    description: 'Desenhamos a solução certa — o que construir, como funciona e o que muda no seu negócio.',
  },
  {
    number: '03',
    title: 'Construímos',
    description: 'Desenvolvemos, testamos e conectamos tudo. Você acompanha sem precisar falar código.',
  },
  {
    number: '04',
    title: 'Colocamos no ar',
    description: 'Lançamos, treinamos sua equipe e garantimos que funcione no mundo real.',
  },
  {
    number: '05',
    title: 'Melhoramos juntos',
    description: 'Medimos resultados e evoluímos a solução conforme seu negócio cresce.',
  },
] as const

export const principles = [
  {
    number: '01',
    title: 'Tudo tem um porquê',
    description: 'Não criamos tela bonita por criar. Cada parte existe para resolver um problema real.',
  },
  {
    number: '02',
    title: 'IA quando faz sentido',
    description: 'Inteligência artificial entra para economizar tempo e aumentar resultado — nunca como enfeite.',
  },
  {
    number: '03',
    title: 'Visão do negócio inteiro',
    description: 'Pensamos na operação completa: comercial, atendimento, gestão — não só uma ferramenta isolada.',
  },
  {
    number: '04',
    title: 'Bonito e funcional',
    description: 'Sua solução precisa impressionar o cliente e funcionar de verdade no dia a dia.',
  },
] as const

export type LabItem = {
  title: string
  status: 'Em testes' | 'Protótipo' | 'Experimental' | 'Pesquisa'
  teaser: string
}

export const labItems: LabItem[] = [
  {
    title: 'Assistente comercial com IA',
    status: 'Experimental',
    teaser: 'Qualifica leads e prepara o vendedor antes da conversa.',
  },
  {
    title: 'Atendimento que responde sozinho',
    status: 'Protótipo',
    teaser: 'Primeiras respostas automáticas com contexto da empresa.',
  },
  {
    title: 'Propostas geradas em minutos',
    status: 'Em testes',
    teaser: 'Do briefing ao documento comercial personalizado.',
  },
  {
    title: 'Central da operação',
    status: 'Pesquisa',
    teaser: 'Um lugar para ver tudo que importa no negócio.',
  },
  {
    title: 'Recuperador de clientes',
    status: 'Experimental',
    teaser: 'Encontra quem sumiu e reativa o contato automaticamente.',
  },
]
