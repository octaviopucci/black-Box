import type {
  ExpenseCategory,
  FuelType,
  PaymentMethod,
  TransmissionType,
  VehicleStatus,
} from '@/types'

export const STATUS_LABELS: Record<VehicleStatus, string> = {
  disponivel: 'Disponível',
  reservado: 'Reservado',
  consignado: 'Consignado',
  vendido: 'Vendido',
  oficina: 'Oficina',
  preparacao: 'Preparação',
  documentacao: 'Documentação',
  financiado: 'Financiado',
  entregue: 'Entregue',
}

export const STATUS_COLORS: Record<VehicleStatus, string> = {
  disponivel: 'bg-status-disponivel/20 text-status-disponivel border-status-disponivel/40',
  reservado: 'bg-status-reservado/20 text-status-reservado border-status-reservado/40',
  consignado: 'bg-status-consignado/20 text-status-consignado border-status-consignado/40',
  vendido: 'bg-status-vendido/20 text-status-vendido border-status-vendido/40',
  oficina: 'bg-status-oficina/20 text-status-oficina border-status-oficina/40',
  preparacao: 'bg-status-preparacao/20 text-status-preparacao border-status-preparacao/40',
  documentacao: 'bg-status-documentacao/20 text-status-documentacao border-status-documentacao/40',
  financiado: 'bg-status-financiado/20 text-status-financiado border-status-financiado/40',
  entregue: 'bg-status-entregue/20 text-status-entregue border-status-entregue/40',
}

export const STATUS_CHART_COLORS: Record<VehicleStatus, string> = {
  disponivel: '#22C55E',
  reservado: '#F97316',
  consignado: '#3B82F6',
  vendido: '#EF4444',
  oficina: '#EAB308',
  preparacao: '#A855F7',
  documentacao: '#06B6D4',
  financiado: '#EC4899',
  entregue: '#64748B',
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
  compra: 'Valor de compra',
  ipva: 'IPVA',
  transferencia: 'Transferência',
  licenciamento: 'Licenciamento',
  seguro: 'Seguro',
  lavagem: 'Lavagem',
  polimento: 'Polimento',
  mecanica: 'Mecânica',
  funilaria: 'Funilaria',
  pintura: 'Pintura',
  eletrica: 'Elétrica',
  pneus: 'Pneus',
  combustivel: 'Combustível',
  guincho: 'Guincho',
  publicidade: 'Publicidade',
  comissao: 'Comissão',
  documentacao: 'Documentação',
  despachante: 'Despachante',
  outros: 'Outros',
}

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  pix: 'PIX',
  ted: 'TED',
  dinheiro: 'Dinheiro',
  financiamento: 'Financiamento',
  consorcio: 'Consórcio',
  cartao: 'Cartão',
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

export const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]
