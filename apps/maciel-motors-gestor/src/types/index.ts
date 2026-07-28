export type VehicleStatus =
  | 'disponivel'
  | 'reservado'
  | 'consignado'
  | 'vendido'
  | 'oficina'
  | 'preparacao'
  | 'documentacao'
  | 'financiado'
  | 'entregue'

export type FuelType =
  | 'flex'
  | 'gasolina'
  | 'etanol'
  | 'diesel'
  | 'eletrico'
  | 'hibrido'
  | 'gnv'

export type TransmissionType = 'manual' | 'automatico' | 'cvt' | 'automatizado'

export type ExpenseCategory =
  | 'compra'
  | 'ipva'
  | 'transferencia'
  | 'licenciamento'
  | 'seguro'
  | 'lavagem'
  | 'polimento'
  | 'mecanica'
  | 'funilaria'
  | 'pintura'
  | 'eletrica'
  | 'pneus'
  | 'combustivel'
  | 'guincho'
  | 'publicidade'
  | 'comissao'
  | 'documentacao'
  | 'despachante'
  | 'outros'

export type PaymentMethod =
  | 'pix'
  | 'ted'
  | 'dinheiro'
  | 'financiamento'
  | 'consorcio'
  | 'cartao'

export type HistoryEventType =
  | 'compra'
  | 'entrada_estoque'
  | 'oficina'
  | 'lavagem'
  | 'fotos'
  | 'publicado'
  | 'reservado'
  | 'venda'
  | 'entrega'
  | 'status_change'
  | 'despesa'
  | 'edicao'
  | 'duplicacao'
  | 'arquivo'
  | 'restauracao'
  | 'outro'

export interface Vehicle {
  id: string
  marca: string
  modelo: string
  versao: string
  ano: number
  anoModelo: number
  categoria: string
  cor: string
  placa: string
  renavam: string
  chassi: string
  motor: string
  combustivel: FuelType
  cambio: TransmissionType
  quilometragem: number
  cidade: string
  estado: string
  fornecedor: string
  telefoneFornecedor: string
  origem: string
  precoFipe: number
  valorCompra: number
  precoAnunciado: number
  precoMinimo: number
  observacoes: string
  dataCompra: string
  fotos: string[]
  fotoPrincipal: number
  status: VehicleStatus
  consignado: boolean
  archived: boolean
  createdAt: string
  updatedAt: string
}

export interface Expense {
  id: string
  vehicleId: string
  descricao: string
  categoria: ExpenseCategory
  valor: number
  data: string
  observacao: string
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: string
  nome: string
  cpf: string
  telefone: string
  cidade: string
  endereco: string
  email: string
  observacoes: string
  createdAt: string
  updatedAt: string
}

export interface Sale {
  id: string
  vehicleId: string
  customerId: string
  clienteNome: string
  cpf: string
  telefone: string
  cidade: string
  endereco: string
  dataVenda: string
  formaPagamento: PaymentMethod
  entrada: number
  parcelas: number
  valorVendido: number
  comissao: number
  observacoes: string
  lucroBruto: number
  lucroLiquido: number
  roi: number
  margem: number
  diasEstoque: number
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  username: string
  password: string
  nome: string
  role: 'admin' | 'operador' | 'viewer'
  active: boolean
  createdAt: string
}

export interface Settings {
  id: string
  nomeEmpresa: string
  logo: string
  telefone: string
  whatsapp: string
  instagram: string
  email: string
  endereco: string
  cidade: string
  tema: 'dark' | 'light'
  modoEscuro: boolean
  updatedAt: string
}

export interface HistoryEvent {
  id: string
  vehicleId?: string
  type: HistoryEventType
  data: string
  hora: string
  descricao: string
  usuario: string
  createdAt: string
}

export interface Database {
  vehicles: Vehicle[]
  sales: Sale[]
  expenses: Expense[]
  customers: Customer[]
  users: User[]
  settings: Settings[]
  history: HistoryEvent[]
}

export interface VehicleFilters {
  search?: string
  marca?: string
  ano?: number
  cidade?: string
  cor?: string
  status?: VehicleStatus | ''
  combustivel?: FuelType | ''
  cambio?: TransmissionType | ''
  consignado?: boolean | null
  precoMin?: number
  precoMax?: number
  archived?: boolean
  /** true = exclui vendidos/entregues (pátio ativo) */
  inStock?: boolean
}

export interface DashboardStats {
  totalEstoque: number
  disponiveis: number
  reservados: number
  consignados: number
  vendidos: number
  emOficina: number
  investimentoTotal: number
  valorTotalEstoque: number
  valorVendido: number
  lucroBruto: number
  lucroLiquido: number
  ticketMedio: number
  diasMediosEstoque: number
}

export interface MonthlyChartData {
  mes: string
  vendas: number
  lucro: number
  quantidade?: number
}

export interface StatusChartData {
  status: string
  quantidade: number
  fill: string
}
