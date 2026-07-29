export const site = {
  brand: 'gov.br',
  org: 'Governo Federal',
  tagline: 'Portal de Serviços',
  headline: 'Serviços públicos com a cara do Brasil — mais claros, rápidos e humanos',
  description:
    'Conceito premium do portal oficial: a identidade digital do Governo Federal, reinventada para concluir o que importa em poucos passos.',
  officialUrl: 'https://www.gov.br/pt-br',
}

export type ServiceCategory =
  | 'Finanças'
  | 'Previdência'
  | 'Trabalho'
  | 'Saúde'
  | 'Educação'
  | 'Trânsito'
  | 'Assistência'
  | 'Justiça'
  | 'Empresa'

export interface Service {
  id: string
  title: string
  description: string
  category: ServiceCategory
  keywords: string[]
  popular?: boolean
  digital: boolean
  time: string
}

export interface Profile {
  id: string
  name: string
  blurb: string
  serviceIds: string[]
}

export const services: Service[] = [
  {
    id: 'ir-consultar',
    title: 'Consultar Meu Imposto de Renda',
    description: 'Acompanhe declaração, pendências e status da restituição em um só lugar.',
    category: 'Finanças',
    keywords: ['imposto de renda', 'irpf', 'restituicao', 'dirpf'],
    popular: true,
    digital: true,
    time: '2 min',
  },
  {
    id: 'ir-entregar',
    title: 'Entregar Meu Imposto de Renda',
    description: 'Envie a DIRPF com orientação guiada e conferência automática.',
    category: 'Finanças',
    keywords: ['imposto de renda', 'entregar', 'declaracao'],
    popular: true,
    digital: true,
    time: '15 min',
  },
  {
    id: 'assinatura',
    title: 'Assinatura Eletrônica',
    description: 'Assine documentos oficiais com sua conta gov.br, sem deslocamento.',
    category: 'Justiça',
    keywords: ['assinatura', 'documento', 'digital'],
    popular: true,
    digital: true,
    time: '1 min',
  },
  {
    id: 'cadunico',
    title: 'Consultar Cadastro Único',
    description: 'Veja sua situação no CadÚnico e atualize dados quando necessário.',
    category: 'Assistência',
    keywords: ['cadastro unico', 'cadunico', 'beneficio'],
    popular: true,
    digital: true,
    time: '3 min',
  },
  {
    id: 'desenrola',
    title: 'Novo Desenrola Brasil — Famílias',
    description: 'Renegocie dívidas com condições facilitadas para famílias.',
    category: 'Finanças',
    keywords: ['desenrola', 'divida', 'negociacao'],
    popular: true,
    digital: true,
    time: '10 min',
  },
  {
    id: 'bolsa-familia',
    title: 'Bolsa Família',
    description: 'Consulte elegibilidade, calendário e valores do benefício.',
    category: 'Assistência',
    keywords: ['bolsa familia', 'pbf', 'beneficio'],
    popular: true,
    digital: true,
    time: '4 min',
  },
  {
    id: 'mei',
    title: 'Abrir ou gerenciar MEI',
    description: 'Formalize seu negócio, emita DAS e acompanhe obrigações.',
    category: 'Empresa',
    keywords: ['mei', 'empreendedor', 'das'],
    popular: true,
    digital: true,
    time: '8 min',
  },
  {
    id: 'inss',
    title: 'Meu INSS',
    description: 'Extratos, contribuições, agendamentos e prova de vida digital.',
    category: 'Previdência',
    keywords: ['inss', 'aposentadoria', 'beneficio', 'extrato'],
    popular: true,
    digital: true,
    time: '5 min',
  },
  {
    id: 'enem',
    title: 'ENEM — inscrição e resultados',
    description: 'Acompanhe prazos, inscrição e desempenho no exame.',
    category: 'Educação',
    keywords: ['enem', 'prova', 'educacao'],
    digital: true,
    time: '6 min',
  },
  {
    id: 'cnh',
    title: 'Carteira Digital de Trânsito',
    description: 'CNH e CRLV digitais no celular, com validade oficial.',
    category: 'Trânsito',
    keywords: ['cnh', 'cdt', 'crlv', 'motorista'],
    digital: true,
    time: '3 min',
  },
  {
    id: 'celular-seguro',
    title: 'Celular Seguro',
    description: 'Bloqueie aparelho e linhas em caso de furto ou perda.',
    category: 'Justiça',
    keywords: ['celular seguro', 'furto', 'bloqueio'],
    digital: true,
    time: '2 min',
  },
  {
    id: 'vacina',
    title: 'Carteira de Vacinação Digital',
    description: 'Histórico de imunização e campanhas ativas perto de você.',
    category: 'Saúde',
    keywords: ['vacina', 'saude', 'imunizacao'],
    digital: true,
    time: '2 min',
  },
  {
    id: 'trabalhador',
    title: 'Carteira de Trabalho Digital',
    description: 'Contratos, vínculos e benefícios trabalhistas atualizados.',
    category: 'Trabalho',
    keywords: ['trabalho', 'ctps', 'emprego'],
    digital: true,
    time: '4 min',
  },
  {
    id: 'fgts',
    title: 'Consulta FGTS',
    description: 'Saldo, extrato e informações sobre distribuição de resultados.',
    category: 'Trabalho',
    keywords: ['fgts', 'saldo', 'trabalhador'],
    digital: true,
    time: '3 min',
  },
  {
    id: 'passaporte',
    title: 'Passaporte e viagens',
    description: 'Agende emissão e acompanhe documentos para viagem.',
    category: 'Justiça',
    keywords: ['passaporte', 'viagem', 'turismo'],
    digital: true,
    time: '12 min',
  },
]

export const profiles: Profile[] = [
  {
    id: 'trabalhador',
    name: 'Trabalhador',
    blurb: 'Carteira, FGTS e benefícios do emprego.',
    serviceIds: ['trabalhador', 'fgts', 'inss'],
  },
  {
    id: 'empreendedor',
    name: 'Empreendedor',
    blurb: 'MEI, impostos e formalização simples.',
    serviceIds: ['mei', 'ir-consultar', 'assinatura'],
  },
  {
    id: 'aposentado',
    name: 'Aposentado',
    blurb: 'INSS, extratos e prova de vida.',
    serviceIds: ['inss', 'ir-consultar', 'vacina'],
  },
  {
    id: 'motorista',
    name: 'Motorista',
    blurb: 'CNH digital, CRLV e segurança.',
    serviceIds: ['cnh', 'celular-seguro', 'assinatura'],
  },
  {
    id: 'estudante',
    name: 'Estudante',
    blurb: 'ENEM, educação e documentos.',
    serviceIds: ['enem', 'assinatura', 'vacina'],
  },
  {
    id: 'familia',
    name: 'Família',
    blurb: 'Bolsa Família, CadÚnico e Desenrola.',
    serviceIds: ['bolsa-familia', 'cadunico', 'desenrola'],
  },
]

export const categories: { name: ServiceCategory; hint: string }[] = [
  { name: 'Finanças', hint: 'Impostos, restituição e renegociação' },
  { name: 'Previdência', hint: 'INSS e benefícios' },
  { name: 'Trabalho', hint: 'Emprego, CTPS e FGTS' },
  { name: 'Saúde', hint: 'Vacinas e vigilância' },
  { name: 'Educação', hint: 'ENEM e pesquisa' },
  { name: 'Trânsito', hint: 'CNH, CRLV e veículos' },
  { name: 'Assistência', hint: 'CadÚnico e proteção social' },
  { name: 'Justiça', hint: 'Documentos e segurança' },
  { name: 'Empresa', hint: 'MEI e formalização' },
]

export const heroImage =
  'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=2400&q=80'

export const trustStats = [
  { label: 'Serviços no portal', value: '5.642' },
  { label: 'Digitais de ponta a ponta', value: '92%' },
  { label: 'Foco em conclusão', value: '3 passos' },
]
