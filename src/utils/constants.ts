import type {
  DocumentCategory,
  ExpenseCategory,
  FuelType,
  PaymentMethod,
  PayableStatus,
  TransmissionType,
  UserRole,
  VehicleStatus,
} from '@/types'

export const STATUS_LABELS: Record<VehicleStatus, string> = {
  negociacao: 'Em negociação',
  comprado: 'Comprado',
  documentacao: 'Aguardando documentação',
  preparacao: 'Em preparação',
  pronto: 'Pronto para venda',
  anunciado: 'Anunciado',
  reservado: 'Reservado',
  vendido: 'Vendido',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
  disponivel: 'Pronto para venda',
  consignado: 'Consignado',
  oficina: 'Em preparação',
  financiado: 'Reservado',
}

export const STATUS_FLOW: VehicleStatus[] = [
  'negociacao',
  'comprado',
  'documentacao',
  'preparacao',
  'pronto',
  'anunciado',
  'reservado',
  'vendido',
  'entregue',
  'cancelado',
]

export const STATUS_COLORS: Record<VehicleStatus, string> = {
  negociacao: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  comprado: 'bg-sky-50 text-sky-700 border-sky-200',
  documentacao: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  preparacao: 'bg-violet-50 text-violet-700 border-violet-200',
  pronto: 'bg-teal-50 text-teal-700 border-teal-200',
  anunciado: 'bg-lp-accent-soft text-lp-accent border-lp-accent/30',
  reservado: 'bg-amber-50 text-amber-700 border-amber-200',
  vendido: 'bg-red-50 text-red-700 border-red-200',
  entregue: 'bg-slate-100 text-slate-600 border-slate-200',
  cancelado: 'bg-slate-50 text-slate-500 border-slate-200',
  disponivel: 'bg-lp-accent-soft text-lp-accent border-lp-accent/30',
  consignado: 'bg-blue-50 text-blue-700 border-blue-200',
  oficina: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  financiado: 'bg-pink-50 text-pink-700 border-pink-200',
}

export const STATUS_CHART_COLORS: Record<VehicleStatus, string> = {
  negociacao: '#6366F1',
  comprado: '#0EA5E9',
  documentacao: '#06B6D4',
  preparacao: '#8B5CF6',
  pronto: '#14B8A6',
  anunciado: '#0F766E',
  reservado: '#D97706',
  vendido: '#B91C1C',
  entregue: '#64748B',
  cancelado: '#94A3B8',
  disponivel: '#0F766E',
  consignado: '#3B82F6',
  oficina: '#EAB308',
  financiado: '#EC4899',
}

export const FUEL_LABELS: Record<FuelType, string> = {
  flex: 'Flex',
  gasolina: 'Gasolina',
  etanol: 'Etanol',
  diesel: 'Diesel',
  eletrico: 'Elétrico',
  hibrido: 'Híbrido',
  gnv: 'GNV',
}

export const TRANSMISSION_LABELS: Record<TransmissionType, string> = {
  manual: 'Manual',
  automatico: 'Automático',
  cvt: 'CVT',
  automatizado: 'Automatizado',
}

export const EXPENSE_LABELS: Record<ExpenseCategory, string> = {
  aquisicao: 'Aquisição',
  compra: 'Valor de compra',
  mecanica: 'Mecânica',
  eletrica: 'Elétrica',
  funilaria: 'Funilaria',
  pintura: 'Pintura',
  estetica: 'Estética',
  higienizacao: 'Higienização',
  lavagem: 'Lavagem',
  polimento: 'Polimento',
  pneus: 'Pneus',
  bateria: 'Bateria',
  pecas: 'Peças',
  documentacao: 'Documentação',
  ipva: 'IPVA',
  licenciamento: 'Licenciamento',
  multas: 'Multas',
  vistoria: 'Vistoria',
  despachante: 'Despachante',
  guincho: 'Guincho',
  seguro: 'Seguro',
  comissao: 'Comissão',
  transferencia: 'Transferência',
  combustivel: 'Combustível',
  publicidade: 'Publicidade',
  outros: 'Outros',
}

export const DOCUMENT_LABELS: Record<DocumentCategory, string> = {
  compra: 'Documento de compra',
  nota_fiscal: 'Nota fiscal',
  crlv: 'CRLV',
  atpv: 'ATPV',
  vistoria: 'Vistoria',
  laudo: 'Laudo',
  ipva: 'IPVA',
  licenciamento: 'Licenciamento',
  multas: 'Multas',
  recibo: 'Recibo',
  comprovante: 'Comprovante',
  contrato: 'Contrato',
  vendedor: 'Documentos do vendedor',
  comprador: 'Documentos do comprador',
  outros: 'Outros',
}

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  pix: 'PIX',
  ted: 'TED',
  dinheiro: 'Dinheiro',
  financiamento: 'Financiamento',
  consorcio: 'Consórcio',
  cartao: 'Cartão',
  boleto: 'Boleto',
  cheque: 'Cheque',
}

export const PAYABLE_STATUS_LABELS: Record<PayableStatus, string> = {
  pendente: 'Pendente',
  pago: 'Pago',
  vencido: 'Vencido',
  cancelado: 'Cancelado',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  gerente: 'Gerente',
  vendedor: 'Vendedor',
  operacional: 'Operacional',
  financeiro: 'Financeiro',
  operador: 'Operacional',
  viewer: 'Vendedor',
}

export const CATEGORIES = [
  'Hatch',
  'Sedan',
  'SUV',
  'Pickup',
  'Coupé',
  'Conversível',
  'Van',
  'Utilitário',
  'Motocicleta',
]

export const ORIGINS = [
  'Particular',
  'Leilão',
  'Concessionária',
  'Troca',
  'Consignação',
  'Importado',
  'Outro',
]

export const SUPPLIER_TYPES = [
  'Mecânico',
  'Funilaria',
  'Estética',
  'Despachante',
  'Vistoria',
  'Guincho',
  'Peças',
  'Outros',
]

export const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

export const DEFAULT_CHECKLIST: { key: string; label: string; group: 'documentacao' | 'mecanica' | 'estetica' | 'venda' }[] = [
  { key: 'doc_conferir', label: 'Conferir documentação', group: 'documentacao' },
  { key: 'doc_chassi', label: 'Conferir chassi', group: 'documentacao' },
  { key: 'doc_vistoria', label: 'Vistoria', group: 'documentacao' },
  { key: 'doc_transferencia', label: 'Transferência', group: 'documentacao' },
  { key: 'mec_oleo', label: 'Óleo', group: 'mecanica' },
  { key: 'mec_filtros', label: 'Filtros', group: 'mecanica' },
  { key: 'mec_freios', label: 'Freios', group: 'mecanica' },
  { key: 'mec_pneus', label: 'Pneus', group: 'mecanica' },
  { key: 'mec_suspensao', label: 'Suspensão', group: 'mecanica' },
  { key: 'mec_ar', label: 'Ar-condicionado', group: 'mecanica' },
  { key: 'est_lavagem', label: 'Lavagem', group: 'estetica' },
  { key: 'est_higienizacao', label: 'Higienização', group: 'estetica' },
  { key: 'est_polimento', label: 'Polimento', group: 'estetica' },
  { key: 'est_funilaria', label: 'Funilaria', group: 'estetica' },
  { key: 'est_pintura', label: 'Pintura', group: 'estetica' },
  { key: 'venda_fotos', label: 'Fotos', group: 'venda' },
  { key: 'venda_video', label: 'Vídeo', group: 'venda' },
  { key: 'venda_preco', label: 'Preço', group: 'venda' },
  { key: 'venda_anuncio', label: 'Anúncio', group: 'venda' },
  { key: 'venda_revisao', label: 'Revisão do anúncio', group: 'venda' },
]

/** Permissions matrix — enforced in services + UI. */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['*'],
  gerente: [
    'vehicles', 'finance', 'reports', 'operations', 'documents', 'alerts',
    'intelligence', 'suppliers', 'payables', 'customers', 'settings.read',
  ],
  vendedor: ['vehicles.read', 'vehicles.write', 'customers', 'sales', 'alerts.read'],
  operacional: ['vehicles.read', 'operations', 'documents', 'checklist', 'expenses.write'],
  financeiro: ['finance', 'payables', 'documents', 'reports', 'expenses'],
  operador: ['vehicles.read', 'operations', 'documents', 'checklist', 'expenses.write'],
  viewer: ['vehicles.read', 'customers', 'alerts.read'],
}

export function roleCan(role: UserRole, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role] || []
  if (perms.includes('*')) return true
  if (perms.includes(permission)) return true
  const [ns] = permission.split('.')
  return perms.includes(ns)
}
