/** LP Motors Gestor — domain types */

export type VehicleStatus =
  | 'negociacao'
  | 'comprado'
  | 'documentacao'
  | 'preparacao'
  | 'pronto'
  | 'anunciado'
  | 'reservado'
  | 'vendido'
  | 'entregue'
  | 'cancelado'
  // legacy (migrated on load)
  | 'disponivel'
  | 'consignado'
  | 'oficina'
  | 'financiado'

export type UserRole = 'admin' | 'gerente' | 'vendedor' | 'operacional' | 'financeiro' | 'operador' | 'viewer'

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
  | 'aquisicao'
  | 'compra'
  | 'mecanica'
  | 'eletrica'
  | 'funilaria'
  | 'pintura'
  | 'estetica'
  | 'higienizacao'
  | 'lavagem'
  | 'polimento'
  | 'pneus'
  | 'bateria'
  | 'pecas'
  | 'documentacao'
  | 'ipva'
  | 'licenciamento'
  | 'multas'
  | 'vistoria'
  | 'despachante'
  | 'guincho'
  | 'seguro'
  | 'comissao'
  | 'transferencia'
  | 'combustivel'
  | 'publicidade'
  | 'outros'

export type DocumentCategory =
  | 'compra'
  | 'nota_fiscal'
  | 'crlv'
  | 'atpv'
  | 'vistoria'
  | 'laudo'
  | 'ipva'
  | 'licenciamento'
  | 'multas'
  | 'recibo'
  | 'comprovante'
  | 'contrato'
  | 'vendedor'
  | 'comprador'
  | 'outros'

export type PaymentMethod =
  | 'pix'
  | 'ted'
  | 'dinheiro'
  | 'financiamento'
  | 'consorcio'
  | 'cartao'
  | 'boleto'
  | 'cheque'

export type PayableStatus = 'pendente' | 'pago' | 'vencido' | 'cancelado'

export type HistoryEventType =
  | 'cadastro'
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
  | 'documento'
  | 'checklist'
  | 'preco'
  | 'edicao'
  | 'duplicacao'
  | 'arquivo'
  | 'restauracao'
  | 'outro'

export type AlertSeverity = 'critico' | 'atencao' | 'info' | 'oportunidade'
export type AlertCategory = 'documentacao' | 'estoque' | 'financeiro' | 'operacional'

export interface Organization {
  id: string
  name: string
  slug: string
  createdAt: string
}

export interface Vehicle {
  id: string
  organizationId?: string
  codigoInterno: string
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
  portas: number
  combustivel: FuelType
  cambio: TransmissionType
  quilometragem: number
  cidade: string
  estado: string
  fornecedor: string
  telefoneFornecedor: string
  origem: string
  cpfCnpjOrigem: string
  localCompra: string
  formaPagamentoCompra: PaymentMethod | ''
  entradaCompra: number
  financiamentoCompra: number
  observacoesCompra: string
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
  draft: boolean
  vendedorResponsavel: string
  createdAt: string
  updatedAt: string
}

export interface Expense {
  id: string
  organizationId?: string
  vehicleId: string
  descricao: string
  categoria: ExpenseCategory
  valor: number
  data: string
  fornecedorId?: string
  fornecedorNome: string
  responsavel: string
  formaPagamento: PaymentMethod | ''
  status: PayableStatus
  documentoUrl: string
  observacao: string
  createdAt: string
  updatedAt: string
}

export interface VehicleDocument {
  id: string
  organizationId?: string
  vehicleId: string
  categoria: DocumentCategory
  nome: string
  dataUrl: string
  mimeType: string
  tamanho: number
  dataVencimento: string
  valor: number
  status: 'regular' | 'proximo' | 'vencido' | 'pendente'
  observacao: string
  createdAt: string
  updatedAt: string
}

export interface ChecklistItem {
  id: string
  key: string
  label: string
  group: 'documentacao' | 'mecanica' | 'estetica' | 'venda'
  done: boolean
  doneAt?: string
  doneBy?: string
}

export interface VehicleChecklist {
  id: string
  organizationId?: string
  vehicleId: string
  items: ChecklistItem[]
  updatedAt: string
}

export interface PriceHistoryEntry {
  id: string
  organizationId?: string
  vehicleId: string
  campo: 'precoAnunciado' | 'precoMinimo' | 'valorCompra' | 'precoFipe'
  valorAnterior: number
  valorNovo: number
  usuario: string
  createdAt: string
}

export interface StatusHistoryEntry {
  id: string
  organizationId?: string
  vehicleId: string
  de: VehicleStatus | ''
  para: VehicleStatus
  usuario: string
  createdAt: string
}

export interface Customer {
  id: string
  organizationId?: string
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
  organizationId?: string
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
  vendedorResponsavel: string
  observacoes: string
  lucroBruto: number
  lucroLiquido: number
  roi: number
  margem: number
  diasEstoque: number
  createdAt: string
  updatedAt: string
}

export interface Supplier {
  id: string
  organizationId?: string
  nome: string
  tipo: string
  telefone: string
  email: string
  cidade: string
  observacoes: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Payable {
  id: string
  organizationId?: string
  descricao: string
  categoria: ExpenseCategory | 'geral'
  valor: number
  vencimento: string
  status: PayableStatus
  fornecedorId?: string
  fornecedorNome: string
  vehicleId?: string
  observacao: string
  documentoUrl: string
  paidAt?: string
  createdAt: string
  updatedAt: string
}

export interface AuditLog {
  id: string
  organizationId?: string
  userId: string
  username: string
  action: string
  entityType: string
  entityId: string
  detail: string
  createdAt: string
}

export interface User {
  id: string
  organizationId?: string
  username: string
  password: string
  nome: string
  role: UserRole
  active: boolean
  createdAt: string
}

export interface OrgSettings {
  alertDaysWarn: number
  alertDaysAlert: number
  alertDaysCritical: number
  minMarginPercent: number
  brandConcentrationLimit: number
  lowStockDemandGap: number
  docExpiryWarnDays: number
}

/** Aparência visual editável por loja (template da marca). */
export type BrandAparencia = 'suave' | 'reta'
export type BrandPresetId = 'lp' | 'azul' | 'vermelho' | 'verde' | 'noite' | 'custom'

export interface BrandTheme {
  presetId: BrandPresetId
  corPrimaria: string
  corSecundaria: string
  corFundo: string
  corTexto: string
  corPainel: string
  aparencia: BrandAparencia
}

export interface Settings {
  id: string
  organizationId?: string
  nomeEmpresa: string
  /** Nome curto no header (ex.: marca sem “Gestor”). */
  nomeCurto: string
  slogan: string
  logo: string
  telefone: string
  whatsapp: string
  instagram: string
  email: string
  endereco: string
  cidade: string
  tema: 'light' | 'dark'
  modoEscuro: boolean
  brand: BrandTheme
  org: OrgSettings
  updatedAt: string
}

export interface HistoryEvent {
  id: string
  organizationId?: string
  vehicleId?: string
  type: HistoryEventType
  data: string
  hora: string
  descricao: string
  usuario: string
  createdAt: string
}

export interface Database {
  version: number
  organization?: Organization
  vehicles: Vehicle[]
  sales: Sale[]
  expenses: Expense[]
  customers: Customer[]
  users: User[]
  settings: Settings[]
  history: HistoryEvent[]
  documents: VehicleDocument[]
  checklists: VehicleChecklist[]
  priceHistory: PriceHistoryEntry[]
  statusHistory: StatusHistoryEntry[]
  suppliers: Supplier[]
  payables: Payable[]
  auditLogs: AuditLog[]
}

export interface VehicleFilters {
  search?: string
  marca?: string
  modelo?: string
  ano?: number
  cidade?: string
  cor?: string
  status?: VehicleStatus | ''
  combustivel?: FuelType | ''
  cambio?: TransmissionType | ''
  consignado?: boolean | null
  precoMin?: number
  precoMax?: number
  diasMin?: number
  diasMax?: number
  archived?: boolean
  inStock?: boolean
  documentacao?: 'ok' | 'pendente' | ''
  preparacao?: 'completa' | 'incompleta' | ''
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
  lucroPotencial: number
  ticketMedio: number
  diasMediosEstoque: number
  margemMedia: number
  capitalParado: number
  alertasCriticos: number
  docsPendentes: number
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

export interface RuleAlert {
  id: string
  severity: AlertSeverity
  category: AlertCategory
  title: string
  message: string
  recommendation?: string
  vehicleId?: string
  entityId?: string
  createdAt: string
}

export interface BuyOpportunity {
  id: string
  label: string
  tipo: 'marca' | 'modelo' | 'categoria' | 'faixa'
  score: number
  salesShare: number
  stockShare: number
  avgMargin: number
  avgDays: number
  recommendation: string
}

export interface PurchaseSimulation {
  marca: string
  modelo: string
  ano: number
  versao: string
  precoPedido: number
  custoEstimado: number
  precoVendaEstimado: number
  prazoEstimado: number
}

export interface PurchaseSimulationResult {
  custoTotal: number
  lucro: number
  margem: number
  risco: 'baixo' | 'medio' | 'alto'
  score: number
  notes: string[]
}

export interface VehicleScore {
  total: number
  parts: {
    documentacao: number
    margem: number
    tempoEstoque: number
    preparacao: number
    preco: number
    mercado: number
    capitalParado: number
  }
}
